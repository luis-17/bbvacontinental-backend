const axios = require('axios');

class SMS {
  constructor(config) {
    this.config = config;
    this.axios = axios.create({
      baseURL: config.url,
      auth: {
        username: config.accessKey,
        password: config.secretKey,
      },
    });
  }

  async send(to, text) {
    const { data: result } = await this.axios.post('/', { to, text });
    if (result.messages[0].status.name === 'PENDING_ENROUTE') {
      return true;
    }
    throw new Error(result.messages[0].status.name);
  }
}

module.exports = SMS;
