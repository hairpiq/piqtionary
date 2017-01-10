'use strict'

require('dotenv').config();
const config = process.env;

/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: [ 'The Piqtionary: ' + config.HOSTNAME ],
  /**
   * Your New Relic license key.
   */
  license_key: 'd098e931908e60c43cf5b41f27da1804a45b44ad',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  }
}
