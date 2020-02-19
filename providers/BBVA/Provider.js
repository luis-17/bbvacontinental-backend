const { ServiceProvider } = require('@adonisjs/fold');

class BBVAContiProvider extends ServiceProvider {
  _convenios() {
    this.app.singleton('Imperius/Providers/BBVA/Convenios', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('BBVAConti').convenios);
    });
    this.app.alias('Imperius/Providers/BBVA/Convenios', 'BBVA/Convenios');
  }

  register() {
    this._convenios();
  }
}

module.exports = BBVAContiProvider;
