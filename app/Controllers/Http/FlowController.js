const log4js = require('log4js');
const httpStatus = require('http-status-codes');

const log = log4js.getLogger('app');

class FlowController {
  async show(request, response) {
    log.debug(request.user);
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: null,
    });
  }
}

module.exports = FlowController;
