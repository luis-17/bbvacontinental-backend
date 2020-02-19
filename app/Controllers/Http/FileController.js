const httpStatus = require('http-status-codes');
const path = require('path');
const uuidv1 = require('uuid/v1');
const formidable = require('formidable');
const os = require('os');

const S3 = use('S3');

class FileController {
  async signedUrl(request, response) {
    const { query: { name, type: contentType } } = request;
    const extension = path.extname(name);
    const filename = uuidv1().replace(/-/g, '') + extension;
    const credentials = S3.s3Credentials({ filename, contentType });
    return response.json(credentials);
  }

  async uploadFile(request, response) {
    const form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = os.tmpdir();
    form.keepExtensions = true;
    form.maxFileSize = 5 * 1024 * 1024;
    form.multiples = false;
    form.parse(request, async (err, fields, files) => {
      if (err) {
        if (err.message.startsWith('maxFileSize')) {
          return response.status(httpStatus.BAD_REQUEST).json({
            message: 'El archivo excede el tama\u00F1o m\u00E1ximo permitido',
            data: err.message,
          });
        }
        return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'ERROR',
          data: err.message,
        });
      }
      try {
        const data = await S3.compressAndUpload(files.file);
        return response.status(httpStatus.OK).json({
          message: 'Ok',
          data,
        });
      } catch (err) {
        console.error(err);
        return response.status(httpStatus.BAD_REQUEST).json({
          message: err.message,
          data: null,
        });
      }
    });
  }
}

module.exports = FileController;
