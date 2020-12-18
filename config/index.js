

const _ = require('lodash')
const pkg = require('../package.json')
let config = require('./config_default')

try {
  const envConfig = require('./config') // eslint-disable-line
  config = _.merge(config, envConfig)
} catch (e) {
  if (!config.debug) {
    console.log('[ERROR] loading config/config.js failed:', e.message); // eslint-disable-line
  } else if (e.code !== 'MODULE_NOT_FOUND') {
      console.log('[ERROR] loading config/config.js failed:', e.message); // eslint-disable-line
  }
}
module.exports = config
