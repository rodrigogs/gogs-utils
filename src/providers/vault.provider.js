const debug = require('../../config/debug')('providers:vault');
const Env = require('../../config/env');
const axios = require('axios');

const {
  GITHUB_VAULT_PERSONAL_TOKEN,
  VAULT_URL,
} = Env;

let singleton = null;

class VaultProvider {
  constructor(clientToken, duration) {
    this.clientToken = clientToken;
    this.request = axios.create({
      baseURL: VAULT_URL,
      headers: {
        'X-Vault-Token': clientToken,
      },
    });
    this.duration = duration;
  }

  /* eslint-disable class-methods-use-this */
  async getDatabases() {
    // this.request.get('/v1/database/creds'); FIXME it should work, but doesnt
    return ['involvesdbeua', 'involvesdbeua2', 'involvesdbeua3'];
  }

  /**
   * @param database
   * @param accessMode
   * @return {Promise<Object>}
   */
  async getDatabaseCredentials(database, accessMode = 'readonly') {
    debug(`retrieving credentials for database "${database}" with access mode "${accessMode}"`);

    const { data: credentials } = await this.request.get(`/v1/database/creds/${accessMode}_${database}`);
    return credentials.data;
  }

  /**
   * @param {String} githubToken GitHub personal token
   * @return {Promise<VaultProvider>}
   */
  static async getInstance(githubToken = GITHUB_VAULT_PERSONAL_TOKEN) {
    if (!singleton) {
      debug('creating new vault instance');
      const { data } = await axios.post(`${VAULT_URL}/v1/auth/github/login`, {
        token: githubToken,
      });

      singleton = new VaultProvider(data.auth.client_token, data.auth.lease_duration);
    }

    return singleton;
  }
}

module.exports = VaultProvider;
