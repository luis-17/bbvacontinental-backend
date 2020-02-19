const { ServiceProvider } = require('@adonisjs/fold');

class DatabaseProvider extends ServiceProvider {
  register() {
    this.app.singleton('Imperius/Providers/Database', () => {
      const Config = this.app.use('Config');
      return new (require('.'))(Config.get('database')[process.env.NODE_ENV]);
    });
    this.app.alias('Imperius/Providers/Database', 'Database');
  }
}

module.exports = DatabaseProvider;
