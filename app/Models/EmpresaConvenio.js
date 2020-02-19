const Database = use('Database');
const EmpresaConvenio = Database.model('EmpresaConvenio');
const ActividadEconomica = Database.model('ActividadEconomica');
const Empresa = Database.model('Empresa');
const ColaboradorEmpresaConvenio = Database.model('ColaboradorEmpresaConvenio');

EmpresaConvenio.listarEmpresasConvenioDeFuvex = async function (arrParams) {
  const { colaboradorId, perfilId } = arrParams;
  const arrIncludes = [];
  if (!(perfilId === 7)) { // fuvexadmin
    arrIncludes.push({
      attributes: [],
      model: ColaboradorEmpresaConvenio,
      as: 'ColaboradorEmpresaConvenio',
      where: { colaboradorId },
    });
  }
  arrIncludes.push({
    attributes: ['id', 'nombreComercial'],
    model: Empresa,
    as: 'Empresa',
    include: [{
      model: ActividadEconomica,
      as: 'ActividadEconomica',
    }],
  });
  return EmpresaConvenio.findAll({
    attributes: ['id', 'cantMesesVariable', 'montoMinimoPrestamo', 'montoMaximoPrestamo'],
    include: arrIncludes,
  });
};
EmpresaConvenio.findById = async (arrParams) => {
  try {
    const empresaConvenio = await EmpresaConvenio.findOne({
      where: { id: arrParams.empresaConvenioId },
      include: {
        model: Empresa,
        as: 'Empresa',
      },
    });
    if (!empresaConvenio) {
      throw new Error('No existe la empresa convenio');
    }
    return empresaConvenio;
  } catch (e) {
    throw new Error(e.message);
  }
};
module.exports = EmpresaConvenio;
