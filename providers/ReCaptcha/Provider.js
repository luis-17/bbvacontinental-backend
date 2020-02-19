const { ServiceProvider } = require('@adonisjs/fold');

class ReCaptchaProvider extends ServiceProvider {
  register() {
    this.app.singleton('Imperius/Providers/ReCaptcha', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('ReCaptcha').default);
    });
    this.app.alias('Imperius/Providers/ReCaptcha', 'ReCaptcha');
  }
}

module.exports = ReCaptchaProvider;
