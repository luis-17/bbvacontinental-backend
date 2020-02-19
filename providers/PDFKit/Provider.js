const { ServiceProvider } = require('@adonisjs/fold');

class PDFKitProvider extends ServiceProvider {
  register() {
    this.app.singleton('Imperius/Providers/PDFKit/generarCronograma', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('PDFKit').formato);
    });
    this.app.alias('Imperius/Providers/PDFKit/generarCronograma', 'PDFKit');
  }
}

module.exports = PDFKitProvider;
