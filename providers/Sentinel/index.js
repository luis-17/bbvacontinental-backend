const axios = require('axios');
const log4js = require('log4js');

const log = log4js.getLogger('sentinel');

const api = axios.create({
  timeout: 40000,
});

api.interceptors.request.use((request) => {
  log.trace('Starting request: ', request);
  return request;
});

api.interceptors.response.use((response) => {
  log.trace('Response: ', response);
  return response;
});

class Sentinel {
  constructor(config) {
    this._config = config;
  }

  async getPersonByDni(dni) {
    const { url } = this._config.validarDocumento;
    const { data } = await api.post(url, {
      Gx_UsuEnc: this._config.auth.username,
      Gx_PasEnc: this._config.auth.password,
      Gx_Key: this._config.auth.key,
      TipoDoc: 'D',
      NroDoc: dni,
    }, {
      timeout: this._config.timeout,
    });

    try {
      if (data.soafulloutput.InfBas) {
        const body = {
          NumeroDocumento: data.soafulloutput.InfBas.NDoc,
          ApellidoPaterno: data.soafulloutput.InfBas.ApePat,
          ApellidoMaterno: data.soafulloutput.InfBas.ApeMat,
          Nombres: data.soafulloutput.InfBas.Nom,
          FechaNacimiento: data.soafulloutput.InfBas.FecNac,
          EstadoCivil: '',
          Nacionalidad: '',
          GradoInstruccion: '',
          Ocupacion: '',
          Sexo: data.soafulloutput.InfBas.Sex,
        };
        const resolve = {
          nombresApellidos: body.Nombres,
          nombres: body.Nombres,
          apellidoPaterno: body.ApellidoPaterno,
          apellidoMaterno: body.ApellidoMaterno,
          fechaNacimiento: body.FechaNacimiento,
          sexo: (body.Sexo === 'MASCULINO' ? 'M' : 'F'),
          estadoCivilId: body.EstadoCivil,
        };
        return resolve;
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = Sentinel;
