const { ServiceProvider } = require('@adonisjs/fold');

class SMSProvider extends ServiceProvider {
  register() {
    this.app.singleton('Imperius/Providers/SMS', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('sms').default);
    });
    this.app.alias('Imperius/Providers/SMS', 'SMS');
  }
}

module.exports = SMSProvider;
