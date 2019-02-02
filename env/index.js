

var env = process.env.env ? process.env.env: "ropsten"


var config

try {
  config = require('./config-env/' + env + '.json');
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



