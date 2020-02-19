const { ServiceProvider } = require('@adonisjs/fold');

class SentinelProvider extends ServiceProvider {
  register() {
    this.app.singleton('Imperius/Providers/Sentinel', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('sentinel'));
    });
    this.app.alias('Imperius/Providers/Sentinel', 'Sentinel');
  }
}

module.exports = SentinelProvider;
