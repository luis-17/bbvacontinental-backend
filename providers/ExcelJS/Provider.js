const { ServiceProvider } = require('@adonisjs/fold');

class ExcelJSProvider extends ServiceProvider {
  register() {
    this.app.singleton('Imperius/Providers/ExcelJS/generarSolicitudes', () => {
      // const Config = this.app.use('Config');
      return new (require('.'))();
    });
    this.app.alias('Imperius/Providers/ExcelJS/generarSolicitudes', 'ExcelJS');
  }
}

module.exports = ExcelJSProvider;
