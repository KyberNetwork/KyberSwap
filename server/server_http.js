var fs = require('fs')
var express = require('express');

var cors = require('cors')
var app = express()
app.use(cors())
var bodyParser = require('body-parser')

app.use(bodyParser.json())


var isInit = process.env.npm_config_init || process.env.init
console.log(isInit)


/**************** SET LOG FILE */
var fileLog = __dirname + "/error.log"
const manager = require('simple-node-logger').createLogManager();
manager.createFileAppender( { logFilePath:fileLog } );
const log = manager.createLogger( 'errorLog', 'info' );
if (!fs.existsSync(fileLog)){
  fs.writeFile(fileLog, '', function(){console.log('done created log file')})
}else{
  if(isInit){
    //clear error log
    fs.writeFile(fileLog, '', function(){console.log('done clear log file')})
  }
}
process.on('uncaughtException', function (err) {
  log.info(err, ' accepted at ', new Date().toJSON());
  console.log("uncaughtException")
});
/**END INIT */


/******************** INIT DATABASE ***************/
var PersistClass = require("./persist/sqlite/sqlitePersist")
var persistor = new PersistClass()
//clear database
if (isInit) {
  persistor.destroyStore(() => {
    persistor.initStore()
  })
} else {
  persistor.initStore()
}
/**END INIT DATABASE */


function main() {
  var EthereumService = require("./eth/ethereum")
  var connectionInstance = new EthereumService(
    {
      default: 'http', persistor: persistor,
    })
  connectionInstance.subcribe()
}

main()






/****************** HTTP SERVER */
app.get('/getRate', function (req, res) {
    var event = persistor.getRate()
    event.then((result) => {
      if (!result || !result.length) {
        res.status(404).send()
      }
      res.end(JSON.stringify(result))
    })
  });
  
  
  app.get('/getHistory', function (req, res) {
    var page = req.body.page
    var itemPerpage = req.body.itemPerPage
    var event = persistor.getEvents(page, itemPerpage)
    event.then((result) => {
      res.end(JSON.stringify(result))
    })
  })
  
  app.get('/getHistoryTwoColumn', function (req, res) {
    var page = 0
    var itemPerpage = 5
    var eventEth = persistor.getEventsFromEth(page, itemPerpage)
    var eventToken = persistor.getEventsFromToken(page, itemPerpage)
    eventEth.then((resultEth) => {
      eventToken.then((resultToken) => {
        res.end(JSON.stringify({ eth: resultEth, token: resultToken }))
      })
    })
  })
  
  
  app.get('/getHistoryOneColumn', function (req, res) {
    var page = 0
    var itemPerpage = 10
    var events = persistor.getEvents(page, itemPerpage)
    events.then((result) => {
      res.end(JSON.stringify({ events: result }))
    })
  })
  
  
  app.get('/countHistory', (req, res) => {
    var event = persistor.countEvents()
    event.then((result) => {
      res.end(JSON.stringify(result))
    })
  })
  
  app.get('/getLatestBlock', (req, res) => {
    var event = persistor.getLatestBlock()
    event.then((result) => {
      res.end(JSON.stringify(result))
    })
  })
  
  app.get('/getRateUSD', (req, res) => {
    var event = persistor.getRateUSD()
    event.then((result) => {
      if (!result || !result.length) {
        res.status(404).send()
      }
      res.end(JSON.stringify(result))
    })
  })
  
  app.get('/getLanguagePack', (req, res) => {
    var lang = req.query.lang;
    try {
      var langualgePack = require("../lang/" + lang + ".json")
      return res.json(langualgePack)
    } catch (err) {
      return res.status(404).send("language pack not found!")
    }
  })
  
  var port = process.env.npm_config_port ? process.env.npm_config_port : 3001
  app.listen(port, '0.0.0.0')
  console.log('Listening at http://0.0.0.0:' + port)