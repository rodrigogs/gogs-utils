const debug = require('../../config/debug')('web:routes');
const Router = require('koa-router');

const router = new Router();

debug('configuring routes');

const application = require('./features/application');
const query = require('./features/query');

router.use('/', application.routes(), application.allowedMethods());
router.use('/query', query.routes(), query.allowedMethods());

module.exports = router;
