const crypto = require('crypto');
const fs = require('fs');
const util = require('util');
const request = require('request');
const temp = require('temp');
const AWS = require('aws-sdk');
const path = require('path');
const uuidv1 = require('uuid/v1');
const hasha = require('hasha');
const moment = require('moment');

const archiver = require('archiver');
const PassThrough = require('stream').PassThrough; // eslint-disable-line
archiver.registerFormat(
  'zip-encryptable',
  require('archiver-zip-encryptable'),
);

function dateString() {
  const date = new Date().toISOString();
  return date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2);
}

function amzCredential(config) {
  return [config.accessKey, dateString(), config.region, 's3/aws4_request'].join('/');
}

// Constructs the policy
function s3UploadPolicy(config, params, credential) {
  return {
    // 5 minutes into the future
    expiration: new Date((new Date()).getTime() + (5 * 60 * 1000)).toISOString(),
    conditions: [
      { bucket: config.bucket },
      { key: params.filename },
      // { acl: 'public-read' }, // comentar en produccion
      { success_action_status: '201' },
      // Optionally control content type and file size
      // A content-type clause is required (even if it's all-permissive)
      // so that the uploader can specify a content-type for the file
      ['starts-with', '$Content-Type', ''],
      // ['content-length-range', 0, 1000],
      // ['content-length-range', 1048579, 10485760], // 1 to 10 MiB
      // ['content-length-range', 0, 1048576], // 0 to 1 MB
      ['content-length-range', 0, 5242880], // 0 to 5 MB
      { 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
      { 'x-amz-credential': credential },
      { 'x-amz-date': `${dateString()}T000000Z` },
      { 'Authorization': `AWS ${config.accessKey}:${config.secretKey}` }
    ],
  };
}

function hmac(key, string) {
  const $hmac = crypto.createHmac('sha256', key);
  $hmac.end(string);
  return $hmac.read();
}

// Signs the policy with the credential
function s3UploadSignature(config, policyBase64) {
  const dateKey = hmac(`AWS4${config.secretKey}`, dateString());
  const dateRegionKey = hmac(dateKey, config.region);
  const dateRegionServiceKey = hmac(dateRegionKey, 's3');
  const signingKey = hmac(dateRegionServiceKey, 'aws4_request');
  return hmac(signingKey, policyBase64).toString('hex');
}

// Returns the parameters that must be passed to the API call
function s3Params(config, params) {
  const credential = amzCredential(config);
  const policy = s3UploadPolicy(config, params, credential);
  const policyBase64 = Buffer.from(JSON.stringify(policy)).toString('base64');
  return {
    'Content-Type': params.contentType,
    // acl: 'public-read', // comentar en produccion
    success_action_status: '201',
    policy: policyBase64,
    'X-amz-algorithm': 'AWS4-HMAC-SHA256',
    'X-amz-credential': credential,
    'X-amz-date': `${dateString()}T000000Z`,
    'X-amz-signature': s3UploadSignature(config, policyBase64, credential),
    key: params.filename,
    'Authorization': `AWS ${config.accessKey}:${config.secretKey}`
  };
}

function compress(sourcePath, outputPath, flag = false) {
  return new Promise((resolve, reject) => {
    request({
      method: 'POST',
      url: 'https://tinypng.com/web/shrink',
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/octet-stream',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
      },
      body: fs.createReadStream(sourcePath),
      encoding: 'utf8',
    }, function (error, response, body) { // eslint-disable-line
      if (error) {
        return reject(error.message);
      }
      body = JSON.parse(body);
      if (body.error) {
        return reject(new Error(body.message));
      }
      request(body.output.url)
        .pipe(flag ? fs.createWriteStream(outputPath) : outputPath)
        .on('close', () => {
          if (error) reject(error.message);
          resolve();
        });
    });
  });
}

class S3 {
  constructor(config) {
    this._config = config;
    AWS.config.update({ accessKeyId: config.accessKey, secretAccessKey: config.secretKey });
    this.s3 = new AWS.S3();
  }

  s3Credentials(params) {
    return {
      postEndpoint: `https://${this._config.bucket}.s3.amazonaws.com`,
      signature: s3Params(this._config, params),
    };
  }

  async compressAndUpload(File) {
    try {
      const filename = path.basename(File.path).replace(/upload_/g, '');
      // creacion del stream temporal
      temp.track();
      const stream = temp.createWriteStream();
      // sube el archivo a tinypng y lo descarga optimizado
      await compress(File.path, stream);
      // se elimina el archivo original
      fs.unlinkSync(File.path);
      // se detiene el stream temporal
      stream.end();
      // se obtiene el contenido del stream
      const readFile = util.promisify(fs.readFile);
      const content = await readFile(stream.path);
      // configura el bucket
      const params = {
        Bucket: this._config.bucket,
        Key: filename,
        Body: content,
        ContentType: File.type,
      };
      // se sube el archivo
      // const data = await s3.putObject(params).promise();
      const data = await this.s3.upload(params).promise();
      // limpieza
      temp.cleanup();
      delete data.key;
      return data;
    } catch (err) {
      try {
        fs.unlinkSync(File.path);
      } catch (e) { /* empty */ }
      try {
        temp.cleanup();
      } catch (e) { /* empty */ }
      throw new Error(err.message);
    }
  }

  async upload(File) {
    try {
      const params = {
        Bucket: this._config.bucket,
        Key: `${uuidv1().replace(/-/g, '')}.pdf`,
        Body: File,
        ContentType: 'application/pdf',
      };
      // se sube el archivo
      const data = await this.s3.upload(params).promise();
      delete data.key;
      return data;
    } catch (err) {
      try {
        fs.unlinkSync(File.path);
      } catch (e) { /* empty */ }
      try {
        temp.cleanup();
      } catch (e) { /* empty */ }
      throw new Error(err.message);
    }
  }

  async zipAndUpload(buffer) {
    const zipName = `${Date.now()}`;
    const passThrough = new PassThrough();
    const archive = archiver('zip-encryptable', {
      password: zipName.split("").reverse().join(""),
    });
    const name = `reporte-convenios-${zipName}.xlsx`;
    archive.pipe(passThrough);
    archive.append(buffer, { name });
    archive.finalize();
    const params = {
      Bucket: this._config.bucket,
      Key: `${moment().format('DDMMYYYY')}-${zipName}.zip`,
      Body: passThrough,
      ContentType: 'application/zip, application/octet-stream, application/x-zip-compressed, multipart/x-zip', // application/vnd.ms-excel
    };
    const data = await this.s3.upload(params).promise();
    return data;
  }

  listObjects({ Bucket, ContinuationToken }) {
    return this.s3.listObjectsV2({
      Bucket,
      MaxKeys: 20,
      Delimiter: '/',
      ContinuationToken,
    }).promise();
  }

  deleteObject({ Bucket, Key }) {
    return this.s3.deleteObject({
      Bucket,
      Key,
    }).promise();
  }

  // retrieve object
  retrieveObject({ Bucket, Key }) {
    return this.s3.getObject({
      Bucket,
      Key,
    }).promise();
  }

}

module.exports = S3;
