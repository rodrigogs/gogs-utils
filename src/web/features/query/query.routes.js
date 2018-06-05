const debug = require('../../../../config/debug')('web:features:query:routes');
const Router = require('koa-router');

const router = new Router();

debug('configuring routes');

const QueryController = require('./query.controller');

router.get('/', QueryController.index);
router.post('/', QueryController.execute);

module.exports = router;
