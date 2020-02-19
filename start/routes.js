const jwt = require('express-jwt');

const Requests = require('../app/Requests/index');

const { publicKey: secret } = use('JWT');

module.exports = (router) => {
  // router.post('api/v1/helpers/uploadFile', 'FileController.upload-file');
  router.group('/api/v1', (router) => {
    // Helpers
    router.group({
      prefix: '/helpers',
      middleware: [
        jwt({ secret, requestProperty: 'tokenPayload' }),
        'App/Middleware/GuardMiddleware.check',
      ],
    }, (router) => {
      router.post({
        uri: '/signedUrl',
        middleware: [Requests.File.signedUrl],
      }, 'FileController.signedUrl');
      router.post('/upload-file', 'FileController.uploadFile');
    });
    // Users
    router.group('/users', (router) => {
      router.post({
        uri: '/login',
        middleware: [
          Requests.User.login,
          'App/Middleware/ReCaptchaMiddlewareMiddleware.check',
        ],
      }, 'UsuarioController.login');
      router.post({
        uri: '/lostpass',
        middleware: [
          Requests.User.lostpass,
          'App/Middleware/ReCaptchaMiddlewareMiddleware.check',
        ],
      }, 'UsuarioController.lostpass');
      router.post({
        uri: '/resetpass',
        middleware: [
          Requests.User.resetpass,
          'App/Middleware/ReCaptchaMiddlewareMiddleware.check',
        ],
      }, 'UsuarioController.resetpass');
      router.post({
        uri: '/logout',
        middleware: [
          jwt({ secret, requestProperty: 'tokenPayload' }),
        ],
      }, 'UsuarioController.logout');
      router.post({
        uri: '/keep-alive',
        middleware: [
          jwt({ secret, requestProperty: 'tokenPayload' }),
          'App/Middleware/GuardMiddleware.check',
        ],
      }, 'UsuarioController.keepAlive');
    });
    // Evaluations
    router.group({
      prefix: '/evaluations',
      middleware: [
        jwt({ secret, requestProperty: 'tokenPayload' }),
        'App/Middleware/GuardMiddleware.check',
      ],
    }, (router) => {
      router.post({
        uri: '/register-evaluation',
        middleware: [Requests.Solicitud.registerEvaluation],
      }, 'SolicitudController.registrarEvaluacion');
      router.post({
        uri: '/unlock-evaluation-lector',
        middleware: [Requests.Solicitud.unlockEvaluationLector],
      }, 'SolicitudController.desboquearEvaluacionLector');
      router.get({
        uri: '/go-back-evaluation',
        middleware: [Requests.Solicitud.goBackEvaluation],
      }, 'SolicitudController.regresarEvaluacion');
      router.post({
        uri: '/register-surrogate',
        middleware: [Requests.Solicitud.registerSurrogate],
      }, 'SolicitudController.registrarSubrogado');
      router.get({
        uri: '/go-back-surrogate',
        middleware: [Requests.Solicitud.goBackSurrogate],
      }, 'SolicitudController.regresarSubrogado');
      router.get({
        uri: '/resumen',
        middleware: [Requests.Solicitud.resumen],
      }, 'SolicitudController.resumen');
      router.post({
        uri: '/query-ppm',
        middleware: [Requests.Solicitud.queryPPM],
      }, 'SolicitudController.consultarPPM');
      router.get({
        uri: '/view-current-evaluation-result',
        middleware: [Requests.Solicitud.viewCurrentEvaluationResult],
      }, 'SolicitudController.verResultadoEvaluacion');
      router.get({
        uri: '/view-evaluation-result',
        middleware: [Requests.Solicitud.viewEvaluationResult],
      }, 'SolicitudController.verResultadoEvaluacion');
      router.post({
        uri: '/confirm-default-evaluation', // evaluado
        middleware: [Requests.Solicitud.confirmDefaultEvaluation],
      }, 'SolicitudController.confirmarDefaultEvaluacion');
      router.post({
        uri: '/confirm-data-evaluation', // simulado
        middleware: [Requests.Solicitud.confirmDataEvaluation],
      }, 'SolicitudController.confirmarEvaluacion');
      router.get({
        uri: '/go-back-bank-account',
        middleware: [Requests.Solicitud.goBackBankAccount],
      }, 'SolicitudController.regresarCuentaAhorros');
      router.post({
        uri: '/add-bank-account',
        middleware: [Requests.Solicitud.addBankAccount],
      }, 'SolicitudController.agregarCuentaAhorros');
      router.get({
        uri: '/go-back-physical-documents',
        middleware: [Requests.Solicitud.goBackPhysicalDocuments],
      }, 'SolicitudController.regresarDocumentosFisicos');
      router.post({
        uri: '/add-physical-documents',
        middleware: [Requests.Solicitud.addPhysicalDocuments],
      }, 'SolicitudController.agregarDocumentosFisicos');
      router.get({
        uri: '/view-evaluation-summary',
        middleware: [Requests.Solicitud.viewEvaluationSummary],
      }, 'SolicitudController.verResumenDeEvaluacion');
      router.post({
        uri: '/approve-credit-request',
        middleware: [Requests.Solicitud.approveCreditRequest],
      }, 'SolicitudController.aprobarSolicitudCredito');
      // router.post({
      //   uri: '/neto-solicitud-documento',
      //   middleware: [Requests.Solicitud.netoSolicitudDocumento],
      // }, 'LectorController.netoSolicitudDocumento');
      router.post({
        uri: '/reject-request',
        middleware: [Requests.Rrhh.rejectRequest],
      }, 'SolicitudController.rechazarSolicitudFuvex');
      router.post({
        uri: '/send-cronograma',
        middleware: [Requests.Solicitud.sendCronograma],
      }, 'CronogramaController.send');
      // router.post(':solicitudId/cronograma/send/', 'CronogramaController.send');
    });
    // Customers
    router.group({
      prefix: '/customers',
      middleware: [
        jwt({ secret, requestProperty: 'tokenPayload' }),
        'App/Middleware/GuardMiddleware.check',
        'App/Middleware/SolicitudEnCursoMiddleware.check',
      ],
    }, (router) => {
      router.post({
        uri: '/register-customer',
        middleware: [Requests.Customer.registerCustomer],
      }, 'SolicitudController.registrarClientePersonal');

      router.get({
        uri: '/go-back-customer',
        middleware: [Requests.Customer.goBackCustomer],
      }, 'SolicitudController.regresarClientePersonal');

      router.post({
        uri: '/register-customer-apartment',
        middleware: [Requests.Customer.registerCustomerAparment],
      }, 'SolicitudController.registrarClienteVivienda');

      router.get({
        uri: '/go-back-customer-apartment',
        middleware: [Requests.Customer.goBackCustomerAparment],
      }, 'SolicitudController.regresarClienteVivienda');

      router.post({
        uri: '/register-customer-working',
        middleware: [Requests.Customer.registerCustomerWorking],
      }, 'SolicitudController.registrarClienteLaboral');

      router.get({
        uri: '/go-back-customer-working',
        middleware: [Requests.Customer.goBackCustomerWorking],
      }, 'SolicitudController.regresarClienteLaboral');

      router.get({
        uri: '/view-customer-summary',
        middleware: [Requests.Customer.viewCustomerSummary],
      }, 'SolicitudController.verResumenDeCliente');

      router.post({
        uri: '/confirm-data-customer',
        middleware: [Requests.Customer.confirmDataCustomer],
      }, 'SolicitudController.confirmarDatosCliente');
    });
    // Mantenimiento
    router.group({
      prefix: '/maintenance',
      middleware: [
        jwt({ secret, requestProperty: 'tokenPayload' }),
        'App/Middleware/GuardMiddleware.check',
      ],
    }, (router) => {
      router.get('/list-requests', 'HistorialSolicitudesController.listarSolicitudes');
      router.get('/list-account-type', 'TipoCuentaController.listarTiposDeCuenta');
      router.get('/list-jobs', 'OcupacionController.listarOcupaciones');
      router.get('/list-fuvex-company', 'EmpresaFuvexController.listarEmpresasFuvex');
      router.get('/list-account-type', 'OperadorController.listarOperadores');
      router.get('/list-financial-institution', 'InstitucionFinancieraController.listarInstituciones');
      router.get('/list-payment-frequency', 'FrecuenciaPagoController.listarFrecuenciasPago');
      // me quede aquí, falta listar condiciones laborales...
      router.get('/list-status-employment', 'CondicionLaboralController.listarCondicionesLaborales');
      router.get({
        uri: '/list-company-documents',
        middleware: [Requests.Mantenimiento.listCompanyDocuments],
      }, 'DocumentoEmpresaController.listarDocumentosDeEmpresa');
      router.get({
        uri: '/list-fuvex-for-admin',
        // middleware: [Requests.Mantenimiento.listFuvexForAdmin],
      }, 'UsuarioController.listarFuvexForAdmin');
      router.get({
        uri: '/list-company-campaigns',
        middleware: [Requests.Mantenimiento.listCompanyCampaings],
      }, 'CampaniaConvenioController.listarCampaniasDeEmpresa');
      router.get('/list-companies-for-fuvex', 'EmpresaConvenioController.listarEmpresasConvenioDeFuvex');
      router.get({
        uri: '/list-reasons-rejection',
        middleware: [Requests.MotivoRechazo.listReasonsRejection],
      }, 'MotivoRechazoController.listarMotivosRechazo');
      router.get('/persona/:dni', 'PersonaController.getPersonByDni');
    });
    // RRHH
    router.group({
      prefix: '/rrhh',
      middleware: [
        jwt({ secret, requestProperty: 'tokenPayload' }).unless({ path: ['/api/v1/rrhh/list-request-hr-excel'] }),
        'App/Middleware/GuardMiddleware.check',
        // 'App/Middleware/EmpresaConvenioMiddleware.setEmpresasConvenio',
      ],
    }, (router) => {
      router.get({
        uri: '/list-request-hr',
        // middleware: [Requests.Rrhh.listRequestHr],
      }, 'HistorialSolicitudesController.listarSolicitudesParaRRHH');
      router.get({
        uri: '/list-request-hr-excel',
        // middleware: [Requests.Rrhh.listRequestHrExcel],
      }, 'HistorialSolicitudesController.listarSolicitudesParaRRHHExcel');
      router.post({
        uri: '/approve-request-hr',
        middleware: [Requests.Rrhh.approveRequest],
      }, 'SolicitudController.aprobarSolicitudRrhh');
      router.post({
        uri: '/reject-request-hr',
        middleware: [Requests.Rrhh.rejectRequest],
      }, 'SolicitudController.rechazarSolicitudRrhh');
    });
    // ANALISTA
    router.group({
      prefix: '/analista',
      middleware: [
        jwt({ secret, requestProperty: 'tokenPayload' }),
        'App/Middleware/GuardMiddleware.check',
      ],
    }, (router) => {
      router.get({
        uri: '/list-request-ev',
        middleware: [Requests.Rrhh.listRequestHr],
      }, 'HistorialSolicitudesController.listarSolicitudesParaAnalista');
      router.post({
        uri: '/approve-request-ev',
        middleware: [Requests.Rrhh.approveRequest],
      }, 'SolicitudController.aprobarSolicitudAnalista');
      router.post({
        uri: '/reject-request-ev',
        middleware: [Requests.Rrhh.rejectRequest],
      }, 'SolicitudController.rechazarSolicitudAnalista');
    });
    // FUVEX ADMIN
    router.group({
      prefix: '/fuvexadmin',
      middleware: [
        jwt({ secret, requestProperty: 'tokenPayload' }).unless({ path: ['/api/v1/fuvexadmin/list-request-fuvex-admin-excel'] }),
        'App/Middleware/GuardMiddleware.check',
      ],
    }, (router) => {
      router.get({
        uri: '/list-request-fuvex-admin',
        middleware: [Requests.Rrhh.listRequestHr],
      }, 'HistorialSolicitudesController.listarSolicitudesParaFuvexAdmin');
      router.get({
        uri: '/list-request-fuvex-admin-excel',
      }, 'HistorialSolicitudesController.listarSolicitudesParaFuvexAdminExcel');
      router.post({
        uri: '/register-employee',
        middleware: [Requests.Employee.registerEmployee],
      }, 'ColaboradorController.registrarColaborador');
      router.get({
        uri: '/list-employees-fuvex',
        middleware: [Requests.Employee.listEmployees],
      }, 'ColaboradorController.listarColaboradoresFuvex');
      router.delete('/delete-employee/:id', 'ColaboradorController.deleteEmployee');
    });
    // ANALISTA ADMIN
    router.group({
      prefix: '/analistaadmin',
      middleware: [
        jwt({ secret, requestProperty: 'tokenPayload' }).unless({ path: ['/api/v1/analistaadmin/list-request-analista-admin-excel'] }),
        'App/Middleware/GuardMiddleware.check',
      ],
    }, (router) => {
      router.get({
        uri: '/list-request-analista-admin',
        middleware: [Requests.Rrhh.listRequestHr],
      }, 'HistorialSolicitudesController.listarSolicitudesParaAnalistaAdmin');
      router.get({
        uri: '/list-request-analista-admin-excel',
      }, 'HistorialSolicitudesController.listarSolicitudesParaAnalistaAdminExcel');
      router.post({
        uri: '/register-employee-analista',
        middleware: [Requests.Employee.registerEmployeeAnalista],
      }, 'ColaboradorController.registrarColaboradorAnalista');
      router.get({
        uri: '/list-employees-analista',
        middleware: [Requests.Employee.listEmployees],
      }, 'ColaboradorController.listarColaboradoresAnalista');
    });
    // FORMALIZADOR
    router.group({
      prefix: '/formalizador',
      middleware: [
        jwt({ secret, requestProperty: 'tokenPayload' }),
        'App/Middleware/GuardMiddleware.check',
      ],
    }, (router) => {
      router.get({
        uri: '/list-request-ev',
        middleware: [Requests.Rrhh.listRequestHr],
      }, 'HistorialSolicitudesController.listarSolicitudesParaAnalista');
      router.post({
        uri: '/approve-request-ev',
        middleware: [Requests.Rrhh.approveRequest],
      }, 'SolicitudController.aprobarSolicitudFormalizador');
    });
    // LECTOR
    router.group({
      prefix: '/lector',
      middleware: [
        // jwt({ secret, requestProperty: 'tokenPayload' }),
        // 'App/Middleware/GuardMiddleware.check',
      ],
    }, (router) => {
      router.post({
        uri: '/update-from-lector-ok',
        middleware: [Requests.Lector.updateFromLectorOk],
      }, 'LectorController.actualizarDesdeLectorOk');
      router.post({
        uri: '/update-from-lector-rechazo',
        middleware: [Requests.Lector.updateFromLectorRechazo],
      }, 'LectorController.actualizarDesdeLectorRechazo');
    });
    // BBVA
    router.group({
      prefix: '/bbva',
      middleware: [
        // 'App/Middleware/BBVAIpAllowedMiddleware.check',
      ],
    }, (router) => {
      router.get({
        uri: '/report-request-generate',
        middleware: [Requests.Solicitud.reportRequestGenerate],
      }, 'BbvaController.generarReporteSolicitudes');
      router.get('/generate-anonymize', 'BbvaController.generarAnonimizacion');
      router.get('/reports', 'BbvaController.listReports');
      router.delete('/reports/:key', 'BbvaController.deleteReport');
      router.post({
        uri: 'decode-document',
        middleware: [
          jwt({ secret, requestProperty: 'tokenPayload' }),
          'App/Middleware/GuardMiddleware.check',
        ],
      }, 'BbvaController.decodePDF');
      // router.get({
      //   uri: 'decode-document-lector/:key',
      //   middleware: [
      //     // jwt({ secret, requestProperty: 'tokenPayload' }),
      //     // 'App/Middleware/GuardMiddleware.check',
      //   ]
      // }, 'BbvaController.decodeGetPDF');
      router.get('/decode-document-lector/:key', 'BbvaController.decodeGetPDF');
      router.get('/decode-document-lector-base64/:key', 'BbvaController.decodeGetPDFBase64');
      router.get('/download-zip/:key', 'BbvaController.downloadZip');
    });
    // ADMIN
    // router.group({
    //   prefix: '/admin',
    //   middleware: [
    //     'App/Middleware/GuardMiddleware.check',
    //   ],
    // }, (router) => {
    //   router.get('/reports', 'AdminController.actualizar');
    // });
  });
  router.get('/tsec', 'TestController.tsec');
};
