const axios = require('axios');

// const Utils = use('App/Helpers/Utils');
const Database = use('Database');
// const moment = require('moment');

// const Solicitud = use('App/Models/Solicitud');
// const momentTZ = require('moment-timezone');
const Solicitud = Database.model('Solicitud');

class Lector {
  constructor(config) {
    this._config = config;
  }

  async enviarSolicitudDocumentos(data) {
    const { solicitudId, fechaReenvioLector, fechaEnvioLector } = data;
    const dataToLector = {
      dni: data.dni,
      solicitudId: data.solicitudId,
      solicitante: data.solicitante,
      fechaEnvioLector: data.fechaEnvioLector,
      fechaReenvioLector: data.fechaReenvioLector, // '2019-04-25 09:00:00',
      empresaConvenioId: data.empresaConvenioId,
      nombreComercial: data.nombreComercial,
      frecuenciaPago: data.frecuenciaPago,
      cantidadMeses: data.cantidadMeses,
      tipoIngreso: data.tipoIngreso, // F ó V
      // formato "documentos":
      //    solicitudDocumentoId:
      //    url
      //    tipo
      documentos: data.arrDocumentos,
      // formato "documentosSubrogado"
      //    solicitudDocumentoId:
      //    institucionFinanciera
      //      id
      //      nombre
      documentosSubrogado: data.arrDocumentosSubrogado,
      contactos: [
        {
          nombres: data.contacto.nombres,
          celular: data.contacto.celular,
          correo: data.contacto.correo,
          tipo: data.contacto.tipo,
          numeroDocumento: data.contacto.numeroDocumento,
        },
      ],
    };
    console.log(dataToLector, 'dataToLectorggg');
    try {
      const urlLector = `${this._config.url}/solicitudes`;
      Solicitud.bloquearLector({ solicitudId, fechaEnvioLector, fechaReenvioLector });
      // console.log('bloquear lector');
      // console.log(dataToLector, 'dataToLector wss');
      const responseLector = axios.post(urlLector, dataToLector).catch((error) => {
        console.log(error, 'error.response.data');
        setTimeout(() => {
          Solicitud.desbloquearLector({ solicitudId }, JSON.stringify(error.response.data));
          console.log('desbloquear lector');
        }, 2000);
      }); // asincrono
      return {
        headers: responseLector.headers,
        data: responseLector.data,
      };
    } catch (error) {
      console.log(error);
      // const error = this.errorAxios(e);
      throw error;
    }
  }
}

module.exports = Lector;
