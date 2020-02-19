const { ServiceProvider } = require('@adonisjs/fold');

class RUCProvider extends ServiceProvider {
  register() {
    this.app.singleton('Imperius/Providers/RUC', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('ruc'));
    });
    this.app.alias('Imperius/Providers/RUC', 'RUC');
  }
}

module.exports = RUCProvider;
