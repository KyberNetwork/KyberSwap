
var config
, config_file = ( typeof env !== 'undefined' ? env : process.env.npm_config_chain || 'kovan') + '.json';
try {
  config = require('./config-env/' + (config_file));
  } catch (err) {
  if (err.code && err.code === 'MODULE_NOT_FOUND') {
    console.error('No config file matching ENV=' + env
      + '. Requires "' + env + '.json"');
    // process.exit(1);
  } else {
    throw err;
}
}
module.exports = config;

