const path = require('path');

/**
* @see https://github.com/motdotla/dotenv#usage
*/
if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: path.resolve(__filename, '../../.env.test') });
} if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__filename, '../../.env') });
}

/**
 * @class Env
 */
class Env {
  /**
   * Application context.
   *
   * @default 'development'
   * @return {String}
   */
  static get NODE_ENV() {
    return (process.env.NODE_ENV || 'development');
  }

  /**
   * Application port.
   *
   * @default 3000
   * @return {Number}
   */
  static get PORT() {
    return process.env.PORT ? Number(process.env.PORT) : 3000;
  }

  /**
   * HTTP log config.
   *
   * @see https://github.com/expressjs/morgan#predefined-formats
   * @default 'dev'
   * @return {String}
   */
  static get HTTP_LOG_CONFIG() {
    return process.env.HTTP_LOG_CONFIG || 'dev';
  }

  /**
   * @return {String}
   */
  static get APP_NAME() {
    return process.env.APP_NAME;
  }

  /**
   * @return {String}
   */
  static get VAULT_URL() {
    return process.env.VAULT_URL;
  }

  /**
   * @return {String}
   */
  static get GITHUB_VAULT_PERSONAL_TOKEN() {
    return process.env.GITHUB_VAULT_PERSONAL_TOKEN;
  }

  /**
   * @return {String}
   */
  static get MYSQL_DATABASES_URL() {
    return process.env.MYSQL_DATABASES_URL;
  }

  /**
   * @return {String}
   */
  static get MYSQL_DATABASES_PORT() {
    return process.env.MYSQL_DATABASES_PORT;
  }
}

module.exports = Env;
