const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

class Database {
  constructor(config) {
    this._model = {};
    this.Sequelize = Sequelize;
    this.sequelize = new Sequelize(config.database, config.username, config.password, config);
    fs
      .readdirSync(path.join(__dirname, '../../database/models'))
      .filter(file => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
      .forEach((file) => {
        const model = this.sequelize['import'](path.join(__dirname, '../../database/models', file));
        this._model[model.name] = model;
      });

    Object.keys(this._model).forEach((modelName) => {
      if (this._model[modelName].associate) {
        this._model[modelName].associate(this._model);
      }
    });
  }

  model(name) {
    return this._model[name];
  }
}

module.exports = Database;
