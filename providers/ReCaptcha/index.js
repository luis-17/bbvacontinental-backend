const axios = require('axios');

class ReCaptcha {
  constructor(config) {
    this.config = config;
  }

  async verify(response) {
    const { data: { success } } = await axios.post(this.config.url, null, {
      params: {
        secret: this.config.secret,
        response,
      },
    });
    return !!success;
  }
}

module.exports = ReCaptcha;
