// Code to encrypt data in sequelize fields

// We are using ascii85 as a way save on storage. Also, note that
// the space delimiter we are using is a bit of an abuse since in
// normal cases ascii85 will skip over it, but since we are using
// after encoding and before encoding, it shouldn't be an issue.
//
// Fields are broken down to facilitate unit testing.
//
// based on code here: http://vancelucas.com/blog/stronger-encryption-and-decryption-in-node-js/
//
// Use this when definiing your model. For example:
//
// model = {
//   myField: fieldEncryption('myField', {
//     type: Sequelize.STRING,
//     field: 'my_field'
//   });
// }
//

const crypto = require('crypto');
const ascii85 = require('ascii85');

const algorithm = 'aes-128-ctr';
// use something like `openssl rand -hex 11` to generate
// ensure this is not hard coded!!!
const key = 'C75s251tNDMZcmc=';

function encode85(text) {
  return ascii85.encode(text, { delimiter: false }).toString();
}

function decode85(text) {
  return ascii85.decode(text);
}

function encrypt85(value) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(value, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${encode85(iv)} ${encode85(encrypted)}`;
}

function decrypt85(value) {
  const textParts = value.split(' ');
  const iv = decode85(textParts.shift());
  const textIv = textParts.join(' ');
  const encryptedText = decode85(textIv);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

function fieldEncryption(fieldName, options = {}) {
  const ops = {
    set(val) {
      if (val && val !== null) {
        this.setDataValue(fieldName, encrypt85(val));
      } else {
        this.setDataValue(fieldName, null);
      }
    },
    get() {
      const value = this.getDataValue(fieldName);
      if (value && value !== null) {
        return decrypt85(value);
      }
      return null;
    },
  };

  return Object.assign(ops, options);
}

module.exports.fieldEncryption = fieldEncryption;
