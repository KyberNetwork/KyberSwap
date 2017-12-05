var express = require('express');
var fs = require('fs')
var cors = require('cors')
var app = express()
app.use(cors())
var bodyParser = require('body-parser')

app.use(bodyParser.json())


//var PersistClass = require("./persist/json/jsonPersist")
var PersistClass = require("./persist/sqlite/sqlitePersist")
var persistor = new PersistClass()

function main() {
  var EthereumService = require("./eth/ethereum")
  var connectionInstance = new EthereumService(
    {
      default: 'http', persistor: persistor,
      // callbackLogs: (events, latestBlock) => {
      //   handleEvent(events, latestBlock)
      // }
    })
  connectionInstance.subcribe()
}

main()


app.get('/getRate', function (req, res) {
  // res.writeHead(200, { 'Content-Type': 'text/html' });
  var event = persistor.getRate()
  event.then((result) => {
    if(!result || !result.length){
      res.status(404).send()
    }
    res.end(JSON.stringify(result))
  })
});


app.get('/getHistory', function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  var page = req.body.page
  var itemPerpage = req.body.itemPerPage
  var event = persistor.getEvents(page, itemPerpage)
  event.then((result) => {
    res.end(JSON.stringify(result))
  })
})

app.get('/getHistoryTwoColumn', function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  // var page = req.body.page
  // var itemPerpage = req.body.itemPerPage
  //console.log("x")
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
app.get('/countHistory', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  var event = persistor.countEvents()
  event.then((result) => {
    res.end(JSON.stringify(result))
  })
})

app.get('/getLatestBlock', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  var event = persistor.getLatestBlock()
  event.then((result) => {
    res.end(JSON.stringify(result))
  })
})

app.get('/getLanguagePack', (req, res) => {
  var lang = req.query.lang;
  try{
    var langualgePack = require("../lang/" + lang + ".json")
    return res.json(langualgePack)
  } catch (err) {
    return res.status(404).send("language pack not found!")
  }
})

var port = process.env.npm_config_port? process.env.npm_config_port:3001
app.listen(port, '0.0.0.0')
console.log('Listening at http://0.0.0.0:' + port)
