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


app.post('/getRate', function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  var event = persistor.getRate()
  event.then((result) => {
    res.end(JSON.stringify(result))
  })
});


app.post('/getHistory', function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  var page = req.body.page
  var itemPerpage = req.body.itemPerPage
  var event = persistor.getEvents(page, itemPerpage)
  event.then((result) => {
    res.end(JSON.stringify(result))
  })
})

app.post('/countHistory', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  var event = persistor.countEvents()
  event.then((result) => {
    res.end(JSON.stringify(result))
  })
})

app.post('/getLatestBlock', (req, res)=>{
  res.writeHead(200, { 'Content-Type': 'text/html' });
  var event = persistor.getLatestBlock()
  event.then((result) => {
    res.end(JSON.stringify(result))
  })
})

port = 3001
app.listen(port)
console.log('Listening at http://localhost:' + port)