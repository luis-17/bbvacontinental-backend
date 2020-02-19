const Database = use('Database');
const HistoriaSimulador = Database.model('HistoriaSimulador');

HistoriaSimulador.isExistHistoria = async function () {
  return HistoriaSimulador.findAll({ where: { estado: 1 } });
};

module.exports = HistoriaSimulador;
