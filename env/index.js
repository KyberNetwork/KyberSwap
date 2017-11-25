var config
, config_file = ( typeof __PROCESS__ !== 'undefined' && __PROCESS__ && __PROCESS__.ENV ? __PROCESS__.ENV : 'development') + '.json';
try {
  config = require('./config-env/' + (config_file));
  } catch (err) {
  if (err.code && err.code === 'MODULE_NOT_FOUND') {
    console.error('No config file matching ENV=' + __PROCESS__.ENV 
      + '. Requires "' + __PROCESS__.ENV + '.json"');
    // process.exit(1);
  } else {
    throw err;
}
}
module.exports = config;