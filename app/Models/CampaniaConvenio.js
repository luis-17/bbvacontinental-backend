const Database = use('Database');
const CampaniaConvenio = Database.model('CampaniaConvenio');
const EmpresaConvenio = Database.model('EmpresaConvenio');
const Empresa = Database.model('Empresa');
const { Sequelize: { Op } } = Database;

CampaniaConvenio.listar = async function (arrParams) {
  return CampaniaConvenio.findAll({
    where: {
      empresaConvenioId: arrParams.empresaConvenioId,
      tipoCampania: arrParams.tipoCampania,
      fechaFinVigencia: {
        [Op.gte]: new Date(),
      },
    },
    include: [{
      model: EmpresaConvenio,
      as: 'EmpresaConvenio',
      include: [{
        model: Empresa,
        as: 'Empresa',
      }],
    }],
  });
};

module.exports = CampaniaConvenio;
