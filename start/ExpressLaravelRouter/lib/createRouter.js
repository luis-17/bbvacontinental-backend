const path = require('path');
const is = require('@sindresorhus/is');
const normalize = require('normalize-path');

const laravelToExpress = require('./laravelToExpress');
const uriWithParams = require('./uriWithParams');

const defaultGroupOptions = {
  prefix: '/',
  middleware: [],
  namespace: '',
  patterns: {},
  meta: {},
};

const defaultRouteOptions = {
  method: 'get',
  uri: '/',
  middleware: [],
  name: '',
  patterns: {},
  meta: {},
};

const proxy = {
  get(router, method) {
    return method in router
      ? router[method]
      : (options, action) => {
        if (typeof options === 'string' || options instanceof String) {
          options = {
            uri: options,
          };
        }

        options.method = method;
        router.route(options, action);
      };
  },
};

function createRouter({
  app,
  mapActionToHandler = action => action,
  appPath = 'App',
  httpCtrlPath = 'Controllers',
  logging = log => log,
}) {
  const namedUrls = {};
  const store = {};

  const handler = (path = '') => {
    const index = path.lastIndexOf('.');
    const method = path.substring(index + 1);
    let controller = path.substring(0, index);
    if (!controller.startsWith(appPath)) {
      controller = `${httpCtrlPath}/${controller}`;
    }
    if (!Object.prototype.hasOwnProperty.call(store, controller)) {
      const Controller = use(controller);
      store[controller] = new Controller();
    }
    return store[controller][method].bind(store[controller]);
  };

  class Router {
    constructor() {
      this.app = app;
      this.uris = [];
      this.middlewares = [];
      this.names = [];
      this.patterns = [];
      this.metas = [];
    }

    /**
     *
     * @param {string|object} options
     * @param {*} action
     * @returns {Router}
     */
    route(options, action) {
      if (typeof options === 'string' || options instanceof String) {
        options = {
          uri: options,
        };
      }

      const routeOptions = Object.assign({}, defaultRouteOptions, options);
      routeOptions.method = routeOptions.method.toLowerCase();

      const uri = normalize(path.join.apply(null, this.uris.concat(`/${routeOptions.uri}`)));
      const middleware = this.middlewares.concat(routeOptions.middleware);
      const name = this.names.concat(routeOptions.name).join('');
      const patterns = Object.assign.apply(null, [{}].concat(this.patterns, routeOptions.patterns));
      const meta = Object.assign.apply(null, [{}].concat(this.metas, routeOptions.meta));
      const _action = is.function(action) ? action : handler(action);

      let stack = middleware.concat(mapActionToHandler(_action, {
        uri,
        middleware,
        name,
        patterns,
        meta,
      }, routeOptions));
      logging({ method: routeOptions.method.toUpperCase(), uri });

      if (routeOptions.name) {
        namedUrls[name] = {
          uri,
          patterns,
        };
      }
      stack = stack.map(s => (is.function(s) ? s : handler(s)));
      app[routeOptions.method](laravelToExpress(uri, patterns), stack);

      return this;
    }

    /**
     *
     * @param {string|object} options
     * @param {function} closure
     * @returns {Router}
     */
    group(options, closure) {
      if (typeof options === 'string' || options instanceof String) {
        options = {
          prefix: options,
        };
      }

      const groupOptions = Object.assign({}, defaultGroupOptions, options);
      const router = new this.constructor(this);
      router.uris = this.uris.concat(`/${groupOptions.prefix}`);
      router.middlewares = this.middlewares.concat(groupOptions.middleware);
      router.names = this.names.concat(groupOptions.namespace);
      router.patterns = this.patterns.concat(groupOptions.patterns);
      router.metas = this.metas.concat(groupOptions.meta);

      if (!Proxy) {
        closure(router);
        return this;
      }

      closure(new Proxy(router, proxy));
      return this;
    }

    /**
     *
     * @param {string} uri
     * @param staticMiddleware
     * @returns {Router}
     */
    serve(uri, staticMiddleware) {
      const _uri = path.join.apply(null, this.uris.concat(uri));
      const patterns = Object.assign.apply(null, [{}].concat(this.patterns));
      const stack = this.middlewares.concat(staticMiddleware);

      app.use(laravelToExpress(_uri, patterns), stack);
      return this;
    }

    /**
     *
     * @param {string} name
     * @param {object} [params]
     * @param {object} [options]
     * @returns {string}
     */
    url(name, params = {}, options = {}) {
      const namedUrl = namedUrls[name];
      if (!namedUrl) {
        throw new Error(`No URL found for  "${name}"`);
      }
      const { uri, patterns } = namedUrl;

      return uriWithParams(uri, params, patterns, options);
    }
  }

  const router = new Router();

  if (!Proxy) {
    return router;
  }

  return new Proxy(router, proxy);
}

module.exports = createRouter;
