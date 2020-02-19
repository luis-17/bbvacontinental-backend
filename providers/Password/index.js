const argon2 = require('argon2');

class Password {
  constructor(config) {
    this.config = config;
  }

  async hash(plainTextPassword) {
    const hash = await argon2.hash(plainTextPassword);
    return hash;
  }

  async compare(plainTextPassword, hash) {
    const match = await argon2.verify(hash, plainTextPassword);
    return match;
  }
}

module.exports = Password;
