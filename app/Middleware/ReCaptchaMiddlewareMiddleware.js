const httpStatus = require('http-status-codes');

const ReCaptcha = use('ReCaptcha');

class ReCaptchaMiddlewareMiddleware {
  async check(request, response, next) {
    const { recaptcha } = request.body;
    if (process.env.NODE_ENV === 'production') {
      const success = await ReCaptcha.verify(recaptcha);
      if (success) {
        return next();
      }
      return response.status(httpStatus.BAD_REQUEST).json({
        message: 'ReCAPTCHA inv\u00E1lido',
        data: null,
      });
    }
    return next();
  }
}

module.exports = ReCaptchaMiddlewareMiddleware;
