module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Documento', [
      // fijos
      {
        alias: 'doi',
        nombre: 'DOCUMENTO DE IDENTIDAD SOLICITANTE',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
      {
        alias: 'contrato_prod_anexo',
        nombre: 'CONTRATO DEL PRODUCTO Y ANEXOS',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
      {
        alias: 'cronograma_bbva',
        nombre: 'CRONOGRAMA BBVA',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
      {
        alias: 'doi_conyugue',
        nombre: 'DOCUMENTO DE IDENTIDAD CONYUGUE',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
      {
        alias: 'hri',
        nombre: 'HOJA DE RESUMEN INFORMATIVA',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
      {
        alias: 'sol_credito',
        nombre: 'SOLICITUD DEL CRÉDITO',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
      {
        alias: 'boleta_pago', // 7
        nombre: 'BOLETA DE PAGO/RECIBO POR HONORARIOS/DETALLE FINANCIERO',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
      {
        alias: 'carta_dcto_planilla',
        nombre: 'CARTA DE DESCUENTO POR PLANILLA',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
      {
        alias: 'inst_compra_deuda',
        nombre: 'INSTRUCCIÓN DE COMPRA DE DEUDA - HOJA DE COMPRA DE DEUDA',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
      {
        alias: 'recibo_serv',
        nombre: 'RECIBO DE SERVICIOS',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
      // variables >>>
      {
        alias: 'carta_dcto_planilla_essalud',
        nombre: 'CARTA DE AUTORIZACION DESCUENTO POR PLANILLA (FORMATO ESSALUD) FIRMADO Y CON HUELLA',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
      {
        alias: 'aprob_remesa_essalud',
        nombre: 'APROBACIÓN REMESA ESSALUD',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
      {
        alias: 'calc_endeud_bol_ban',
        nombre: 'CALCULADORA DE ENDEUDAMIENTO BOLETA Y BANCO',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
      {
        alias: 'form_compra_deuda_essalud',
        nombre: 'FORMATO COMPRA DE DEUDA ESSALUD',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
      {
        alias: 'carta_aut_dcto_caja_mil',
        nombre: 'CARTA DE AUTORIZACIÓN DESCUENTO CAJA MILITAR',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
      {
        alias: 'copia_tin_leg',
        nombre: 'COPIA TIN LEGIBLE',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
      {
        alias: 'hoja_conoc',
        nombre: 'HOJA DE CONOCIMIENTO',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
      {
        alias: 'cronograma_cd', // 18
        nombre: 'CRONOGRAMA DE COMPRA DE DEUDA (EN CASO DE SER CD)',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
      {
        alias: 'pagare',
        nombre: 'PAGARÉ',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
      {
        alias: 'aut_apertura', // 20
        nombre: 'AUTORIZACIÓN DE APERTURA DE CUENTA',
        descripcion: null,
        labelHTML: 'Lorem Ipsum',
        descripcionHTML: 'Lorem Ipsum descripition lodge hortiulo',
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('Documento', null, {});
  },
};
