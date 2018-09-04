var fs = require('fs')
var path = require('path')
var yaml = require('yamljs');
// YAML = require('yamljs');
const railsPath = '../config/locales/views/'
const langPath = './lang/'


var processFile = function(fileName, callback){
  try {
    var json = yaml.parse(
      fs.readFileSync(
        railsPath + fileName
      , 'utf8'));
    var rawName = fileName.split('.')[0]
    fs.writeFile(langPath + rawName + '.json', JSON.stringify(json[rawName].kyber_swap, null, 2), 'utf8', callback);
  } catch (e) {
    console.log(e);
  }
}


try {
  var list = fs.readdirSync(railsPath)
  list.forEach(file => {
    processFile(file, (err) => {
      if(!err) console.log(`process file ${file} without error`)
    })
  })
} catch (error) {
  
}
