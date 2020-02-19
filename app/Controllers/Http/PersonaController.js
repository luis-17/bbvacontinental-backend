const log4js = require('log4js');
const httpStatus = require('http-status-codes');

const Sentinel = use('Sentinel');

const log = log4js.getLogger('app');

class PersonaController {

  async getPersonByDni(request, response) {
    log.debug('getPersonByDni');
    const { dni } = request.params;
    if (process.env.NODE_ENV === 'production' && process.env.DNIS_ALLOWED.indexOf(dni) === -1) {
      return response.status(httpStatus.BAD_REQUEST).json({
        message: 'DNI no autorizado para consulta.',
        data: null,
      });
    }
    const person = await Sentinel.getPersonByDni(dni);
    if (person) {
      return response.status(httpStatus.OK).json({
        message: 'OK',
        data: person,
      });
    }
    return response.status(httpStatus.BAD_REQUEST).json({
      message: 'El n\u00FAmero de documento no existe',
      data: null,
    });
  }

}

module.exports = PersonaController;
