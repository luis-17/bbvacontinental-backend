const { ServiceProvider } = require('@adonisjs/fold');

class JWTProvider extends ServiceProvider {
  register() {
    this.app.singleton('Imperius/Providers/JWT', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('auth').jwt);
    });
    this.app.alias('Imperius/Providers/JWT', 'JWT');
  }
}

module.exports = JWTProvider;
