/* eslint-disable no-await-in-loop,no-restricted-syntax */
const debug = require('../../../../config/debug')('web:features:query:service');
const Env = require('../../../../config/env');
const logger = require('../../../../config/logger');
const mysql = require('mysql2/promise');
const VaultProvider = require('../../../providers/vault.provider');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const os = require('os');
const highland = require('highland');

const RESULT_DIR = path.resolve(os.homedir(), '.query_results');
if (!fs.existsSync(RESULT_DIR)) fs.mkdirSync(RESULT_DIR);

let singleton = null;

/**
 * @module QueryService
 */
class QueryService {
  constructor(vault) {
    this.vault = vault;
  }

  async getVault() {
    if (!this.vault) {
      this.vault = await VaultProvider.getInstance();

      setTimeout(() => {
        this.vault = null;
      }, this.vault.duration - (30 * 1000)); // Credentials duration - 30 seconds
    }

    return this.vault;
  }

  static async getInstance() {
    if (!singleton) {
      const vault = await VaultProvider.getInstance();
      singleton = new QueryService(vault);
    }

    return singleton;
  }

  async getDatabases() {
    debug('retrieving databases');

    const vault = await this.getVault();
    return vault.getDatabases();
  }

  async getSchemas(database) {
    debug(`retrieving database schemas for "${database}"`);

    const vault = await this.getVault();
    const credentials = await vault.getDatabaseCredentials(database);

    const connection = await mysql.createConnection({
      host: `${database}.${Env.MYSQL_DATABASES_URL}`,
      port: Env.MYSQL_DATABASES_PORT,
      user: credentials.username,
      password: credentials.password,
    });

    const schemas = await connection.execute('SHOW DATABASES');
    return schemas[0].map(schema => schema.Database);
  }

  async executeBatch(name, databases, query) {
    debug('executing batch query');

    const filePath = path.join(RESULT_DIR, name);
    const buffer = fs.createWriteStream(filePath);

    buffer.write(`[${os.EOL}`);

    let databasesToProcess = databases.length;
    let schemasToProcess = databases.map(db => db.schemas.length).reduce((p, c) => p + c, 0);

    await Promise.all(databases.map((db) => {
      databasesToProcess -= 1;

      return Promise.each(db.schemas, async (schema) => {
        schemasToProcess -= 1;

        let results;
        try {
          results = await this.executeQuery(db.database, schema, query)
        } catch (err) {
          logger.error(err);
          results = err.message;
        }

        const data = JSON.stringify({
          database: db.database,
          schema,
          results,
        }, null, 2);

        buffer
          .write(data
            .split(os.EOL)
            .map(line => `  ${line}`)
            .join(os.EOL));

        if (databasesToProcess > 0 || schemasToProcess > 0) buffer.write(`,${os.EOL}`);
      });
    }));

    buffer.write(`${os.EOL}]`);

    buffer.end();

    return fs.createReadStream(filePath);
  }

  async executeQuery(database, schema, query) {
    debug(`executing query for "${database}.${schema}"`);

    const vault = await this.getVault();
    const credentials = await vault.getDatabaseCredentials(database);

    const connection = await mysql.createConnection({
      host: `${database}.${Env.MYSQL_DATABASES_URL}`,
      port: Env.MYSQL_DATABASES_PORT,
      user: credentials.username,
      password: credentials.password,
      database: schema,
    });

    const [rows, fields] = await connection.query(query);
    await connection.close();

    return rows.map((row) => {
      const normalized = {};

      fields.forEach((field) => {
        normalized[field.name] = row[field.name];
      });

      return normalized;
    });
  }
}

module.exports = QueryService;
