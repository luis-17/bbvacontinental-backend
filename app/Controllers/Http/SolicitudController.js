const httpStatus = require('http-status-codes');
const filter = require('filter-object');
const copyProps = require('copy-props');
const { serial } = require('items-promise');
const formatDecimal = require('format-decimal');
const moment = require('moment');

const Utils = use('App/Helpers/Utils');
const Response = use('App/Helpers/Response');

const Cliente = use('App/Models/Cliente');
const ClienteVivienda = use('App/Models/ClienteVivienda');
const ClienteLaboral = use('App/Models/ClienteLaboral');
const Solicitud = use('App/Models/Solicitud');
const Empresa = use('App/Models/Empresa');
const Documento = use('App/Models/Documento');
const Colaborador = use('App/Models/Colaborador');
const DocumentoEmpresa = use('App/Models/DocumentoEmpresa');
const SolicitudDocumento = use('App/Models/SolicitudDocumento');
const EstadoSolicitud = use('App/Models/EstadoSolicitud');
const EmpresaConvenio = use('App/Models/EmpresaConvenio');
const HistoriaSimulador = use('App/Models/HistoriaSimulador');
const Sentinel = use('Sentinel');

const BBVAConvenios = use('BBVA/Convenios');
const Lector = use('Lector');

const Const = use('App/Helpers/Const');

const EmailSolicitudAprobadaFuvex = use('Email/SolicitudAprobadaFuvex');
const EmailSolicitudAprobadaRrhh = use('Email/SolicitudAprobadaRrhh');
const EmailSolicitudDesembolsadaNuevo = use('Email/SolicitudDesembolsadaNuevo');
const EmailSolicitudDesembolsadaSubro = use('Email/SolicitudDesembolsadaSubro');
const EmailSolicitudRechazadaVarios = use('Email/SolicitudRechazadaVarios');
const EmailSolicitudObservadaAnalista = use('Email/SolicitudObservadaAnalista');

class SolicitudController {
  async registrarClientePersonal(request, response) {
    const {
      clienteId,
      tipoDocumentoId,
      numDocumento,
      estadoCivilId,
      fechaVencimientoDoi,
      tipoDoiConyugue,
      numDoiConyugue,
      vistaHTML,
    } = request.body;

    const cliente = clienteId ? await Cliente.findByPk(clienteId) : Cliente.build();
    // console.log(tipoDocumentoId, 'tipoDocumentoId');
    cliente.tipoDocumentoId = tipoDocumentoId;
    cliente.numDocumento = numDocumento;
    cliente.estadoCivilId = estadoCivilId;
    cliente.fechaVencimientoDoi = fechaVencimientoDoi;
    cliente.tipoDoiConyugue = tipoDoiConyugue;
    cliente.numDoiConyugue = null;
    if (numDoiConyugue) {
      cliente.numDoiConyugue = Buffer.from(numDoiConyugue.toString()).toString('base64');
    }


    const fPerson = await Sentinel.getPersonByDni(numDocumento);
    cliente.nombres = fPerson.nombres;
    cliente.apellidoPaterno = fPerson.apellidoPaterno;
    cliente.apellidoMaterno = fPerson.apellidoMaterno;
    cliente.fechaNacimiento = fPerson.fechaNacimiento;
    cliente.sexo = fPerson.sexo;
    console.log('aqui buf');
    cliente.numDocumento = Buffer.from(numDocumento).toString('base64');
    cliente.nombres = Buffer.from(fPerson.nombres).toString('base64');
    cliente.apellidoPaterno = Buffer.from(fPerson.apellidoPaterno).toString('base64');
    cliente.apellidoMaterno = Buffer.from(fPerson.apellidoMaterno).toString('base64');
    // Buffer.from(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Regular.ttf'], 'base64')
    console.log(cliente.numDocumento, '64BT');
    if (estadoCivilId === 2) {
      const fPersonConyugue = await Sentinel.getPersonByDni(numDoiConyugue);
      cliente.nombreConyugue = Buffer.from(fPersonConyugue.nombresApellidos).toString('base64');
    } else {
      cliente.nombreConyugue = null;
    }

    const [_cliente, _solicitud] = await cliente.registrarClientePersonal({
      colaboradorId: request.colaborador.id,
      vistaHTML,
    });

    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: {
        cliente: filter(_cliente.toJSON(), ['id', 'numDocumento', 'nombres', 'apellidoPaterno', 'apellidoMaterno']),
        solicitud: filter(_solicitud.toJSON(), ['id', 'estado']),
      },
    });
  }

  async regresarClientePersonal(request, response) { // get
    const { clienteId } = request.query;
    const fClienteAux = await Solicitud.verResumenDeCliente(clienteId, false);
    const fCliente = {
      cliente: filter(fClienteAux ? fClienteAux.toJSON() : {},
        [
          'numDocumento',
          'fechaVencimientoDoi',
          'nombres',
          'apellidoPaterno',
          'apellidoMaterno',
          'fechaNacimiento',
          'sexo',
          'tipoDocumentoId',
          'estadoCivilId',
          'tipoDoiConyugue',
          'numDoiConyugue',
          'nombreConyugue',
        ]),
    };
    // actualizar check de confirmacion al regresar
    const fOnlyCliente = await Cliente.findByPk(clienteId);
    // console.log(request.query, 'request.query');
    fOnlyCliente.confDatosCorrectos = 0;
    fOnlyCliente.save();
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: fCliente,
    });
  }

  async registrarClienteVivienda(request, response) {
    const { _cliente } = request;
    let _clienteVivienda = null;
    _clienteVivienda = await ClienteVivienda.findOne({
      where: { clienteId: _cliente.id },
    });
    // return false;
    if (_clienteVivienda) {
      // existente
      // console.log(request.body, 'post body entre');
      // copyProps(request.body, _clienteVivienda);
      const fData = {};
      fData.id = _clienteVivienda.id;
      fData.clienteId = request.body.clienteId;
      fData.correoElectronico = request.body.correoElectronico;
      fData.departamentoId = request.body.departamentoId;
      fData.distritoId = request.body.distritoId;
      fData.gastosAlquiler = request.body.gastosAlquiler;
      fData.lote = request.body.lote;
      fData.manzana = request.body.manzana;
      fData.nombreUbicacion = request.body.nombreUbicacion;
      fData.nombreVia = request.body.nombreVia;
      fData.numCelular = request.body.numCelular;
      fData.numExterior = request.body.numExterior;
      fData.numInterior = request.body.numInterior;
      fData.numUnidadFam = request.body.numUnidadFam;
      fData.operadorId = request.body.operadorId;
      fData.paisId = request.body.paisId;
      fData.provinciaId = request.body.provinciaId;
      fData.referencia = request.body.referencia;
      fData.resideDesde = request.body.resideDesde;
      fData.relacionViviendaId = request.body.relacionViviendaId;
      fData.tipoUbicacionId = request.body.tipoUbicacionId;
      fData.tipoViaId = request.body.tipoViaId;
      fData.vistaHTML = request.body.vistaHTML;
      const _solicitud = await Solicitud.findOne({ where: { clienteId: _cliente.id } });
      fData.solicitudId = _solicitud.id;
      // console.log(fData, 'clienteVivienda despues');
      // return false;
      await ClienteVivienda.saveClienteVivienda(fData);
    } else {
      // nuevo
      const fSolicitud = await Solicitud.verSolicitudPorCliente(_cliente.id);
      request.body.solicitudId = fSolicitud.id;
      _clienteVivienda = await Solicitud.registrarClienteVivienda(request.body);
    }
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: _clienteVivienda,
    });
  }

  async regresarClienteVivienda(request, response) { // get
    const { clienteId } = request.query;
    const fClienteAux = await Solicitud.verResumenDeCliente(clienteId, false);
    const fCliente = {
      clienteVivienda: filter(fClienteAux.ClienteVivienda ? fClienteAux.ClienteVivienda.toJSON() : {},
        [
          'paisId',
          'departamentoId',
          'provinciaId',
          'distritoId',
          'tipoViaId',
          'nombreVia',
          'manzana',
          'lote',
          'numExterior',
          'numInterior',
          'nombreUbicacion',
          'tipoUbicacionId',
          'referencia',
          'resideDesde',
          'relacionViviendaId',
          'gastosAlquiler',
          'numUnidadFam',
          'numCelular',
          'correoElectronico',
          'operadorId',
        ]),
    };
    // actualizar check de confirmacion al regresar
    const fOnlyCliente = await Cliente.findByPk(clienteId);
    fOnlyCliente.confDatosCorrectos = 0;
    fOnlyCliente.save();
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: fCliente,
    });
  }

  async registrarClienteLaboral(request, response) {
    const { _cliente } = request;
    const colaboradorId = request.colaborador.id;
    let _clienteLaboral = null;
    const { numDocumento } = _cliente;
    const empresaConvenio = await EmpresaConvenio.findById(request.body);
    const { ruc } = empresaConvenio.Empresa;
    const solicitudPendiente = await Solicitud.pendientePorClienteInstitucion({ numDocumento, ruc, clienteId: _cliente.id });

    if (solicitudPendiente) {
      try {
        await Solicitud.rechazarPorSolicitudEnCurso({ clienteId: request.body.clienteId, empresaConvenioId: solicitudPendiente.CampaniaConvenio.id, colaboradorId });
        return response.status(httpStatus.BAD_REQUEST).json({
          message: Response.SolicitudEnProceso,
          data: null,
        });
      } catch (e) {
        return response.status(httpStatus.BAD_REQUEST).json({
          message: 'La solicitud se encuentra cerrada.',
          data: null,
        });
      }
    }

    _clienteLaboral = await ClienteLaboral.findOne({ where: { clienteId: _cliente.id } });
    if (_clienteLaboral) {
      // existente
      copyProps(request.body, _clienteLaboral);
      const _solicitud = await Solicitud.findOne({ where: { clienteId: _cliente.id } });
      _clienteLaboral.solicitudId = _solicitud.id;
      await ClienteLaboral.saveClienteLaboral(_clienteLaboral);
      // await _clienteLaboral.save();
    } else {
      // nuevo
      const fSolicitud = await Solicitud.verSolicitudPorCliente(_cliente.id);
      request.body.solicitudId = fSolicitud.id;
      _clienteLaboral = await Solicitud.registrarClienteLaboral(request.body);
    }
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: _clienteLaboral,
    });
  }

  async regresarClienteLaboral(request, response) { // get
    const { clienteId } = request.query;
    const fClienteAux = await Solicitud.verResumenDeCliente(clienteId, false);
    const fCliente = {
      clienteLaboral: filter(fClienteAux.ClienteLaboral ? fClienteAux.ClienteLaboral.toJSON() : {},
        [
          'empresaConvenioId',
          'ocupacionId',
          'inicioLaboral',
          'registroEmpresa',
          'FrecuenciaPago',
          'CondicionLaboral',
          // 'ingresos',
          'tipoIngreso',
        ]),
    };
    fCliente.clienteLaboral.frecuenciaPagoId = fClienteAux.ClienteLaboral ? fClienteAux.ClienteLaboral.FrecuenciaPago.id : null;
    fCliente.clienteLaboral.condicionLaboralId = fClienteAux.ClienteLaboral ? fClienteAux.ClienteLaboral.CondicionLaboral.id : null;
    fCliente.clienteLaboral.actividadEconomicaId = fClienteAux.ClienteLaboral ? fClienteAux.ClienteLaboral.EmpresaConvenio.Empresa.actividadEconomicaId : null;
    fCliente.clienteLaboral.cantMesesVariable = fClienteAux.ClienteLaboral ? fClienteAux.ClienteLaboral.EmpresaConvenio.cantMesesVariable : null;
    fCliente.clienteLaboral.montoMaximoPrestamo = fClienteAux.ClienteLaboral ? fClienteAux.ClienteLaboral.EmpresaConvenio.montoMaximoPrestamo : null;
    fCliente.clienteLaboral.montoMinimoPrestamo = fClienteAux.ClienteLaboral ? fClienteAux.ClienteLaboral.EmpresaConvenio.montoMinimoPrestamo : null;

    // actualizar check de confirmacion al regresar
    const fOnlyCliente = await Cliente.findByPk(clienteId);
    fOnlyCliente.confDatosCorrectos = 0;
    fOnlyCliente.save();
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: fCliente,
    });
  }

  async verResumenDeCliente(request, response) { // get
    const { clienteId } = request.query;
    const fClienteAux = await Solicitud.verResumenDeCliente(clienteId, true);
    // console.log(fClienteAux, 'fClienteAux.toJSON()');
    const fCliente = {
      FrecuenciaPago: fClienteAux.ClienteLaboral.FrecuenciaPago,
      CondicionLaboral: fClienteAux.ClienteLaboral.CondicionLaboral,
      registroEmpresa: fClienteAux.ClienteLaboral.registroEmpresa,
      empresaConvenio: filter(fClienteAux.ClienteLaboral.EmpresaConvenio.Empresa.toJSON(),
        ['nombreComercial', 'nombreLegal', 'ruc', 'ActividadEconomica']),
      cliente: filter(fClienteAux.toJSON(),
        ['id', 'numDocumento', 'fechaVencimientoDoi', 'nombres', 'apellidoPaterno', 'apellidoMaterno', 'fechaNacimiento', 'nombreApellidoCompleto', 'tipoDoiConyugue', 'numDoiConyugue', 'nombreConyugue', 'estadoCivilId']),
      clienteVivienda: filter(fClienteAux.ClienteVivienda.toJSON(),
        ['id', 'referencia', 'resideDesde', 'gastosAlquiler', 'numUnidadFam', 'correoElectronico', 'numCelular', 'Operador']),
      pais: {
        id: fClienteAux.ClienteVivienda.Pais.id,
        nombre: fClienteAux.ClienteVivienda.Pais.nombre,
      },
      departamento: {
        id: fClienteAux.ClienteVivienda.Departamento.id,
        nombre: fClienteAux.ClienteVivienda.Departamento.nombre,
      },
      provincia: {
        id: fClienteAux.ClienteVivienda.Provincia.id,
        nombre: fClienteAux.ClienteVivienda.Provincia.nombre,
      },
      distrito: {
        id: fClienteAux.ClienteVivienda.Distrito.id,
        nombre: fClienteAux.ClienteVivienda.Distrito.nombre,
      },
      estadoCivil: {
        id: fClienteAux.EstadoCivil.id,
        nombre: fClienteAux.EstadoCivil.nombre,
      },
    };
    fCliente.cliente.direccion = Utils.obtenerDireccion(fClienteAux.ClienteVivienda);

    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: fCliente,
    });
  }

  async confirmarDatosCliente(request, response) {
    const { clienteId } = request.body;
    const fSolicitud = await Solicitud.verSolicitudPorCliente(clienteId);
    request.body.solicitudId = fSolicitud.id;
    await Solicitud.confirmarDatosCliente(request.body);
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: null,
    });
  }

  async registrarEvaluacion(request, response) {
    const {
      empresaConvenioId,
      solicitudId,
      tipoProducto,
      flagNext,
    } = request.body;
    const colaboradorId = request.colaborador.id;
    const fColaborador = await Colaborador.findOne({ where: { id: colaboradorId } });
    const arrDocumentos = request.body.documentos;
    const arrDocumentosFilter = [];
    const arrErrors = [];
    const fSolicitud = await Solicitud.findByIdWithCliente({ solicitudId });
    const {
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      ClienteVivienda,
    } = fSolicitud.Cliente;
    const {
      nombres: colNombres,
      celular: colCelular,
      correo: colCorreo,
      numeroDocumento: colNumeroDocumento,
    } = fSolicitud.Colaborador;
    const { tipoIngreso } = fSolicitud.Cliente.ClienteLaboral;
    const { codigo } = fSolicitud.Cliente.ClienteLaboral.Ocupacion;
    const { multiplo } = fSolicitud.Cliente.ClienteLaboral.FrecuenciaPago;
    const { cantMesesVariable } = fSolicitud.Cliente.ClienteLaboral.EmpresaConvenio;
    // VALIDAR CANTIDAD DE DOCUMENTOS

    // const { cantMesesVariable } = EmpresaConvenio || 0;
    let cantMeses = 1;
    if (fSolicitud.Cliente.ClienteLaboral.tipoIngreso === 'V') {
      cantMeses = cantMesesVariable;
    }
    let cantBoletas = multiplo * cantMeses;
    if (cantBoletas === 12) {
      cantBoletas = 15;
    }
    console.log(cantBoletas, 'cantBoletasddd');
    // VALIDAR MINIMO 1 BOLETA
    if (arrDocumentos.length < 1 && cantBoletas === 1 && flagNext === 'S') {
      return response.status(httpStatus.BAD_REQUEST).json({
        message: 'Debes adjuntar una boleta.',
        data: null,
      });
    }
    // VALIDAR MINIMO 3 BOLETAS
    if (arrDocumentos.length < 3 && cantBoletas === 3 && flagNext === 'S') {
      return response.status(httpStatus.BAD_REQUEST).json({
        message: 'Debes adjuntar tres boletas.',
        data: null,
      });
    }
    // VALIDAR MINIMO 12 BOLETAS
    if (arrDocumentos.length < 12 && cantBoletas === 15 && flagNext === 'S') {
      return response.status(httpStatus.BAD_REQUEST).json({
        message: 'Debes adjuntar como mínimo 12 boletas.',
        data: null,
      });
    }
    const arrParams = {
      dni: fSolicitud.Cliente.numDocumento,
      fechaNac: moment(fSolicitud.Cliente.fechaNacimiento).format('DDMMYYYY'), // format: '01011991'
      abvOcupacion: codigo,
      // cuotaSubrog:
    };
    let arrResultLN = [];
    const arrResultLNAux = await BBVAConvenios.listaNegra(arrParams);
    // console.log(arrResultLNAux, 'arrResultLNAux');
    console.log(arrResultLNAux, 'arrResultLNAux');
    arrResultLN = arrResultLNAux;
    if (arrResultLN[0].isBlocked === true) { // si se encuentra en lista negra
      await Solicitud.rechazarPorListaNegra({ empresaConvenioId, solicitudId, colaboradorId });
      // CLIENTE
      EmailSolicitudRechazadaVarios.send({
        to: ClienteVivienda.correoElectronico,
        dynamic_template_data: {
          fullname: nombres,
        },
      });
      // FUVEX
      EmailSolicitudRechazadaVarios.send({
        to: fColaborador.correo,
        dynamic_template_data: {
          fullname: nombres,
        },
      });
      return response.status(httpStatus.FORBIDDEN).json({
        message: Response.NoAplicaEvaluacion,
        data: arrResultLN[0],
      });
    }
    const edad = Utils.calcularEdad(fSolicitud.Cliente.fechaNacimiento);
    if (edad < Const.age.min || edad > Const.age.max) {
      await Solicitud.rechazarPorEdad({ solicitudId, colaboradorId });
      // CLIENTE
      EmailSolicitudRechazadaVarios.send({
        to: ClienteVivienda.correoElectronico,
        dynamic_template_data: {
          fullname: nombres,
        },
      });
      // FUVEX
      EmailSolicitudRechazadaVarios.send({
        to: fColaborador.correo,
        dynamic_template_data: {
          fullname: nombres,
        },
      });
      return response.status(httpStatus.FORBIDDEN).json({
        message: Response.EdadMinimaMaxima,
        data: null,
      });
    }
    // validar que no se pueda registrar la misma solicitud con documentos iguales
    console.log('inicio');
    await serial(arrDocumentos, async ($row) => {
      try {
        const fDocumentoEmpresa = await DocumentoEmpresa.findByAliasAndCompany($row.alias, empresaConvenioId);
        const _existSolDoc = await SolicitudDocumento.isValidSolDoc('byFK', solicitudId, $row.label, fDocumentoEmpresa.id);
        const _existSolDocById = await SolicitudDocumento.isValidSolDoc('byId', null, null, null, $row.id);
        if (!_existSolDoc) {
          arrDocumentosFilter.push({
            accion: 'reg',
            solicitudId: request.body.solicitudId,
            documentoEmpresaId: fDocumentoEmpresa.id,
            fechaSubida: Date.now(),
            estado: 1,
            ...$row,
          });
        }
        if (_existSolDoc && $row.id && _existSolDocById) {
          arrDocumentosFilter.push({
            accion: 'edit',
            solicitudId: request.body.solicitudId,
            documentoEmpresaId: fDocumentoEmpresa.id,
            id: $row.id,
            fechaSubida: Date.now(),
            estado: 1,
            ...$row,
          });
        }
      } catch (err) {
        arrErrors.push({
          message: err.message,
          data: $row,
        });
      }
    });
    console.log('fin');
    if (arrErrors.length > 0) {
      return response.status(httpStatus.BAD_REQUEST).json({
        message: 'OK',
        data: arrErrors,
      });
    }
    // console.log(arrResultPPM, 'arrResultPPM 22');
    // request.body.montoPPM = montoPPM;
    const fEvaluacion = await DocumentoEmpresa.saveWithDocumentos(request.body, arrDocumentosFilter);
    if (tipoProducto === 'N') { // nuevo
      // console.log('inicio NUEVO', empresaConvenioId, 'empresaConvenioId');
      const fEmpresaConvenio = await EmpresaConvenio.findOne({
        where: { id: empresaConvenioId },
        include: [{
          model: Empresa,
          as: 'Empresa',
        }],
      });
      // console.log('fgh');
      const listaDocumentosBoleta = await SolicitudDocumento.listarDocumentosBoleta(solicitudId);
      const listaDocumentosBoletaJSON = listaDocumentosBoleta.map(row => row.toJSON());
      // console.log(listaDocumentosBoletaJSON.length, 'listaDocumentosBoletaJSON.length');
      // consumir servicio de lector
      // console.log('declaro para lector');
      let cantidadMeses = 1;
      if (tipoIngreso === 'V') {
        cantidadMeses = fEmpresaConvenio.cantMesesVariable;
      }
      const arrParamsLector = {
        dni: fSolicitud.Cliente.numDocumento,
        solicitudId,
        solicitante: `${nombres} ${apellidoPaterno} ${apellidoMaterno}`,
        fechaReenvioLector: new Date(),
        empresaConvenioId: fEmpresaConvenio.id,
        nombreComercial: fEmpresaConvenio.Empresa.nombreComercial,
        frecuenciaPago: multiplo, // 1 / 2 / 4
        cantidadMeses,
        tipoIngreso,
        arrDocumentos: listaDocumentosBoleta.map(row => ({
          solicitudDocumentoId: row.id,
          url: row.location,
          tipo: Utils.getTypeForMimeType(row.filetype),
        })),
        arrDocumentosSubrogado: [],
        contacto: {
          nombres: colNombres,
          celular: colCelular,
          correo: colCorreo,
          tipo: 'FUVEX',
          numeroDocumento: colNumeroDocumento,
        },
      };
      const cantBoletas = cantidadMeses * multiplo;
      console.log(cantBoletas, listaDocumentosBoletaJSON.length, 'asdfghj');
      if (flagNext === 'S') {
        // Solicitud.desbloquearLector({ solicitudId }, ''); fechaReenvioLector
        arrParamsLector.fechaEnvioLector = new Date();
        if (fSolicitud.fechaEnvioLector) {
          arrParamsLector.fechaEnvioLector = fSolicitud.fechaEnvioLector;
        }
        Lector.enviarSolicitudDocumentos(arrParamsLector);
      } else {
        Solicitud.desbloquearLector({ solicitudId }, 'Aún no pasa por el lector: Faltan subir boletas');
      }
    }
    const rptRegresarEvaluacion = await this.fnRegresarEvaluacion(fSolicitud.id, 'no');
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: rptRegresarEvaluacion,
      logs: {
        evaluacion: fEvaluacion,
        servicioExtLN: arrResultLN,
      },
    });
  }

  async desboquearEvaluacionLector(request, response) {
    const { solicitudId } = request.body;
    const fUpdate = await Solicitud.update({
      estadoLector: 'D',
    }, {
      where: {
        id: solicitudId,
      },
    });
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: fUpdate,
    });
  }

  async consultarPPM(request, response) {
    const { solicitudId } = request.body;
    const colaboradorId = request.colaborador.id;
    const fColaborador = await Colaborador.findOne({ where: { id: colaboradorId } });
    const fSolicitud = await Solicitud.findByIdWithCliente({ solicitudId });
    const { nombres, ClienteVivienda } = fSolicitud.Cliente;
    // CAMBIA ESTADO A EVALUADO
    const arrParamsEstado = {
      solicitudId,
      estadoId: Const.states.EVALUADO,
      colaboradorId,
    };
    await EstadoSolicitud.create(arrParamsEstado, {
      fields: [
        'solicitudId',
        'estadoId',
        'colaboradorId',
      ],
    });
    console.log(Const.states.EVALUADO, 'Const.states.EVALUADOOOOO');
    await Solicitud.update({
      estadoId: Const.states.EVALUADO,
    }, {
      where: {
        id: solicitudId,
      },
    });
    console.log(solicitudId, 'solicitudIddddd');
    const { codigo } = fSolicitud.Cliente.ClienteLaboral.Ocupacion;
    if ((fSolicitud.estadoId !== 1 && fSolicitud.estadoId !== 2 && fSolicitud.estadoId !== 6 && fSolicitud.estadoId !== 8) || fSolicitud.estadoLector !== 'F') {
      return response.status(httpStatus.FORBIDDEN).json({
        message: 'Solicitud inválida',
        data: null,
      });
    }
    // validar el resultado del PPM
    const arrParams = {
      dni: fSolicitud.Cliente.numDocumento,
      fechaNac: moment(fSolicitud.Cliente.fechaNacimiento).format('DDMMYYYY'),
      abvOcupacion: codigo,
      ingresoFijo: Number.parseFloat(fSolicitud.Cliente.ClienteLaboral.ingresoFijo).toFixed(2),
      ingresoVariable: Number.parseFloat(fSolicitud.Cliente.ClienteLaboral.ingresoVariable).toFixed(2),
      cuotaPr: fSolicitud.Cliente.ClienteLaboral.cuotaPr,
    };
    console.log(arrParams, 'probando ingreso fijoo');
    const { empresaConvenioId } = fSolicitud.Cliente.ClienteLaboral;
    const arrResultPPM = await BBVAConvenios.ppm(arrParams);
    const { dictum, reasons } = arrResultPPM;
    const montoPPM = parseFloat(reasons[0].name);
    if (dictum === '2' || montoPPM < 1) { // si NO aprueba PPM
      await Solicitud.rechazarPorPPM({ empresaConvenioId, solicitudId, colaboradorId });
      // CLIENTE
      EmailSolicitudRechazadaVarios.send({
        to: ClienteVivienda.correoElectronico,
        dynamic_template_data: {
          fullname: nombres,
        },
      });
      // FUVEX
      EmailSolicitudRechazadaVarios.send({
        to: fColaborador.correo,
        dynamic_template_data: {
          fullname: nombres,
        },
      });
      return response.status(httpStatus.FORBIDDEN).json({
        message: Response.NoAplicaEvaluacion,
        data: arrResultPPM,
      });
    }
    await Solicitud.actualizarPPMEnSolicitud({ solicitudId, montoPPM });
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: 'PPM actualizado',
      logs: {
        servicioExtPPM: arrResultPPM,
      },
    });
  }

  async fnRegresarEvaluacion(solicitudId) {
    const alias = 'boleta_pago';
    const documentos = await SolicitudDocumento.findAll({
      where: { solicitudId },
      include: [{
        model: DocumentoEmpresa,
        as: 'DocumentoEmpresa',
        required: true,
        include: [{
          model: Documento,
          as: 'Documento',
          required: true,
          where: { alias },
        }],
      }],
    });
    const arrParams = { solicitudId };
    const fSolicitud = await Solicitud.verResumenDeSolicitud(arrParams);
    const arrLabels = [];
    const fSolicitudJSON = Object.entries(fSolicitud).length === 0 && fSolicitud.constructor === Object ? {} : fSolicitud.toJSON();
    // const { EmpresaConvenio } = Object.entries(fSolicitud).length === 0 && fSolicitud.constructor === Object ? {} : fSolicitud.Cliente.ClienteLaboral;
    const { EmpresaConvenio, FrecuenciaPago } = Object.entries(fSolicitud).length === 0 && fSolicitud.constructor === Object ? {} : fSolicitud.Cliente.ClienteLaboral;
    const { cantMesesVariable } = EmpresaConvenio || 0;
    let cantMeses = 1;
    if (fSolicitud.Cliente.ClienteLaboral.tipoIngreso === 'V') {
      cantMeses = cantMesesVariable;
    }
    let cantBoletas = FrecuenciaPago.multiplo * cantMeses;
    if (cantBoletas === 12) {
      cantBoletas = 15;
    }
    for (let i = 1; i <= cantBoletas;) {
      arrLabels.push(`boleta_pago_${i}`);
      i += 1;
    }
    return {
      ...filter(fSolicitudJSON, [
        'codigoSolicitud',
        'productoId',
        'subProductoId',
        'tipoProducto',
        'tipoPrestamo',
        'montoPrestamo',
        'codigoCampania',
        'plazo',
        'tasa',
        'campaniaConvenioId',
        'codigoSolicitante',
        'estadoLector',
        'tipoCuotaId',
        'diaPago',
        'Cliente.ClienteLaboral.FrecuenciaPago',
      ]),
      labels: arrLabels,
      EmpresaConvenio,
      documentos: documentos.map(d => filter({ ...d.toJSON(), alias: 'boleta_pago' },
        ['id', 'alias', 'filename', 'filetype', 'label', 'etag', 'location', 'key', 'bucket', 'motivoRechazo'])),
    };
  }

  async regresarEvaluacion(request, response) {
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: await this.fnRegresarEvaluacion(request.query.solicitudId),
    });
  }

  async registrarSubrogado(request, response) {
    const { solicitudId, documentos: arrDocumentos } = request.body;
    const fSolicitud = await Solicitud.findByIdWithCliente({ solicitudId });
    const fSolicitudJSON = fSolicitud.toJSON();
    const { id: empresaConvenioId } = fSolicitud.Cliente.ClienteLaboral.EmpresaConvenio;
    const fDocumentoEmpresa = await DocumentoEmpresa.findByAliasAndCompany('cronograma_cd', empresaConvenioId);
    // let montoPrestamoSubrogado = 0;
    const totalDeuda = arrDocumentos.filter(doc => doc.compraDeuda).reduce((acc, cur) => acc + cur.deudaSubro, 0);

    // console.log(totalDeuda, 'totalDeudaaa');
    if (totalDeuda > Const.simulador.montoMaximo) {
      return response.status(httpStatus.BAD_REQUEST).json({
        message: 'El monto máximo de préstamo es de S/ 100,000.00',
        data: null,
      });
    }
    // return 0;
    let compraDeuda = 0;
    const arrDocumentosFilter = arrDocumentos.map((row, index) => {
      if (row.compraDeuda) {
        compraDeuda += 1;
      }
      return {
        solicitudId,
        label: `cronograma_cd_${index + 1}`,
        documentoEmpresaId: fDocumentoEmpresa.id,
        fechaSubida: Date.now(),
        estado: 1,
        institucionFinancieraId: row.institucionFinancieraId,
        filename: row.filename,
        filetype: row.filetype,
        etag: row.etag,
        location: row.location,
        key: row.key,
        bucket: row.bucket,
        alias: row.alias,
        cuotaMensual: row.cuotaMensual,
        compraDeuda: row.compraDeuda,
        deudaSubro: row.deudaSubro,
      };
    });
    if (compraDeuda === 0) {
      return response.status(httpStatus.BAD_REQUEST).json({
        message: 'Debe marcar al menos un item como compra de deuda.',
        data: null,
      });
    }
    await DocumentoEmpresa.saveWithDocumentosSubrogado(request.body, arrDocumentosFilter, fSolicitudJSON);
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: null,
    });
  }

  async regresarSubrogado(request, response) {
    const { solicitudId } = request.query;
    const alias = 'cronograma_cd';
    const documentos = await SolicitudDocumento.findAll({
      where: { solicitudId },
      include: [{
        model: DocumentoEmpresa,
        as: 'DocumentoEmpresa',
        required: true,
        include: [{
          model: Documento,
          as: 'Documento',
          required: true,
          where: { alias },
        }],
      }],
    });
    const solicitud = await Solicitud.findByPk(solicitudId);
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: {
        estadoLector: solicitud.estadoLector,
        items: documentos.map(doc => ({
          id: doc.id,
          alias: doc.alias,
          institucionFinancieraId: doc.institucionFinancieraId,
          filename: doc.filename,
          filetype: doc.filetype,
          label: doc.label,
          etag: doc.etag,
          location: doc.location,
          key: doc.key,
          bucket: doc.bucket,
          cuotaMensual: doc.cuotaMensual,
          compraDeuda: doc.compraDeuda,
          deudaSubro: doc.deudaSubro,
        })),
      },
    });
  }

  async resumen(request, response) {
    const resumen = await Solicitud.verResumenDeSolicitud(request.query);
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: resumen,
    });
  }

  async verResultadoEvaluacion(request, response) { // get
    const { solicitudId } = request.query;
    const colaboradorId = request.colaborador.id;
    const fColaborador = await Colaborador.findOne({ where: { id: colaboradorId } });
    const arrParams = {};
    // calcular periodo de gracia
    const fSolicitud = await Solicitud.verResumenDeSolicitud({ solicitudId });
    const { cuotaMaxima, empresaConvenioId } = fSolicitud.Cliente.ClienteLaboral;
    const { nombres, ClienteVivienda } = fSolicitud.Cliente;
    // const momentoActual = new Date();
    // const diaActual = momentoActual.getDate();
    const { diaPago, diaCorte } = fSolicitud.CampaniaConvenio;
    arrParams.periodoGracia = Utils.calcularPeriodoGracia(diaPago, diaCorte);
    arrParams.tasa = fSolicitud.CampaniaConvenio.tasa;
    arrParams.diaPago = fSolicitud.CampaniaConvenio.diaPago;
    arrParams.fechaNacimiento = moment(fSolicitud.Cliente.fechaNacimiento).format('YYYY-MM-DD');
    arrParams.fechaActFormat = moment().format('YYYY-MM-DD');

    // LLAMADA SIMULADOR PARA MONTO DE PRESTAMO MAXIMO
    arrParams.plazo = Const.simulador.plazoMaximo;
    arrParams.montoPrestamo = Const.simulador.montoMaximo;
    let montoMaximoRef = Const.simulador.montoMaximo;
    const plazoMaximoRef = Const.simulador.plazoMaximo;
    // console.log(arrParams, 'arrParamsffsa max1');
    let responseBbvaMaxRef = await BBVAConvenios.evaluarCredito(arrParams);
    // console.log(JSON.stringify(responseBbvaMaxRef), 'responseBbvaMaxRefwwwww');
    const { scheduledPayments: scheduledPaymentsMaxRef } = responseBbvaMaxRef.data[0].installmentPlan;
    let insuranceMaxRef = scheduledPaymentsMaxRef[1].insurance;
    console.log(insuranceMaxRef, 'insuranceMaxRef1');
    let cuotaCronogramaMaxRef = scheduledPaymentsMaxRef[1].total.amount;
    // console.log(cuotaCronogramaMaxRef, 'cuotaCronogramaMaxRefxxx');
    // console.log(Const.simulador.cuotaMinima, 'Const.simulador.cuotaMinimaxxx');
    if (cuotaCronogramaMaxRef < Const.simulador.cuotaMinima) { // validar cuota minima
      console.log('Rechazo por Cuota Mínima');
      await Solicitud.rechazarPorPPM({ empresaConvenioId, solicitudId, colaboradorId });
      // CLIENTE
      EmailSolicitudRechazadaVarios.send({
        to: ClienteVivienda.correoElectronico,
        dynamic_template_data: {
          fullname: nombres,
        },
      });
      // FUVEX
      EmailSolicitudRechazadaVarios.send({
        to: fColaborador.correo,
        dynamic_template_data: {
          fullname: nombres,
        },
      });
      return response.status(httpStatus.FORBIDDEN).json({
        message: Response.NoAplicaEvaluacion,
        data: null,
      });
    }
    // console.log(cuotaCronogramaMaxRef, 'cuotaCronogramaMaxRefg'); cuotaMaxima
    if (fSolicitud.ppm <= cuotaCronogramaMaxRef || fSolicitud.ppm > cuotaMaxima) {
      let PPMParaFormula = fSolicitud.ppm;
      // console.log(PPMParaFormula, 'PPMParaFormulamaxx');
      if (fSolicitud.ppm > cuotaMaxima) {
        PPMParaFormula = cuotaMaxima;
      }
      // console.log(PPMParaFormula, 'PPMParaFormulamaxx22');
      const TEAMensual = Utils.calcularTEAMensual(arrParams.tasa);
      const periodoSinGracia = (arrParams.plazo - arrParams.periodoGracia);
      const PPMSinSeguro = (PPMParaFormula - insuranceMaxRef.amount);
      console.log(TEAMensual, periodoSinGracia, PPMSinSeguro, 'TEAMensual, periodoSinGracia, PPMSinSeguro maxx');
      const valorActual = Utils.calcularValorActual(TEAMensual, periodoSinGracia, PPMSinSeguro);
      console.log(valorActual, 'valorActual');
      const valorActualMenosSeguro = (valorActual * -1) - (insuranceMaxRef.amount * 72);
      console.log(valorActualMenosSeguro, 'valorActualMenosSegurooof');
      let valorActualCentena = Utils.obtenerNumeroCenteno(valorActualMenosSeguro);
      if (valorActualCentena > 100000) {
        valorActualCentena = 100000;
      }
      montoMaximoRef = valorActualCentena;
      arrParams.montoPrestamo = montoMaximoRef;
      console.log(arrParams, 'arrParamsffsa max2');
      responseBbvaMaxRef = await BBVAConvenios.evaluarCredito(arrParams);
      const { scheduledPayments: scheduledPaymentsMaxRef2da } = responseBbvaMaxRef.data[0].installmentPlan;
      insuranceMaxRef = scheduledPaymentsMaxRef2da[1].insurance;
      console.log(insuranceMaxRef, 'insuranceMaxRef2');
      cuotaCronogramaMaxRef = scheduledPaymentsMaxRef2da[1].total.amount;
      console.log(arrParams, cuotaCronogramaMaxRef, 'arrParams, cuotaCronogramaMaxRef22hh');
      if (cuotaCronogramaMaxRef < Const.simulador.cuotaMinima) { // validar cuota minima
        // console.log(cuotaCronogramaMaxRef, Const.simulador.cuotaMinima, 'cuotaCronogramaMaxRef, Const.simulador.cuotaMinima');
        console.log('entróo PMPM');
        console.log('Rechazo por Cuota Mínima');
        await Solicitud.rechazarPorPPM({ empresaConvenioId, solicitudId, colaboradorId });
        // CLIENTE
        EmailSolicitudRechazadaVarios.send({
          to: ClienteVivienda.correoElectronico,
          dynamic_template_data: {
            fullname: nombres,
          },
        });
        // FUVEX
        EmailSolicitudRechazadaVarios.send({
          to: fColaborador.correo,
          dynamic_template_data: {
            fullname: nombres,
          },
        });
        return response.status(httpStatus.FORBIDDEN).json({
          message: Response.NoAplicaEvaluacion,
          data: null,
        });
      }
      if (montoMaximoRef < Const.simulador.montoMinimo) { // validar monto minimo
        console.log('entróo MONTO X2');
        await Solicitud.rechazarPorPPM({ empresaConvenioId, solicitudId, colaboradorId });
        console.log('Rechazo por Monto Mínimo');
        // CLIENTE
        EmailSolicitudRechazadaVarios.send({
          to: ClienteVivienda.correoElectronico,
          dynamic_template_data: {
            fullname: nombres,
          },
        });
        // FUVEX
        EmailSolicitudRechazadaVarios.send({
          to: fColaborador.correo,
          dynamic_template_data: {
            fullname: nombres,
          },
        });
        return response.status(httpStatus.FORBIDDEN).json({
          message: Response.NoAplicaEvaluacion,
          data: null,
        });
      }
    }
    /* VALIDAR MONTO MENOR EN CASO SEA SUBROGADO */
    if (montoMaximoRef < fSolicitud.montoPrestamo && fSolicitud.tipoProducto === 'S') {
      console.log('Rechazo por Monto Minimo - Subrogado');
      await Solicitud.rechazarPorPPM({ empresaConvenioId, solicitudId, colaboradorId });
      // CLIENTE
      console.log(ClienteVivienda.correoElectronico, 'ClienteVivienda.correoElectronicoff');
      EmailSolicitudRechazadaVarios.send({
        to: ClienteVivienda.correoElectronico,
        dynamic_template_data: {
          fullname: nombres,
        },
      });
      // FUVEX
      EmailSolicitudRechazadaVarios.send({
        to: fColaborador.correo,
        dynamic_template_data: {
          fullname: nombres,
        },
      });
      return response.status(httpStatus.FORBIDDEN).json({
        message: Response.NoAplicaEvaluacion,
        data: null,
      });
    }
    /* END VALIDAR MONTO MENOR EN CASO SEA SUBROGADO */
    // END LLAMADA PRESTAMO MAXIMO

    arrParams.montoPrestamo = fSolicitud.montoPrestamo;
    // SI PASA POR SIMULADOR
    if (request.query.monto) {
      arrParams.montoPrestamo = request.query.monto;
      if (arrParams.montoPrestamo > montoMaximoRef) { // validar monto maximo
        return response.status(httpStatus.BAD_REQUEST).json({
          message: `${Response.ValidaMontoMaxAprobado} S/ ${montoMaximoRef}`,
          data: null,
        });
      }
    }
    arrParams.plazo = fSolicitud.plazo;
    if (request.query.plazo) {
      arrParams.plazo = request.query.plazo;
    }
    const arrEva = {
      solicitudId: fSolicitud.id,
      montoPrestamo: arrParams.montoPrestamo,
      plazo: arrParams.plazo,
      periodoGracia: arrParams.periodoGracia,
    };
    let responseBbva = await BBVAConvenios.evaluarCredito(arrParams);
    const { scheduledPayments } = responseBbva.data[0].installmentPlan;
    const { insurance } = scheduledPayments[1];
    const cuotaCronograma = scheduledPayments[1].total.amount;
    arrEva.cuota = cuotaCronograma;
    // registrar historico key_cliente
    await HistoriaSimulador.findOrCreate({
      where: { solicitudId, keyHistoria: Const.simuladorHistorico.cliente },
      defaults: {
        montoPrestamo: arrParams.montoPrestamo,
        diaPago: arrParams.diaPago,
        plazo: arrParams.plazo,
        tasa: arrParams.tasa,
        cuota: arrEva.cuota,
        ppm: fSolicitud.ppm,
        periodoGracia: arrParams.periodoGracia,
      },
    });
    // end registrar historico key_cliente
    let nuevoMontoCapitalizable = null;
    if (cuotaCronograma < Const.simulador.cuotaMinima) { // validar cuota minima
      return response.status(httpStatus.BAD_REQUEST).json({
        message: Response.ValidaSimulacion,
        data: null,
      });
    }
    // console.log(arrParams.montoPrestamo, fSolicitud.montoPrestamo, 'arrParams.montoPrestamo, fSolicitud.montoPrestamo');
    if (fSolicitud.tipoProducto === 'S' && request.query.monto) {
      let fSolicitudHist = await HistoriaSimulador.findOne({ where: { keyHistoria: 'key_banco', solicitudId: fSolicitud.id } });
      if (!fSolicitudHist) {
        fSolicitudHist = await HistoriaSimulador.findOne({ where: { keyHistoria: 'key_cliente', solicitudId: fSolicitud.id } });
      }
      // validamos monto minimo subrogado
      if (arrParams.montoPrestamo < fSolicitudHist.montoPrestamo) {
        return response.status(httpStatus.BAD_REQUEST).json({
          message: `${Response.ValidaMontoMinSubrogado} S/ ${formatDecimal(fSolicitudHist.montoPrestamo, {
            decimal: '.',
            precision: 2,
            thousands: ',',
          })}`,
          data: null,
        });
      }
      // validamos plazo minimo subrogado
      if (arrParams.plazo < fSolicitudHist.plazo) {
        return response.status(httpStatus.BAD_REQUEST).json({
          message: `${Response.ValidaPlazoMinSubrogado} ${fSolicitudHist.plazo}`,
          data: null,
        });
      }
    }
    // ================ //
    // 2DA SIMULACION   //
    // ================ //
    console.log(fSolicitud.ppm, cuotaCronograma, cuotaMaxima, 'fSolicitud.ppm, cuotaCronograma11');
    // if (fSolicitud.ppm <= cuotaCronograma || cuotaMaxima < cuotaCronograma) { // anterior
    if (fSolicitud.ppm <= cuotaCronograma || fSolicitud.ppm > cuotaMaxima) {
      console.log('2da simulacion');
      let PPMParaFormula = fSolicitud.ppm;
      console.log(PPMParaFormula, 'PPMParaFormulaggg');
      console.log(cuotaCronograma, 'cuotaCronogramaggg');
      if (fSolicitud.ppm > cuotaMaxima) {
        PPMParaFormula = cuotaMaxima;
      }
      console.log(PPMParaFormula, 'PPMParaFormulaggg22');
      const TEAMensual = Utils.calcularTEAMensual(arrParams.tasa);
      const periodoSinGracia = (arrParams.plazo - arrParams.periodoGracia);
      const PPMSinSeguro = (PPMParaFormula - insurance.amount);
      console.log(insurance.amount, 'insurance.amountgggg');
      // LOGICA SUBROGADO - CALCULO DE PLAZO
      let valorActual = null;
      let arrValorActual = null;
      if (fSolicitud.tipoProducto === 'S') {
        arrValorActual = Utils.calcularValorActualRecursivo(TEAMensual, periodoSinGracia, PPMSinSeguro, arrParams.montoPrestamo, insurance.amount);
        console.log(arrValorActual, 'arrValorActual');
        if (arrValorActual.flag === false) {
          await Solicitud.rechazarPorPPM({ empresaConvenioId, solicitudId, colaboradorId });
          console.log('Rechazo por Plazo Recursivo - Subrogado');
          // CLIENTE
          console.log(ClienteVivienda, 'ClienteViviendaFF');
          EmailSolicitudRechazadaVarios.send({
            to: ClienteVivienda.correoElectronico,
            dynamic_template_data: {
              fullname: nombres,
            },
          });
          // FUVEX
          EmailSolicitudRechazadaVarios.send({
            to: fColaborador.correo,
            dynamic_template_data: {
              fullname: nombres,
            },
          });
          return response.status(httpStatus.FORBIDDEN).json({
            message: Response.NoAplicaEvaluacion,
            data: null,
          });
        }
        arrParams.plazo = arrValorActual.plazo;
        arrEva.plazo = arrValorActual.plazo;
        arrEva.montoPrestamo = arrParams.montoPrestamo;
      } else {
        console.log('nuevo goo');
        console.log(TEAMensual, periodoSinGracia, PPMSinSeguro, 'TEAMensual, periodoSinGracia, PPMSinSeguro');
        valorActual = Utils.calcularValorActual(TEAMensual, periodoSinGracia, PPMSinSeguro);
        console.log(valorActual, 'valorActualll');
        const valorActualMenosSeguro = (valorActual * -1) - (insuranceMaxRef.amount * 72);
        let valorActualCentena = (Utils.obtenerNumeroCenteno(valorActualMenosSeguro));
        console.log(valorActualCentena, 'valorActualCentena');
        if (valorActualCentena > arrParams.montoPrestamo) {
          valorActualCentena = arrParams.montoPrestamo; // el monto que marca el simulador no puede ser mayor que el colocado
        }
        nuevoMontoCapitalizable = valorActualCentena;
        if (nuevoMontoCapitalizable < Const.simulador.montoMinimo) { // validar monto minimo
          return response.status(httpStatus.BAD_REQUEST).json({
            message: Response.ValidaSimulacion,
            data: null,
          });
        }
        // actualizar monto prestamo
        arrParams.montoPrestamo = nuevoMontoCapitalizable;
        arrEva.montoPrestamo = nuevoMontoCapitalizable;
      }

      // console.log(arrParams, 'arrParamsffsa reg2');
      responseBbva = await BBVAConvenios.evaluarCredito(arrParams);
      const scheduledPayments2do = responseBbva.data[0].installmentPlan.scheduledPayments;
      // console.log(responseBbva.data[0], 'responseBbva.data[0] ff');
      // const { insurance2do } = scheduledPayments2do[1];
      const cuotaCronograma2do = scheduledPayments2do[1].total.amount;
      arrEva.cuota = cuotaCronograma2do;
      if (cuotaCronograma2do < Const.simulador.cuotaMinima) { // validar cuota minima
        return response.status(httpStatus.BAD_REQUEST).json({
          message: Response.ValidaSimulacion,
          data: null,
        });
      }
    }
    // registrar historico key_banco
    await HistoriaSimulador.findOrCreate({
      where: { solicitudId, keyHistoria: Const.simuladorHistorico.banco },
      defaults: {
        montoPrestamo: arrParams.montoPrestamo,
        diaPago: arrParams.diaPago,
        plazo: arrParams.plazo,
        tasa: arrParams.tasa,
        cuota: arrEva.cuota,
        ppm: fSolicitud.ppm,
        periodoGracia: arrParams.periodoGracia,
      },
    });
    // end registrar historico key_banco
    // console.log(arrEva, 'arrEvaarrEva');
    arrEva.montoMaxBanco = montoMaximoRef;
    arrEva.plazoMontoMaxBanco = plazoMaximoRef;
    await Solicitud.actualizarDesdeEvaluador(arrEva);
    const fSolicitudNew = await Solicitud.verResumenDeSolicitud({ solicitudId });
    const paramsDataBBVA = {
      data: responseBbva.data,
      solicitud: fSolicitudNew.toJSON(),
      nuevoMontoCapitalizable,
      simuladorMaxRef: {
        monto: montoMaximoRef,
        plazo: plazoMaximoRef,
        cuota: cuotaCronogramaMaxRef,
      },
    };
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: paramsDataBBVA,
    });
  }

  async confirmarDefaultEvaluacion(request, response) {
    try {
      const { solicitudId, vistaHTML } = request.body;
      const colaboradorId = request.colaborador.id;
      const {
        montoPrestamo: montoPrestamoFinal,
        CampaniaConvenio: {
          diaPago,
        },
        Cliente: {
          ClienteLaboral: {
            empresaConvenioId,
          },
        },
        plazo,
        tasa,
        cuota,
      } = await Solicitud.verResumenDeSolicitud({ solicitudId });
      // insertar estado evaluado
      const arrParams = {
        tipoCuotaId: 1,
        montoPrestamoFinal,
        plazo,
        diaPago,
        tasa,
        cuota,
        solicitudId,
        estadoId: Const.states.EVALUADO, // 2
        vistaHTML,
        colaboradorId,
        fechaSimulacionConfirmada: Date.now(),
        empresaConvenioId,
      };
      await Solicitud.confirmarDatosEvaluacion(arrParams);
      return response.status(httpStatus.OK).json({
        message: 'OK',
        data: null,
      });
    } catch (e) {
      return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: e.message,
      });
    }
  }

  async confirmarEvaluacion(request, response) {
    const { solicitudId } = request.body;
    request.body.colaboradorId = request.colaborador.id;
    request.body.estadoId = Const.states.SIMULADO; // 3
    request.body.fechaSimulacionConfirmada = Date.now();
    const {
      Cliente: {
        ClienteLaboral: {
          empresaConvenioId,
        },
      },
    } = await Solicitud.verResumenDeSolicitud({ solicitudId });
    request.body.empresaConvenioId = empresaConvenioId;
    await Solicitud.confirmarDatosEvaluacion(request.body);
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: null,
    });
  }

  async regresarCuentaAhorros(request, response) { // get
    const { solicitudId } = request.query;
    const solicitud = await Solicitud.findByPk(solicitudId, {
      attributes: ['tipoCuentaId', 'tieneCuentaAhorros', 'tienePagoHaberes', 'trasladaPagoHaberes'],
    });
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: solicitud.toJSON(),
    });
  }

  async agregarCuentaAhorros(request, response) {
    // setear tasa final
    const {
      tieneCuentaAhorros, trasladaPagoHaberes, tienePagoHaberes, solicitudId,
    } = request.body;
    const fSolicitud = await Solicitud.findByPk(solicitudId);
    request.body.tasaFinal = fSolicitud.tasa;
    if (tieneCuentaAhorros === 'S') {
      request.body.tipoCuentaId = null;
    }
    if (tienePagoHaberes === 'S' || trasladaPagoHaberes === 'S') {
      request.body.tasaFinal = 12.5; // tasa especial
    }
    // console.log(request.body, 'request.bodyyyyyy');
    // return null;
    await Solicitud.agregarCuentaAhorros(request.body);
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: null,
    });
  }

  async fnRegresarDocumentosFisicos(clienteId, solicitudId, perfilId) {
    const { empresaConvenioId } = await ClienteLaboral.findOne({ where: { clienteId } });
    const fSolicitud = await Solicitud.findByPk(solicitudId);
    if (perfilId === Const.perfiles.FUVEX) {
      return {
        documentos: (await SolicitudDocumento.listarDocumentosDeSolicitud(solicitudId, perfilId))
          .filter(row => !row.label.startsWith('boleta'))
          .map(row => ({
            documentoEmpresaId: row.documentoEmpresaId,
            filename: row.filename,
            filetype: row.filetype,
            label: row.label,
            etag: row.etag,
            location: row.location,
            key: row.key,
            bucket: row.bucket,
          })),
        labels: (await DocumentoEmpresa.listar({ empresaConvenioId }))
          .filter(row => !row.Documento.alias.startsWith('boleta'))
          .map((row) => {
            if (fSolicitud.tipoProducto === 'S' && row.Documento.alias === 'inst_compra_deuda') { // (row.obligatorio
              row.obligatorio = 'S';
            }
            const arrAux = {
              raw: row,
              documentoEmpresaId: row.id,
              documentoId: row.Documento.id,
              nombre: row.Documento.nombre,
              alias: row.Documento.alias,
              seccion: row.seccion,
              labelHTML: row.Documento.labelHTML,
              descripcionHTML: row.Documento.descripcionHTML,
            };
            return arrAux;
          }),
      };
    }
    return {
      documentos: (await SolicitudDocumento.listarDocumentosDeSolicitud(solicitudId, perfilId))
        .map(row => ({
          documentoEmpresaId: row.documentoEmpresaId,
          filename: row.filename,
          filetype: row.filetype,
          label: row.label,
          etag: row.etag,
          location: row.location,
          key: row.key,
          bucket: row.bucket,
        })),
      labels: (await DocumentoEmpresa.listar({ empresaConvenioId }))
        .map(row => ({
          raw: row,
          documentoEmpresaId: row.id,
          documentoId: row.Documento.id,
          nombre: row.Documento.nombre,
          alias: row.Documento.alias,
          seccion: row.seccion,
          labelHTML: row.Documento.labelHTML,
          descripcionHTML: row.Documento.descripcionHTML,
        })),
    };
  }

  async regresarDocumentosFisicos(request, response) {
    // const Usuario = await Usuario.findByUsername()
    const { clienteId, solicitudId } = request.query;
    // console.log(JSON.stringify(request.user), 'request.user');
    const perfilId = request.user.UsuarioPerfil[0].Perfil.id;

    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: await this.fnRegresarDocumentosFisicos(clienteId, solicitudId, perfilId),
    });
  }

  async agregarDocumentosFisicos(request, response) {
    const { clienteId, solicitudId } = request.body;
    const perfilId = request.user.UsuarioPerfil[0].Perfil.id;
    await Solicitud.agregarDocumentosFisicos(request.body);
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: await this.fnRegresarDocumentosFisicos(clienteId, solicitudId, perfilId),
    });
  }

  async verResumenDeEvaluacion(request, response) {
    const arrParams = {
      solicitudId: request.query.solicitudId,
    };
    const fSolicitud = await Solicitud.verResumenDeSolicitud(arrParams);
    const fSolicitudJSON = fSolicitud.toJSON();
    const documentosSubrogado = await SolicitudDocumento.listarDocumentosSubrogado(request.query.solicitudId);
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: {
        ...fSolicitudJSON,
        importeTotalSubrogado: documentosSubrogado.filter(d => d.compraDeuda).reduce((acc, cur) => acc + cur.deudaSubro, 0),
        documentosSubrogado: documentosSubrogado.filter(d => d.compraDeuda),
      },
    });
  }

  async aprobarSolicitudCredito(request, response) {
    const { solicitudId } = request.body;
    await Solicitud.aprobarSolicitudCredito({ estadoId: 4, solicitudId, colaboradorId: request.colaborador.id });
    // --
    const solicitud = await Solicitud.findByPk(solicitudId);
    const { colaboradorId } = solicitud;
    const cliente = await Cliente.findByPk(solicitud.clienteId);
    const clienteVivienda = await ClienteVivienda.findOne({ where: { clienteId: solicitud.clienteId } });
    const clienteLaboral = await ClienteLaboral.findOne({ where: { clienteId: solicitud.clienteId } });
    const { empresaConvenioId } = clienteLaboral;
    const fColaborador = await Colaborador.findOne({ where: { id: colaboradorId } });
    // CLIENTE
    EmailSolicitudAprobadaFuvex.send({
      to: clienteVivienda.correoElectronico,
      dynamic_template_data: {
        fullname: cliente.nombres,
        correoFuvex: fColaborador.correo,
      },
    });
    // FUVEX
    EmailSolicitudAprobadaFuvex.send({
      to: fColaborador.correo,
      dynamic_template_data: {
        fullname: cliente.nombres,
        correoFuvex: fColaborador.correo,
      },
    });
    // RRHH
    const fColaboradorRRHH = await Solicitud.ListarRRHHEmpresaConvenio({ empresaConvenioId });
    EmailSolicitudAprobadaFuvex.send({
      to: fColaboradorRRHH.correo,
      dynamic_template_data: {
        fullname: cliente.nombres,
        correoFuvex: fColaborador.correo,
      },
    });
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: null,
    });
  }

  async aprobarSolicitudRrhh(request, response) {
    const { solicitudId } = request.body;
    const colaboradorRRHHId = request.colaborador.id;
    const fSolicitud = await Solicitud.findByIdWithCliente({ solicitudId });
    const { empresaConvenioId } = fSolicitud.Cliente.ClienteLaboral;
    const { codigo } = fSolicitud.Cliente.ClienteLaboral.Ocupacion;
    // VALIDAR LISTA NEGRA
    const arrParams = {
      dni: fSolicitud.Cliente.numDocumento,
      fechaNac: moment(fSolicitud.Cliente.fechaNacimiento).format('DDMMYYYY'), // format: '01011991'
      abvOcupacion: codigo,
      // cuotaSubrog:
    };
    const arrResultLN = await BBVAConvenios.listaNegra(arrParams);
    // arrResultLN = arrResultLNAux;
    if (arrResultLN[0].isBlocked === true) { // si se encuentra en lista negra
      await Solicitud.rechazarPorListaNegra({ empresaConvenioId, solicitudId, colaboradorId: colaboradorRRHHId });
      return response.status(httpStatus.FORBIDDEN).json({
        message: Response.NoAplicaEvaluacion,
        data: arrResultLN[0],
      });
    }
    // VALIDAR PPM
    const arrParamsPPM = {
      dni: fSolicitud.Cliente.numDocumento,
      fechaNac: moment(fSolicitud.Cliente.fechaNacimiento).format('DDMMYYYY'),
      abvOcupacion: codigo,
      ingresoFijo: Number.parseFloat(fSolicitud.Cliente.ClienteLaboral.ingresoFijo).toFixed(2),
      ingresoVariable: Number.parseFloat(fSolicitud.Cliente.ClienteLaboral.ingresoVariable).toFixed(2),
      cuotaPr: fSolicitud.Cliente.ClienteLaboral.cuotaPr,
    };
    const arrResultPPM = await BBVAConvenios.ppm(arrParamsPPM);
    const { dictum, reasons } = arrResultPPM;
    const montoPPM = parseFloat(reasons[0].name);
    if (dictum === '2' || montoPPM < 1) { // si NO aprueba PPM
      await Solicitud.rechazarPorPPM({ empresaConvenioId, solicitudId, colaboradorId: colaboradorRRHHId });
      return response.status(httpStatus.FORBIDDEN).json({
        message: Response.NoAplicaEvaluacion,
        data: arrResultPPM,
      });
    }

    const _solicitud = await Solicitud.aprobarSolicitudRrhh({ solicitudId, colaboradorRRHHId });
    const solicitud = await Solicitud.findByPk(solicitudId);
    const { colaboradorId } = solicitud;
    const cliente = await Cliente.findByPk(solicitud.clienteId);
    const clienteVivienda = await ClienteVivienda.findOne({ where: { clienteId: solicitud.clienteId } });
    const fColaborador = await Colaborador.findOne({ where: { id: colaboradorId } });
    const fColaboradorRRHH = await Colaborador.findOne({ where: { id: colaboradorRRHHId } });
    // CLIENTE
    EmailSolicitudAprobadaRrhh.send({
      to: clienteVivienda.correoElectronico,
      dynamic_template_data: {
        fullname: cliente.nombres,
      },
    });
    // FUVEX
    EmailSolicitudAprobadaRrhh.send({
      to: fColaborador.correo,
      dynamic_template_data: {
        fullname: cliente.nombres,
      },
    });
    // RRHH
    EmailSolicitudAprobadaRrhh.send({
      to: fColaboradorRRHH.correo,
      dynamic_template_data: {
        fullname: cliente.nombres,
      },
    });
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: _solicitud,
    });
  }

  async rechazarSolicitudFuvex(request, response) {
    const colaboradorId = request.colaborador.id;
    const _solicitud = await Solicitud.rechazarSolicitudFuvex({ ...request.body, colaboradorId });
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: _solicitud,
    });
  }

  async rechazarSolicitudRrhh(request, response) {
    // const { solicitudId } = request.body;
    const colaboradorRRHHId = request.colaborador.id;
    const _solicitud = await Solicitud.rechazarSolicitudRrhh({ ...request.body, colaboradorRRHHId });
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: _solicitud,
    });
  }

  async aprobarSolicitudAnalista(request, response) {
    const { solicitudId } = request.body;
    const colaboradorAnalistaId = request.colaborador.id;
    const _solicitud = await Solicitud.aprobarSolicitudAnalista({ solicitudId, colaboradorAnalistaId });
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: _solicitud,
    });
  }

  async rechazarSolicitudAnalista(request, response) {
    const { solicitudId } = request.body;
    const colaboradorAnalistaId = request.colaborador.id;
    const _solicitud = await Solicitud.rechazarSolicitudAnalista({ ...request.body, colaboradorAnalistaId });
    // --
    const solicitud = await Solicitud.findByPk(solicitudId);
    const cliente = await Cliente.findByPk(solicitud.clienteId);
    const { colaboradorId } = solicitud;
    const fColaborador = await Colaborador.findOne({ where: { id: colaboradorId } });
    let observaciones = '';
    request.body.reasonsReject.forEach((item, index) => {
      if (item.descripcion === 'OTROS') {
        observaciones += item.descripcionOther;
      } else {
        observaciones += item.descripcion;
      }
      if (index !== request.body.reasonsReject.length - 1) {
        observaciones += ', ';
      } else {
        observaciones += '.';
      }
    });
    EmailSolicitudObservadaAnalista.send({
      to: fColaborador.correo,
      bcc: ['abel@kontigo.pe', 'luis@kontigo.pe'],
      dynamic_template_data: {
        fullname: cliente.nombreApellidoCompleto,
        ejecutivoName: fColaborador.fullname,
        numeroregistro: solicitud.codigoSolicitante,
        comments: observaciones,
      },
    });
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: _solicitud,
    });
  }

  async aprobarSolicitudFormalizador(request, response) {
    const { solicitudId } = request.body; // aprobarSolicitudFormalizador
    const colaboradorFormalizadorId = request.colaborador.id;
    const fSolicitud = await Solicitud.findByIdWithCliente({ solicitudId });
    const { empresaConvenioId } = fSolicitud.Cliente.ClienteLaboral;
    const { codigo } = fSolicitud.Cliente.ClienteLaboral.Ocupacion;
    // VALIDAR LISTA NEGRA
    const arrParams = {
      dni: fSolicitud.Cliente.numDocumento,
      fechaNac: moment(fSolicitud.Cliente.fechaNacimiento).format('DDMMYYYY'), // format: '01011991'
      abvOcupacion: codigo,
    };
    const arrResultLN = await BBVAConvenios.listaNegra(arrParams);
    if (arrResultLN[0].isBlocked === true) { // si se encuentra en lista negra
      await Solicitud.rechazarPorListaNegra({ empresaConvenioId, solicitudId, colaboradorId: colaboradorFormalizadorId });
      return response.status(httpStatus.FORBIDDEN).json({
        message: Response.NoAplicaEvaluacion,
        data: arrResultLN[0],
      });
    }
    // VALIDAR PPM
    const arrParamsPPM = {
      dni: fSolicitud.Cliente.numDocumento,
      fechaNac: moment(fSolicitud.Cliente.fechaNacimiento).format('DDMMYYYY'),
      abvOcupacion: codigo,
      ingresoFijo: Number.parseFloat(fSolicitud.Cliente.ClienteLaboral.ingresoFijo).toFixed(2),
      ingresoVariable: Number.parseFloat(fSolicitud.Cliente.ClienteLaboral.ingresoVariable).toFixed(2),
      cuotaPr: fSolicitud.Cliente.ClienteLaboral.cuotaPr,
    };
    const arrResultPPM = await BBVAConvenios.ppm(arrParamsPPM);
    const { dictum, reasons } = arrResultPPM;
    const montoPPM = parseFloat(reasons[0].name);
    if (dictum === '2' || montoPPM < 1) { // si NO aprueba PPM
      await Solicitud.rechazarPorPPM({ empresaConvenioId, solicitudId, colaboradorId: colaboradorFormalizadorId });
      return response.status(httpStatus.FORBIDDEN).json({
        message: Response.NoAplicaEvaluacion,
        data: arrResultPPM,
      });
    }
    const _solicitud = await Solicitud.aprobarSolicitudFormalizador({ solicitudId, colaboradorFormalizadorId });
    // --
    const solicitud = await Solicitud.findByPk(solicitudId);
    const cliente = await Cliente.findByPk(solicitud.clienteId);
    const { colaboradorId } = solicitud;
    const clienteVivienda = await ClienteVivienda.findOne({ where: { clienteId: solicitud.clienteId } });
    const fColaborador = await Colaborador.findOne({ where: { id: colaboradorId } });
    const fColaboradorRRHH = await Solicitud.ListarRRHHEmpresaConvenio({ empresaConvenioId });
    if (solicitud.tipoProducto === 'N') {
      // CLIENTE
      EmailSolicitudDesembolsadaNuevo.send({
        to: clienteVivienda.correoElectronico,
        dynamic_template_data: {
          fullname: cliente.nombres,
        },
      });
      // FUVEX
      EmailSolicitudDesembolsadaNuevo.send({
        to: fColaborador.correo,
        dynamic_template_data: {
          fullname: cliente.nombres,
        },
      });
      // RRHH
      EmailSolicitudDesembolsadaNuevo.send({
        to: fColaboradorRRHH.correo,
        dynamic_template_data: {
          fullname: cliente.nombres,
        },
      });
    }
    if (solicitud.tipoProducto === 'S') {
      // CLIENTE
      EmailSolicitudDesembolsadaSubro.send({
        to: clienteVivienda.correoElectronico,
        dynamic_template_data: {
          fullname: cliente.nombres,
        },
      });
      // FUVEX
      EmailSolicitudDesembolsadaSubro.send({
        to: fColaborador.correo,
        dynamic_template_data: {
          fullname: cliente.nombres,
        },
      });
      // RRHH
      EmailSolicitudDesembolsadaSubro.send({
        to: fColaboradorRRHH.correo,
        dynamic_template_data: {
          fullname: cliente.nombres,
        },
      });
    }
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: _solicitud,
    });
  }
}

module.exports = SolicitudController;
