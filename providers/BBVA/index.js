const axios = require('axios');
const log4js = require('log4js');
const fs = require('fs');
const https = require('https');
const path = require('path');

const log = log4js.getLogger('bbva');

if (process.env.NODE_ENV === 'production') {
  https.globalAgent.options.ca = fs.readFileSync(path.join(__dirname, '../../certs/BBVACCR.crt'));
}

const api = axios.create({
  timeout: 40000,
});

api.interceptors.request.use((request) => {
  log.trace('Starting Request:', request);
  return request;
});

api.interceptors.response.use((response) => {
  log.trace('Response:', response);
  return response;
});

class BBVAConti {
  constructor(config) {
    this._config = config;
  }

  async tsec() {
    const { url, payload, config } = this._config.tsec;
    const { headers: { tsec } } = await api.post(url, payload, config);
    return tsec;
  }

  async listaNegra({ dni }) {
    const tsec = await this.tsec();
    const { url } = this._config.listaNegra;
    const { data: { data } } = await api.get(url, {
      headers: {
        'Content-Type': 'application/json',
        tsec,
      },
      params: {
        'identityDocument.documentType.id': 'DNI',
        'identityDocument.documentNumber': dni,
      },
    });
    return data;
  }

  async ppm(params) {
    const tsec = await this.tsec();
    // console.log('ppmindexjs');
    const { url } = this._config.ppm;
    const paramsEntrada = {
      identityDocument: {
        type: {
          id: 'L',
        },
        number: params.dni,
      },
      customer: {
        id: '',
      },
      channel: 'CN',
      subchannel: 'CN',
      product: {
        id: 'CO',
        subproduct: {
          id: '',
        },
      },
      evaluation: {
        id: '',
      },
      process: '1',
      parameters: [
        {
          id: 'P_FECHA_NACIMIENTO',
          name: params.fechaNac,
        },
        {
          id: 'P_PROFESION',
          name: params.abvOcupacion,
        },
        {
          id: 'P_INGRESO_FIJO',
          name: params.ingresoFijo, // '1000.00'
        },
        {
          id: 'P_INGRESO_VARIABLE',
          name: params.ingresoVariable, // '0.00',
        },
        {
          id: 'P_CUOTAPR',
          name: params.cuotaPr, // '100.00',
        },
      ],
    };
    console.log(JSON.stringify(paramsEntrada), 'paramsEntrada');
    const { data } = await api.post(url, paramsEntrada, {
      headers: {
        'Content-Type': 'application/json',
        tsec,
      },
    });

    return data;
  }

  async evaluarCredito(arrParams) {
    const tsec = await this.tsec();
    const { url } = this._config.evaluarCredito;
    const dataEvaluador = {
      product: {
        id: 'CONSUME',
      },
      loanType: {
        id: 'FREE_INVESTMENT',
      },
      requestedAmount: {
        amount: arrParams.montoPrestamo,
        currency: 'PEN',
      },
      installmentPlan: {
        terms: {
          number: arrParams.plazo,
          frequency: 'MONTHLY',
        },
      },
      rates: [{
        unit: {
          percentage: arrParams.tasa,
        },
        rateType: {
          id: 'TEA',
        },
        mode: {
          id: 'PERCENTAGE',
        },
      }],
      applicationDate: `${arrParams.fechaActFormat}T00:00:00Z`,
      paymentDueDay: arrParams.diaPago,
      additionalProducts: [{
        id: 'LIFE_INSURANCES',
        productType: {
          id: 'INSURANCES',
        },
        classification: 'INITIAL_AMOUNT',
      }],
      birthDate: `${arrParams.fechaNacimiento}T00:00:00Z`,
      statementDeliveries: [{
        deliveryType: 'DIGITAL',
      }],
      isReducedSchedule: false,
      isReducedFees: false,
      indicators: [{
        id: 'INTEREST_CAPITALIZATION',
        isActive: true,
      }],
      periods: {
        gracePeriod: {
          number: arrParams.periodoGracia,
          id: 'MONTH',
        },
      },
    };
    if (!(arrParams.periodoGracia) || arrParams.periodoGracia === '0') {
      delete (dataEvaluador.periods);
    }
    console.log(JSON.stringify(dataEvaluador), 'dataEvaluadorxss llamada evaluador');
    const { data } = await api.post(url, dataEvaluador, {
      headers: {
        'Content-Type': 'application/json',
        tsec,
      },
    });
    return data;
  }
}

module.exports = BBVAConti;
