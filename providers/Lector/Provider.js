const { ServiceProvider } = require('@adonisjs/fold');

class LectorProvider extends ServiceProvider {
  _lector() {
    this.app.singleton('Imperius/Providers/Lector', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('lector').configLector);
    });
    this.app.alias('Imperius/Providers/Lector', 'Lector');
  }

  register() {
    this._lector();
  }
}

module.exports = LectorProvider;
