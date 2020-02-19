const httpStatus = require('http-status-codes');

class BBVAIpAllowedMiddleware {
  async check(request, response, next) {
    const { ip } = request;
    if (process.env.BBVA_IPS_ALLOWED.indexOf(ip) === -1) {
      return response.status(httpStatus.UNAUTHORIZED).json({
        message: 'IP no autorizada',
        data: null,
      });
    }
    return next();
  }
}

module.exports = BBVAIpAllowedMiddleware;
