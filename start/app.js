const httpStatus = require('http-status-codes');
const log4js = require('log4js');
const express = require('express');
const bodyParser = require('body-parser');
const useragent = require('express-useragent');
const cors = require('cors');
require('express-async-errors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { createRouter } = require('./ExpressLaravelRouter');

const log = log4js.getLogger('app');

const app = express();
app.use(helmet({
  frameguard: {
    action: 'allow-from',
    domain: '*'
  }
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(useragent.express());
app.use(log4js.connectLogger(log4js.getLogger('http'), { level: 'auto' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

require('./routes')(createRouter({
  app,
  logging({ method, uri }) {
    log.debug(`${method.padEnd(7, '\u0020')} :: ${uri}`);
  },
}));

app.use(errors());

// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    message: 'No se ha encontrado',
    data: null,
  });
});

// error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.name === 'UnauthorizedError') {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: 'No autorizado',
      data: null,
    });
  }
  log.error('Algo sali\u00F3 mal:', err);
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: 'Servicio no disponible, intentar en unos momentos.',
    data: null,
  });
});

module.exports = app;
