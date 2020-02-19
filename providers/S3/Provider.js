const { ServiceProvider } = require('@adonisjs/fold');

class S3Provider extends ServiceProvider {
  register() {
    this.app.singleton('Imperius/Providers/S3', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('s3').default);
    });
    this.app.alias('Imperius/Providers/S3', 'S3');

    this.app.singleton('Imperius/Providers/S3reporte', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('s3').restringidoReportes);
    });
    this.app.alias('Imperius/Providers/S3reporte', 'S3reporte');
  }
}

module.exports = S3Provider;
