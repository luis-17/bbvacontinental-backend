const { Sequelize: { Op } } = require('sequelize');

const Database = use('Database');
const MotivoRechazo = Database.model('MotivoRechazo');
const Const = use('App/Helpers/Const');

MotivoRechazo.listarPorConvenio = async (data) => {
  try {
    const motivosRechazo = await MotivoRechazo.findAll({
      where: {
        [Op.or]: [
          {
            empresaConvenioId: data.empresaConvenioId,
            tipoMotivoRechazo: data.tipoMotivoRechazo,
          },
          {
            empresaConvenioId: data.empresaConvenioId,
            tipoMotivoRechazo: Const.typesReasonReject.DEFAULT,
            descripcion: Const.reasonsReject.OTROS,
          },
        ],
      },
      attributes: ['id', 'descripcion'],
    });
    if (!motivosRechazo) {
      return [];
    }
    return motivosRechazo;
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = MotivoRechazo;
