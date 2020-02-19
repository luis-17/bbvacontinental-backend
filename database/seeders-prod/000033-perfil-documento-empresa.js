const Const = require('../../app/Helpers/Const');

module.exports = {
  up(queryInterface) {
    const now = new Date();
    return queryInterface.bulkInsert('PerfilDocumentoEmpresa', [
      // RRHH
      {
        perfilId: Const.perfiles.APROBADOR,
        documentoEmpresaId: 8, // carta_dcto_planilla
        createdAt: now,
        updatedAt: now,
      },
      {
        perfilId: Const.perfiles.APROBADOR,
        documentoEmpresaId: 7, // boletas
        createdAt: now,
        updatedAt: now,
      },
      // ANALISTA
      {
        perfilId: Const.perfiles.ANALISTA,
        documentoEmpresaId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        perfilId: Const.perfiles.ANALISTA,
        documentoEmpresaId: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        perfilId: Const.perfiles.ANALISTA,
        documentoEmpresaId: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        perfilId: Const.perfiles.ANALISTA,
        documentoEmpresaId: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        perfilId: Const.perfiles.ANALISTA,
        documentoEmpresaId: 5,
        createdAt: now,
        updatedAt: now,
      },
      {
        perfilId: Const.perfiles.ANALISTA,
        documentoEmpresaId: 6,
        createdAt: now,
        updatedAt: now,
      },
      {
        perfilId: Const.perfiles.ANALISTA,
        documentoEmpresaId: 9,
        createdAt: now,
        updatedAt: now,
      },
      {
        perfilId: Const.perfiles.ANALISTA,
        documentoEmpresaId: 10,
        createdAt: now,
        updatedAt: now,
      },
      {
        perfilId: Const.perfiles.ANALISTA,
        documentoEmpresaId: 11,
        createdAt: now,
        updatedAt: now,
      },
      {
        perfilId: Const.perfiles.ANALISTA,
        documentoEmpresaId: 12,
        createdAt: now,
        updatedAt: now,
      },
      {
        perfilId: Const.perfiles.ANALISTA,
        documentoEmpresaId: 13,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('PerfilDocumentoEmpresa', null, {});
  },
};
