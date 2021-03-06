const debug = require('../../../../config/debug')('web:features:application:controller');
const ApplicationService = require('./application.service');

/**
 * @module ApplicationController
 */
const ApplicationController = {
  /**
   * @api {get} / Application status
   * @apiVersion 0.0.0
   * @apiName GetStatus
   * @apiGroup Application
   *
   * @apiSuccess {String} status Application status.
   * @apiSuccess {String} name Application name.
   * @apiSuccess {String} version Application version.
   */
  status: (ctx) => {
    debug('status action');

    const status = ApplicationService.status();
    ctx.render('features/application/views/index', status);
  },
};

module.exports = ApplicationController;
