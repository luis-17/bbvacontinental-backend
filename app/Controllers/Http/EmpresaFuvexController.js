const httpStatus = require('http-status-codes');

const EmpresaFuvex = use('App/Models/EmpresaFuvex');

class EmpresaFuvexController {
  async listarEmpresasFuvex(request, response) {
    const arrList = await EmpresaFuvex.listarEmpresasFuvex();
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: arrList.map(row => row.toJSON()),
    });
  }
}
module.exports = EmpresaFuvexController;
