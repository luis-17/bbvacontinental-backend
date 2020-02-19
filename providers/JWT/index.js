const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const defaults = require('defaults');

class JWT {
  constructor(config) {
    this._config = config;
    this.privateKey = fs.readFileSync(path.join(config.keyStore, config.privateKey));
    this.publicKey = fs.readFileSync(path.join(config.keyStore, config.publicKey));
  }

  sign(payload, options = {}) {
    options = defaults(options, {
      algorithm: this._config.algorithm,
    });
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.privateKey, options, (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      });
    });
  }

  verify(token, options = {}) {
    options = defaults(options, {
      algorithms: [this._config.algorithm],
    });
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.publicKey, options, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }
}

module.exports = JWT;
