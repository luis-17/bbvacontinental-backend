const Database = use('Database');
const ClienteVivienda = Database.model('ClienteVivienda');
const Solicitud = Database.model('Solicitud');
ClienteVivienda.saveClienteVivienda = async function (data) {
  // console.log(data, 'dataaaa64');
  // return false;
  const t = await Database.sequelize.transaction();
  try {
    const rowClienteVivienda = await ClienteVivienda.update({
      tipoUbicacionId: data.tipoUbicacionId,
      relacionViviendaId: data.relacionViviendaId,
      departamentoId: data.departamentoId,
      provinciaId: data.provinciaId,
      distritoId: data.distritoId,
      tipoViaId: data.tipoViaId,
      nombreVia: data.nombreVia ? Buffer.from(encodeURI(data.nombreVia)).toString('base64') : null,
      manzana: data.manzana ? Buffer.from(data.manzana).toString('base64') : null,
      lote: data.lote ? Buffer.from(data.lote).toString('base64') : null,
      numExterior: data.numExterior ? Buffer.from(data.numExterior).toString('base64') : null,
      numInterior: data.numInterior ? Buffer.from(data.numInterior).toString('base64') : null,
      nombreUbicacion: data.nombreUbicacion ? Buffer.from(encodeURI(data.nombreUbicacion)).toString('base64') : null,
      referencia: data.referencia ? Buffer.from(encodeURI(data.referencia)).toString('base64') : null,
      resideDesde: data.resideDesde,
      gastosAlquiler: data.gastosAlquiler,
      numUnidadFam: data.numUnidadFam,
      numCelular: data.numCelular ? Buffer.from(data.numCelular).toString('base64') : null,
      correoElectronico: data.correoElectronico ? Buffer.from(data.correoElectronico).toString('base64') : null,
      operadorId: data.operadorId,
    }, {
      where: {
        id: data.id,
      },
      transaction: t,
    });
    await Solicitud.update({
      vistaHTML: data.vistaHTML,
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    await t.commit();
    return rowClienteVivienda;
  } catch (err) {
    await t.rollback();
    throw new Error(err.message);
  }
};
module.exports = ClienteVivienda;
