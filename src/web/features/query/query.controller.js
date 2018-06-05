const debug = require('../../../../config/debug')('web:features:query:controller');
const QueryService = require('./query.service');

/**
 * @module QueryController
 */
const QueryController = {
  index: async (ctx) => {
    debug('index action');

    const Service = await QueryService.getInstance();

    const databases = await Service.getDatabases();
    const schemas = {};
    databases.forEach((db) => {
      schemas[db] = Service.getSchemas(db);
    });

    const options = {
      databases: await Promise.props(schemas),
    };

    ctx.render('features/query/views/index', options);
  },

  execute: async (ctx) => {
    const Service = await QueryService.getInstance();

    const { body } = ctx.request;
    const databases = Object.keys(body)
      .filter(prop => prop.startsWith('database'))
      .map(database => ({
        database: database.split('==')[1],
        schemas: [].concat(body[database]),
      }));

    ctx.body = await Service.executeBatch(body.queryName, databases, body.query);
  },
};

module.exports = QueryController;
