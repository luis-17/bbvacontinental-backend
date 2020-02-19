const { ServiceProvider } = require('@adonisjs/fold');

class PasswordProvider extends ServiceProvider {
  register() {
    this.app.singleton('Imperius/Providers/Password', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('auth').basic);
    });
    this.app.alias('Imperius/Providers/Password', 'Password');
  }
}

module.exports = PasswordProvider;
