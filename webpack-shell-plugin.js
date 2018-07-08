'use strict';

const exec = require('child_process').exec;

function puts(error, stdout, stderr) {
    console.log(stdout);
}


class WebpackShellPlugin {
  constructor(options) {
    let defaultOptions = {
      onBuildStart: [],
      onBuildEnd: []
    };

    this.options = Object.assign(defaultOptions, options);
  }

  apply (compiler) {
    const options = this.options;

    compiler.plugin("compilation", compilation => {
      if(options.onBuildStart.length){
          console.log("Executing pre-build scripts");
          options.onBuildStart.forEach(script => exec(script, puts));
      }
    });
    
    compiler.plugin("emit", (compilation, callback) => {
      if(options.onBuildEnd.length){
        
          options.onBuildEnd.forEach(script => {
            let newScript = script.replace(/\[(.+?)\]/g, i => {
              let param = i.replace('[','').replace(']','')
              return compilation[param] || options[param]
              // return options[param]
            })
            console.log("$$$$$$$$$ new script $$$$$$$$$$", newScript)
            return exec(newScript, puts)
          });
          // options.onBuildEnd.forEach(script => exec(script, puts));
      }
      callback();
    });
  };
}

module.exports = WebpackShellPlugin;