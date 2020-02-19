const states = {
  REGISTRADO: 1,
  EVALUADO: 2,
  SIMULADO: 3,
  SOLICITADO: 4,
  'APROBADO - RRHH': 5,
  'OBSERVADO - RRHH': 6,
  FINALIZADO: 7,
  'OBSERVADO - ANALISTA': 8,
  CANCELADO: 9,
  'APROBADO - ANALISTA': 10,
};

const reasonsReject = {
  OTROS: 'OTROS',
  'POR RANGO DE EDAD': 'RANGO DE EDAD',
  'POR LISTA NEGRA': 'LISTA NEGRA',
  'POR CALCULO DE ENDEUDAMIENTO': 'CALCULO DE ENDEUDAMIENTO',
  'POR SOLICITUD EN CURSO': 'SOLICITUD EN CURSO',
};

const typesReasonReject = {
  DEFAULT: 'pd', // por defecto
};

const age = {
  min: 18,
  max: 65,
};

const perfiles = {
  FUVEX: 1,
  ADMIN: 2,
  APROBADOR: 3,
  FORMALIZADOR: 6,
  ANALISTA: 4,
  FUVEXADMIN: 7,
  FUVEXSUPERVISOR: 8,
  ANALISTAADMIN: 9,
  ANALISTASUPERVISOR: 10,
};
const simulador = {
  cuotaMinima: 50,
  montoMinimo: 1000,
  montoMaximo: 100000,
  plazoMaximo: 72,
};
const simuladorHistorico = {
  cliente: 'key_cliente',
  banco: 'key_banco',
  confirm: 'key_confirm',
};
module.exports = {
  states,
  reasonsReject,
  typesReasonReject,
  age,
  perfiles,
  simulador,
  simuladorHistorico,
};
