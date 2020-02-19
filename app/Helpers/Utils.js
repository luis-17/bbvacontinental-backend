const filter = require('filter-object');

// const fs = require('fs');
const JSZip = require('jszip');
const uuidv1 = require('uuid/v1');

const stringConstructor = 'test'.constructor;
const arrayConstructor = [].constructor;
const objectConstructor = {}.constructor;

class Utils {
  static generateZIP(contenido) {
    return new Promise((resolve) => {
      const zipXLS = new JSZip();
      const filename = `${uuidv1().replace(/-/g, '')}.xlsx`;
      zipXLS.file(filename, contenido);
      zipXLS.generateAsync({ type: 'nodebuffer' })
        .then((content) => {
          resolve(content);
        });
    });
  }

  static isEqual(value, other, fields) {
    if (fields) {
      value = filter(value, fields);
      other = filter(other, fields);
    }
    // Create arrays of property names
    const aProps = Object.getOwnPropertyNames(value);
    const bProps = Object.getOwnPropertyNames(other);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length !== bProps.length) {
      return false;
    }

    let propName;
    for (let i = 0; i < aProps.length; i += 1) {
      propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (value[propName] !== other[propName]) {
        return false;
      }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
  }

  static dynamicSort(property) {
    let sortOrder = 1;

    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }

    return function (a, b) {
      if (sortOrder === -1) {
        return b[property].localeCompare(a[property]);
      }
      return a[property].localeCompare(b[property]);
    };
  }

  static currencyFormat(num) {
    return `S/${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
  }

  static whatIsIt(object) {
    if (object === null) {
      return 'null';
    }
    if (object === undefined) {
      return 'undefined';
    }
    if (object.constructor === stringConstructor) {
      return 'string';
    }
    if (object.constructor === arrayConstructor) {
      return 'array';
    }
    if (object.constructor === objectConstructor) {
      return 'object';
    }
    return (typeof object);
  }

  static assign(target, source) {
    if (source !== null) {
      Object.keys(source).filter(key => key in target).forEach((key) => {
        if (Utils.whatIsIt(target[key]) === 'object' && Utils.whatIsIt(source[key]) === 'object') {
          Utils.assign(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      });
    }
    return target;
  }

  static calcularEdad(fechaNacimiento) {
    const diffMilisegundos = Date.now() - new Date(fechaNacimiento).getTime();
    const ageDate = new Date(diffMilisegundos);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  static obtenerDireccion(clienteVivienda) {
    const tipoVia = clienteVivienda.TipoVia.nombre;
    const tipoUbicacion = clienteVivienda.TipoUbicacion.nombre;
    const {
      nombreVia,
      manzana,
      lote,
      numExterior,
      numInterior,
      nombreUbicacion,
    } = clienteVivienda;
    const direccion = `${tipoVia && tipoVia !== 'NO APLICA' ? tipoVia : ''}
                      ${nombreVia ? ` ${nombreVia}` : ''}
                      ${manzana ? ` ${manzana}` : ''}
                      ${lote ? ` ${lote}` : ''}
                      ${numExterior ? ` ${numExterior}` : ''}
                      ${numInterior ? ` ${numInterior}` : ''}
                      ${tipoUbicacion && tipoUbicacion !== 'NO APLICA' ? ` ${tipoUbicacion}` : ''}
                      ${nombreUbicacion ? ` ${nombreUbicacion}` : ''}`;

    return direccion.trim();
  }

  /* **********************************************
  *              Present Value                  *
  * pv = fv / (1 + (rate / freq))^periods       *
  * pv = Present Value                          *
  * fv = Future Value                           *
  * rate = interest rate (expressed as %)       *
  * freq = compounding frequency                *
  * periods = number of periods until maturity  *
  ********************************************** */
  static calcularValorActual(rate, periods, payment) {
    // Initialize type
    const type = 0;
    const future = 0;
    // Return present value
    if (rate === 0) {
      return -payment * periods - future;
    }
    // eslint-disable-next-line no-restricted-properties
    return (((1 - Math.pow(1 + rate, periods)) / rate) * payment * (1 + rate * type) - future) / Math.pow(1 + rate, periods);
  }

  // static getProximoMultiplo(plazo, multiplo) {
  //   const resto = plazo % multiplo;
  //   if (resto === 0) {
  //     return plazo;
  //   } else {
  //     for (plazo; plazo % multiplo) {

  //       plazo+=1;
  //     }
  //   }
  // }

  static calcularValorActualRecursivo(rate, periods, payment, montoPrestamo, interes) {
    const Const = use('App/Helpers/Const');
    let valorActual = 0;
    const arrPlazo = [];
    const arrVA = [];
    let flagCalculo = false;
    let strPlazo = null;
    let strVA = null;
    for (periods; periods <= Const.simulador.plazoMaximo;) {
      valorActual = (this.calcularValorActual(rate, periods, payment) * -1);
      console.log(rate, periods, payment, valorActual, montoPrestamo, 'rate, periods, payment, valorActual, montoPrestamo');
      const valorActualMasYapa = valorActual - (interes * Const.simulador.plazoMaximo);
      console.log(valorActualMasYapa, 'valorActualMasYapa');
      if (valorActualMasYapa > montoPrestamo) {
        arrPlazo.push(periods);
        arrVA.push(valorActual);
        flagCalculo = true;
      }
      periods += 1;
    }
    if (arrPlazo.length > 0) {
      ([strPlazo] = arrPlazo);
      ([strVA] = arrVA);
    }
    return {
      flag: flagCalculo,
      plazo: strPlazo,
      va: strVA,
    };
  }

  static calcularPeriodoGracia(diaPago, diaCorte) {
    const momentoActual = new Date();
    const diaActual = momentoActual.getDate();
    let periodoGracia = null;
    if (diaCorte > diaPago) {
      if (diaActual > diaPago && diaActual <= diaCorte) {
        periodoGracia = 0;
      } else {
        periodoGracia = 1;
      }
    }
    if (diaCorte < diaPago) {
      if (diaActual <= diaPago && diaActual > diaCorte) {
        periodoGracia = 2;
      } else {
        periodoGracia = 1;
      }
    }
    if (diaCorte === diaPago) {
      periodoGracia = 0;
    }
    return periodoGracia;
  }

  static calcularTEAMensual(tea) {
    const teaDec = (tea / 100);
    // eslint-disable-next-line no-restricted-properties
    return Math.pow((1 + teaDec), (30 / 360)) - 1;
  }

  static obtenerNumeroCenteno(numero) {
    if (!numero) {
      return 0;
    }
    const resto = numero % 100;
    const result = numero - resto;
    return result;
  }

  static getTypeForMimeType(mimetype) {
    console.log(mimetype, 'mimetypemimetype');
    if (!mimetype) {
      return null;
    }
    const abv = mimetype.substring(0, 5);
    console.log(abv, 'abvabv');
    if (abv === 'image') {
      return 'img';
    }
    if (abv === 'appli') {
      return 'pdf';
    }
    return null;
  }

  static pluck(arrayObject, key) {
    const result = arrayObject.map(item => item[key]);
    return result;
  }
}

module.exports = Utils;
