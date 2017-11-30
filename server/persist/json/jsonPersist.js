

//var BasePersist = require("../basePersist")
var fs = require('fs')
var config = require("../configure")

var path = require('path')
const filePath = path.join(__dirname, 'store.json');



class JSONPersist {
  constructor() {
    this.initStore()
  }

  initStore() {
    fs.readFile(filePath, 'utf8', function (err, data) {
      if (err || data === "") {
        var initData = {
          currentBlock: 0,
          latestBlock: 0,
          frequency: config.frequency,
          count: 0,
          rangeFetch: config.rangeFetch,
          logs: []
        }
        fs.writeFile(filePath, JSON.stringify(initData), function (err) {
          if (err) {
            return console.log(err);
          }
          console.log("The file was inited!");
        })
      }else{
         var obj = JSON.parse(data)
         obj.frequency =  config.frequency
         obj.rangeFetch =  config.rangeFetch
         fs.writeFile(filePath, JSON.stringify(obj), function (err) {
          if (err) {
            return console.log(err);
          }
          console.log("The file was inited!");
        })
      }
    })
  }

  getCurrentBlock() {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) reject(reject)
        var obj = JSON.parse(data)
        resolve(obj.currentBlock)
      })
    })
  }

  getRangeBlock() {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) reject(reject)
        var obj = JSON.parse(data)
        resolve(obj.rangeFetch)
      })
    })
  }

  getFrequency() {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) reject(err)
        var obj = JSON.parse(data)
        resolve(obj.frequency)
      })
    })
  }

  getCount() {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) reject(err)
        var obj = JSON.parse(data)
        resolve(obj.count)
      })
    })
  }

  getRate() {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) reject(err)
        var obj = JSON.parse(data)
        resolve(obj.rates)
      })
    })
  }

  updateCount(count) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) throw err
        var obj = JSON.parse(data)
        obj.count = count
        fs.writeFile(filePath, JSON.stringify(obj), function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(count)
            console.log("Count is updated")
          }

        })

      })
    })
  }

  updateBlock(block) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) throw err
        var obj = JSON.parse(data)
        obj.currentBlock = block
        fs.writeFile(filePath, JSON.stringify(obj), function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(obj.currentBlock)
            console.log("Block is increase!");
          }

        })

      })
    })
  }

  getHighestBlock(){
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) throw err
        var obj = JSON.parse(data)
        if (obj.logs.length > 0){
          resolve(obj.logs[0].blockNumber)
        }else{
          resolve(0)
        }
      })
    })
  }

  savedEvent(event){
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) throw err
        var obj = JSON.parse(data)
        obj.logs.unshift(event)
        fs.writeFile(filePath, JSON.stringify(obj), function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(event)
            console.log("Event is saved");
          }

        })
      })
    })
  }

  saveRate(rates){
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) throw err
        var obj = JSON.parse(data)
        obj.rates = rates
        fs.writeFile(filePath, JSON.stringify(obj), function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(rates)
            console.log("Rates is saved");
          }
        })
      })
    })
  }

  getEvents(page, itemPerPage){
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
          reject(err);
        } else {
          var obj = JSON.parse(data)
          var toEvent  = (page+1)*itemPerPage
          if(toEvent > obj.logs.length - 1){
            toEvent = obj.logs.length - 1
          }
          var events = obj.logs.slice(page * itemPerPage, toEvent)
          resolve(events)
        }
        
      })
    })
  }

  countEvents(){
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
          reject(err);
        } else {
          var obj = JSON.parse(data)
          resolve(obj.logs.length)
        }
        
      })
    })
  }

  saveLatestBlock(blockNumber){
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
          reject(err);
        } else {
          var obj = JSON.parse(data)
          if (blockNumber <= obj.latestBlock ) return
          obj.latestBlock = blockNumber
          fs.writeFile(filePath, JSON.stringify(obj), function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(blockNumber)
              console.log("block is updated");
            }
  
          })
        }
        
      })
    })
  }

  getLatestBlock(){
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
          reject(err);
        } else {
          var obj = JSON.parse(data)
          resolve(obj.latestBlock)
        }
        
      })
    })
  }

  checkEventByHash(txHash, blockNumber){
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
          reject(err);
        } else {
          var obj = JSON.parse(data)
          var check = false
          for(var i = 0; i< obj.logs.length; i++){
            if (obj.logs[i].blockNumber < blockNumber){
              resolve(false)
              break
            }
            if (obj.logs[i].blockNumber === blockNumber){
              if(obj.logs[i].txHash === txHash){
                resolve(true) 
                break 
              }else{
                continue
              }
            }
            resolve(false) 
            break
          }
        }
        
      })
    })
  }

}


module.exports = JSONPersist