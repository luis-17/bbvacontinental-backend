const { ServiceProvider } = require('@adonisjs/fold');

class EmailProvider extends ServiceProvider {
  register() {
    this.app.singleton('Imperius/Providers/Email/Lostpass', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('email').lostpass);
    });
    this.app.alias('Imperius/Providers/Email/Lostpass', 'Email/Lostpass');

    this.app.singleton('Imperius/Providers/Email/EnvioPrimerCorreo', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('email').envioPrimerCorreo);
    });
    this.app.alias('Imperius/Providers/Email/EnvioPrimerCorreo', 'Email/EnvioPrimerCorreo');

    this.app.singleton('Imperius/Providers/Email/SolicitudAprobadaFuvex', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('email').solicitudAprobadaFuvex);
    });
    this.app.alias('Imperius/Providers/Email/SolicitudAprobadaFuvex', 'Email/SolicitudAprobadaFuvex');

    this.app.singleton('Imperius/Providers/Email/SolicitudAprobadaRrhh', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('email').solicitudAprobadaRrhh);
    });
    this.app.alias('Imperius/Providers/Email/SolicitudAprobadaRrhh', 'Email/SolicitudAprobadaRrhh');

    this.app.singleton('Imperius/Providers/Email/SolicitudObservadaRrhh', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('email').solicitudObservadaRrhh);
    });
    this.app.alias('Imperius/Providers/Email/SolicitudObservadaRrhh', 'Email/SolicitudObservadaRrhh');

    this.app.singleton('Imperius/Providers/Email/SolicitudRechazadaRrhh', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('email').solicitudRechazadaRrhh);
    });
    this.app.alias('Imperius/Providers/Email/SolicitudRechazadaRrhh', 'Email/SolicitudRechazadaRrhh');

    this.app.singleton('Imperius/Providers/Email/SolicitudDesembolsadaNuevo', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('email').solicitudDesembolsadaNuevo);
    });
    this.app.alias('Imperius/Providers/Email/SolicitudDesembolsadaNuevo', 'Email/SolicitudDesembolsadaNuevo');

    this.app.singleton('Imperius/Providers/Email/SolicitudDesembolsadaSubro', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('email').solicitudDesembolsadaSubro);
    });
    this.app.alias('Imperius/Providers/Email/SolicitudDesembolsadaSubro', 'Email/SolicitudDesembolsadaSubro');

    this.app.singleton('Imperius/Providers/Email/SolicitudRechazadaVarios', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('email').solicitudRechazadaVarios);
    });
    this.app.alias('Imperius/Providers/Email/SolicitudRechazadaVarios', 'Email/SolicitudRechazadaVarios');

    this.app.singleton('Imperius/Providers/Email/SolicitudObservadaLector', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('email').solicitudObservadaLector);
    });
    this.app.alias('Imperius/Providers/Email/SolicitudObservadaLector', 'Email/SolicitudObservadaLector');

    this.app.singleton('Imperius/Providers/Email/SolicitudProcesadaLector', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('email').solicitudProcesadaLector);
    });
    this.app.alias('Imperius/Providers/Email/SolicitudProcesadaLector', 'Email/SolicitudProcesadaLector');

    this.app.singleton('Imperius/Providers/Email/SolicitudSimulada', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('email').solicitudSimulada);
    });
    this.app.alias('Imperius/Providers/Email/SolicitudSimulada', 'Email/SolicitudSimulada');

    this.app.singleton('Imperius/Providers/Email/Cronograma', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('email').cronograma);
    });
    this.app.alias('Imperius/Providers/Email/Cronograma', 'Email/Cronograma');

    this.app.singleton('Imperius/Providers/Email/SolicitudObservadaAnalista', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('email').solicitudObservadaAnalista);
    });
    this.app.alias('Imperius/Providers/Email/SolicitudObservadaAnalista', 'Email/SolicitudObservadaAnalista');
  }
}

module.exports = EmailProvider;
