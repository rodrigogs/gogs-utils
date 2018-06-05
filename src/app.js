const { Env, logger, views } = require('../config');
const debug = require('../config/debug')('app');
const Koa = require('koa');
const helmet = require('koa-helmet');
const morgan = require('koa-morgan');
const serve = require('koa-static');
const mount = require('koa-mount');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

/**
 * Bootstraps Koa application.
 *
 * @return {Promise<Koa>}
 */
const bootstrap = async () => {
  debug('bootstrapping application');

  const app = new Koa();
  app.use(helmet());
  app.use(cors());
  app.use(mount('/static', serve(`${__dirname}/web/public`)));
  app.use(morgan(Env.HTTP_LOG_CONFIG, { stream: logger.stream }));
  app.use(bodyParser());

  const router = require('./web');
  app.use(router.routes());
  app.use(router.allowedMethods());

  views(app);

  return app;
};

module.exports = bootstrap;
