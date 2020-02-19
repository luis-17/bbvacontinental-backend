const { ServiceProvider } = require('@adonisjs/fold');

class EquifaxProvider extends ServiceProvider {
  register() {
    this.app.singleton('Imperius/Providers/Equifax', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('equifax'));
    });
    this.app.alias('Imperius/Providers/Equifax', 'Equifax');
  }
}

module.exports = EquifaxProvider;
