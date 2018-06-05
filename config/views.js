const debug = require('./debug')('config:views');
const path = require('path');
const Pug = require('koa-pug');
const Env = require('./env');

debug('configuring template engine');

module.exports = app => new Pug({
  viewPath: path.resolve(__dirname, '../src/web'),
  basedir: undefined,
  debug: false,
  pretty: false,
  compileDebug: false,
  locals: {
    APP_NAME: Env.APP_NAME,
  },
  helperPath: [],
  app,
});
