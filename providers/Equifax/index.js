const { soap, soap: { WSSecurity } } = require('strong-soap');
const moment = require('moment-timezone');

class Equifax {
  constructor(config) {
    this._config = config;
  }

  getPersonByDni(dni) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`Timeout ${this._config.timeout} ms.`));
      }, this._config.timeout);

      const { url } = this._config.validarDocumento;

      const requestArgs = {
        DatosConsulta: {
          TipoPersona: 1,
          TipoDocumento: 1,
          NumeroDocumento: dni,
          CodigoReporte: 682,
        },
      };

      const sOptions = {
        passwordType: 'PasswordText',
        hasTimeStamp: false,
      };

      const wsSecurity = new WSSecurity(this._config.auth.username, this._config.auth.password, sOptions);
      soap.createClient(url, {}, (err, client) => {
        client.setSecurity(wsSecurity);
        client.GetReporteOnline(requestArgs, (err, data) => {
          if (err === null) {
            const modulo = data.ReporteCrediticio.Modulos.Modulo;
            const bday = modulo[0].Data.DirectorioPersona.FechaNacimiento.split('/');
            const body = {
              NumeroOperacion: data.ReporteCrediticio.NumeroOperacion,
              NumeroDocumento: data.ReporteCrediticio.DatosPrincipales.NumeroDocumento,
              PrimerNombre: modulo[0].Data.DirectorioPersona.PrimerNombre,
              SegundoNombre: modulo[0].Data.DirectorioPersona.SegundoNombre,
              ApellidoPaterno: modulo[0].Data.DirectorioPersona.ApellidoPaterno,
              ApellidoMaterno: modulo[0].Data.DirectorioPersona.ApellidoMaterno,
              Nombres: modulo[0].Data.DirectorioPersona.Nombres,
              FechaNacimiento: moment(`${bday[2]}-${bday[1]}-${bday[0]}`, 'YYYY-M-D').format('YYYY-MM-DD'),
              EstadoCivil: modulo[0].Data.DirectorioPersona.EstadoCivil,
              Nacionalidad: modulo[0].Data.DirectorioPersona.Nacionalidad,
              GradoInstruccion: modulo[0].Data.DirectorioPersona.GradoInstruccion,
              Ocupacion: modulo[0].Data.DirectorioPersona.Ocupacion,
              Sexo: modulo[0].Data.DirectorioPersona.Sexo,
            };
            let estadoCivilId = null;
            switch (body.EstadoCivil.substring(0, 3)) {
              case 'SOL':
                estadoCivilId = 1;
                break;
              case 'CAS':
                estadoCivilId = 2;
                break;
              case 'VIU':
                estadoCivilId = 3;
                break;
              case 'DIV':
                estadoCivilId = 6;
                break;
              case 'CON':
                estadoCivilId = 7;
                break;
              default:
                estadoCivilId = 6;
                break;
            }
            resolve({
              nombresApellidos: `${body.PrimerNombre} ${body.ApellidoPaterno} ${body.ApellidoMaterno}`,
              nombres: body.PrimerNombre,
              apellidoPaterno: body.ApellidoPaterno,
              apellidoMaterno: body.ApellidoMaterno,
              fechaNacimiento: body.FechaNacimiento,
              sexo: (body.Sexo === 'MASCULINO' ? 'M' : 'F'),
              estadoCivilId,
            });
          } else if (err.response.body.indexOf('soap:EC1070') === -1) {
            reject(new Error(err.response.body));
          } else {
            resolve(null);
          }
        });
      });
    });
  }
}

module.exports = Equifax;
