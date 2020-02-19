const build = (name, length, plus) => Array.from({ length }, (_, index) => ({
  id: (index + plus),
  usuarioId: (index + plus),
  nombres: `${name} ${index + 1}`,
  apellidoPaterno: `${name} ${index + 1}`,
  apellidoMaterno: `${name} ${index + 1}`,
  correo: (() => {
    switch (index + 1) {
      case 1:
        return 'patricia.mesta.contractor@bbva.com';
      case 2:
        return 'carlos.effio@bbva.com';
      case 8:
        return 'juan.raymundo.contractor@bbva.com';
      case 7:
        return 'roger.matos.contractor@bbva.com';
      case 9:
        return 'gino.narrea@bbva.com';
      case 11:
        return 'carlos.sosa.navarro@bbva.com';
      case 12:
        return 'john.zapata.silva@bbva.com';
      default:
        return 'yosy@kontigo.pe';
    }
  })(),
}));

const fuvex = build('fuvex', 12, 1);
const rrhh = build('rrhh', 12, 13);
const analista = build('analista', 12, 25);
const bbva = build('bbva', 12, 37);
const formalizador = build('formalizador', 12, 49);

const fuvexadmin = build('fuvexadmin', 12, 61);
const fuvexsupervisor = build('fuvexsupervisor', 12, 73);
const analistaadmin = build('analistaadmin', 12, 85);
const analistasupervisor = build('analistasupervisor', 12, 97);

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Colaborador', [
      ...fuvex.map(row => ({
        ...row,
        empresaId: null,
        estadoCivilId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '47866486',
        sexo: 'M',
        fechaNacimiento: '1993-04-04',
        celular: '999999999',
        estado: 1,
      })),
      ...rrhh.map(row => ({
        ...row,
        empresaId: null,
        estadoCivilId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '47866486',
        sexo: 'M',
        fechaNacimiento: '1993-04-04',
        celular: '999999999',
        estado: 1,
      })),
      ...analista.map(row => ({
        ...row,
        empresaId: 1,
        estadoCivilId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '47866486',
        sexo: 'M',
        fechaNacimiento: '1993-04-04',
        celular: '999999999',
        estado: 1,
      })),
      ...bbva.map(row => ({
        ...row,
        empresaId: 1,
        estadoCivilId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '44360655',
        sexo: 'M',
        fechaNacimiento: '1984-05-01',
        celular: '999999999',
        estado: 1,
      })),
      ...formalizador.map(row => ({
        ...row,
        empresaId: 1,
        estadoCivilId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '44360655',
        sexo: 'M',
        fechaNacimiento: '1984-05-01',
        celular: '999999999',
        estado: 1,
      })),
      ...fuvexadmin.map(row => ({
        ...row,
        empresaId: 1,
        estadoCivilId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '44360655',
        sexo: 'M',
        fechaNacimiento: '1984-05-01',
        celular: '999999999',
        estado: 1,
      })),
      ...fuvexsupervisor.map(row => ({
        ...row,
        empresaId: 1,
        estadoCivilId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '44360655',
        sexo: 'M',
        fechaNacimiento: '1984-05-01',
        celular: '999999999',
        estado: 1,
      })),
      ...analistaadmin.map(row => ({
        ...row,
        empresaId: 1,
        estadoCivilId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '44360655',
        sexo: 'M',
        fechaNacimiento: '1984-05-01',
        celular: '999999999',
        estado: 1,
      })),
      ...analistasupervisor.map(row => ({
        ...row,
        empresaId: 1,
        estadoCivilId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '44360655',
        sexo: 'M',
        fechaNacimiento: '1984-05-01',
        celular: '999999999',
        estado: 1,
      })),
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('Colaborador', null, {});
  },
};
