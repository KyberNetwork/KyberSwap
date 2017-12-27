const sqlite3 = require('sqlite3').verbose()

var fs = require('fs')
var path = require('path')
var config = require("../configure")
var constants = require("../../../src/js/services/constants")
var BLOCKCHAIN_INFO = require("../../../env")

var filePath

var dbName = process.env.npm_config_chain

//console.log("db name: " + dbName)
switch(dbName){
  case "kovan":
    filePath = path.join(__dirname, 'kovan.db')
    break
  case "mainnet":
    filePath = path.join(__dirname, 'mainnet.db')
    break
  default:
    filePath = path.join(__dirname, 'temp.db')
    break
}



class SqlitePersist {
  constructor() {
    this.initArraySupportedTokenAddress()
    //this.initStore()
  }

  destroyStore(cb){
    fs.unlink(filePath, (err, result)=>{
      console.log("Clear old file")
      cb()
    })
  }

  initStore() {
    if (fs.existsSync(filePath)) {
      this.db = new sqlite3.Database(filePath)
      var _this = this
      this.db.serialize(function () {
        var sql = `UPDATE configure SET frequency = ?, rangeFetch = ? WHERE id = ?`
        _this.db.run(sql, [config.frequency, config.rangeFetch, 1], (err, row) => {
          if (err) {
            console.log(err)
            //reject(err.message)
          } else {
             console.log("Update range fetch and frequency")
          }
        })
      })
      var stmt = this.db.prepare("UPDATE configure set frequency =?, rangeFetch =? WHERE id = 1")
      stmt.run(config.frequency, config.rangeFetch);
      stmt.finalize()
    } else {
      var _this = this
      this.db = new sqlite3.Database(filePath)
      this.db.serialize(function () {
        _this.db.run("CREATE TABLE configure (id INT, currentBlock INT, latestBlock INT, frequency INT, count INT, rangeFetch INT)");

        var stmt = _this.db.prepare("INSERT INTO configure VALUES (?,?,?,?,?,?)")
        stmt.run(1, 0, 0, config.frequency, 0, config.rangeFetch);
        stmt.finalize()

        _this.db.run("CREATE TABLE logs (id INTEGER PRIMARY KEY, actualDestAmount TEXT, actualSrcAmount TEXT, dest TEXT, source TEXT, sender TEXT, blockNumber INT, txHash TEXT, timestamp INT, status TEXT)")

        // create rate table
        _this.db.run("CREATE TABLE rates (id INTEGER PRIMARY KEY, source TEXT, dest TEXT, rate TEXT, expBlock TEXT, balance TEXT)")
        /// init all rate first time
      if(BLOCKCHAIN_INFO.tokens){
          Object.keys(BLOCKCHAIN_INFO.tokens).map((token) => {
            let stmt1 = _this.db.prepare(`INSERT INTO rates(source, dest, rate, expBlock, balance) VALUES (?,?,?,?,?)`)
            stmt1.run(token, constants.ETH.symbol, 0, 0);
            stmt1.finalize()

            let stmt2 = _this.db.prepare(`INSERT INTO rates(source, dest, rate, expBlock, balance) VALUES (?,?,?,?,?)`)
            stmt2.run(constants.ETH.symbol, token, 0, 0);
            stmt2.finalize()
          })
        }
      })
    }

  }

  initArraySupportedTokenAddress(){
    var stringAddress = ''
    if(BLOCKCHAIN_INFO.tokens){
      stringAddress = Object.keys(BLOCKCHAIN_INFO.tokens).map((tokenName) => {
        return '\'' + BLOCKCHAIN_INFO.tokens[tokenName].address + '\''
      }).toString()
    }
    this.suportedTokenStr = '(' + stringAddress + ')'
  }

  getCurrentBlock() {
    var sql = `SELECT currentBlock FROM configure WHERE id  = ?`;
    return new Promise((resolve, reject) => {
      this.db.get(sql, [1], (err, row) => {
        if (err) {
          console.log(err)
          reject(err.message)
        } else {
          resolve(row.currentBlock)
        }
      })
    })
  }

  getRangeBlock() {
    var sql = `SELECT rangeFetch FROM configure WHERE id  = ?`;
    return new Promise((resolve, reject) => {
      this.db.get(sql, [1], (err, row) => {
        if (err) {
          console.log(err)
          reject(err.message)
        } else {
          resolve(row.rangeFetch)
        }
      })
    })
  }

  getFrequency() {
    var sql = `SELECT frequency FROM configure WHERE id  = ?`;
    return new Promise((resolve, reject) => {
      this.db.get(sql, [1], (err, row) => {
        if (err) {
          console.log(err)
          reject(err.message)
        } else {
          resolve(row.frequency)
        }
      })
    })
  }

  getCount() {
    var sql = `SELECT count FROM configure WHERE id  = ?`;
    return new Promise((resolve, reject) => {
      this.db.get(sql, [1], (err, row) => {
        if (err) {
          console.log(err)
          reject(err.message)
        } else {
          resolve(row.count)
        }
      })
    })
  }

  getHighestBlock() {
    var sql = `SELECT blockNumber FROM logs ORDER BY blockNumber DESC LIMIT 1`;
    return new Promise((resolve, reject) => {
      this.db.get(sql, [], (err, row) => {
        if (err) {
          console.log(err)
          reject(err.message)
        } else {
          if (row) {
            //console.log(`highest block: ${row.blockNumber}`)
            resolve(row.blockNumber)
          } else {
            resolve(0)
          }

        }
      })
    })
  }

  updateCount(count) {
    return new Promise((resolve, reject) => {
      var sql = `UPDATE configure SET count = ? WHERE id = ?`
      this.db.run(sql, [count, 1], function (err) {
        if (err) {
          console.log(err)
          reject(err.message)
        } else {
          resolve(count)
          console.log(`Count updated: ${count}`)
        }
      })
    })
  }

  updateBlock(block) {
    return new Promise((resolve, reject) => {
      var sql = `UPDATE configure SET currentBlock = ? WHERE id = ?`
      this.db.run(sql, [block, 1], function (err) {
        if (err) {
          console.log(err)
          reject(err.message)
        } else {
          resolve(block)
          console.log(`block updated: ${block}`)
        }
      })
    })
  }

  savedEvent(event) {
    //console.log(event)
    return new Promise((resolve, reject) => {
      var stmt = this.db.prepare("INSERT INTO logs(actualDestAmount, actualSrcAmount, dest, source, sender, blockNumber, txHash, status, timestamp) VALUES (?,?,?,?,?,?,?,?,?)")
      stmt.run(event.actualDestAmount, event.actualSrcAmount, event.dest, event.source, event.sender, event.blockNumber, event.txHash, event.status, event.timestamp);
      stmt.finalize()

      resolve(event)
      console.log("Event is inserted");
    })
  }

  // getEvents(page, itemPerPage) {
  //   //get last id 
  //   var _this = this
  //   return new Promise((resolve, reject) => {
  //     var sql = "SELECT id FROM logs ORDER BY id DESC LIMIT 1"
  //     this.db.get(sql, [], function (err, maxId) {
  //       if (err) {
  //         console.log(err)
  //         reject(err.message)
  //       } else {
  //         if (maxId) {
  //           var toID = maxId.id - page * itemPerPage > 0 ? maxId.id - page * itemPerPage : 0
  //           var fromId = maxId.id - (page + 1) * itemPerPage > 0 ? maxId.id - (page + 1) * itemPerPage : 0
  //           sql = "SELECT * FROM logs WHERE id >= ? AND id <= ?"
  //           _this.db.all(sql, [fromId, toID], function (err, rows) {
  //             if (err) {
  //               console.log(err)
  //               reject(err.message)
  //             } else {
  //               resolve(rows.reverse())
  //             }
  //           })
  //         } else {
  //           resolve([])
  //         }

  //       }
  //     })
  //   })
  // }

  getEventsFromEth(page, itemPerPage) {
    return new Promise((resolve, reject) => {
      var sql = "SELECT * FROM logs WHERE source = ? AND dest IN "+this.suportedTokenStr+" ORDER BY blockNumber DESC LIMIT ?"
      this.db.all(sql, ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", itemPerPage], function (err, rows) {
        if (err) {
          console.log(err)
          reject(err.message)
        } else {
          resolve(rows)
        }
      })
    })
  }

  getEventsFromToken(page, itemPerPage) {
    return new Promise((resolve, reject) => {
      var sql = "SELECT * FROM logs WHERE dest = ? AND source IN "+this.suportedTokenStr+" ORDER BY blockNumber DESC LIMIT ?"
      this.db.all(sql, ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", itemPerPage], function (err, rows) {
        if (err) {
          console.log(err)
          reject(err.message)
        } else {
          resolve(rows)
        }
      })
    })
  }

  getEvents(page, itemPerPage){
    return new Promise((resolve, reject) => {
      var sql = "SELECT * FROM logs WHERE dest IN "+this.suportedTokenStr+" AND source IN " + this.suportedTokenStr + " ORDER BY blockNumber DESC LIMIT ?"
      this.db.all(sql, [itemPerPage], function (err, rows) {
        if (err) {
          console.log(err)
          reject(err.message)
        } else {
          resolve(rows)
        }
      })
    })
  }

  countEvents() {
    var sql = `SELECT Count(*) as count FROM logs`;
    return new Promise((resolve, reject) => {
      this.db.get(sql, [], (err, row) => {
        if (err) {
          console.log(err)
          reject(err.message)
        } else {
          resolve(row.count)
        }
      })
    })
  }

  saveLatestBlock(blockNumber) {
    var sql = `SELECT latestBlock FROM configure where id=?`;
    var _this = this
    return new Promise((resolve, reject) => {
      this.db.get(sql, [1], (err, row) => {
        if (err) {
          console.log(err)
          reject(err.message)
        } else {
          var latestBlock = row.latestBlock
          if (blockNumber <= latestBlock) {
            //reject("Blocknumber is smaller than latestBLOCK")
          } else {
            sql = `UPDATE configure SET latestBlock = ? WHERE id = ?`
            _this.db.run(sql, [blockNumber, 1], function (err) {
              if (err) {
                console.log(err)
                reject(err.message)
              } else {
                resolve(blockNumber)
                console.log(`latestBlock updated: ${blockNumber}`)
              }
            })
          }

        }
      })
    })
  }

  getLatestBlock() {
    var sql = `SELECT latestBlock FROM configure WHERE id  = ?`;
    return new Promise((resolve, reject) => {
      this.db.get(sql, [1], (err, row) => {
        if (err) {
          console.log(err)
          reject(err.message)
        } else {
          resolve(row.latestBlock)
        }
      })
    })
  }

  checkEventByHash(txHash, blockNumber) {
    var sql = `SELECT Count(*) AS count FROM logs WHERE txHash  = ? AND blockNumber = ?`;
    return new Promise((resolve, reject) => {
      this.db.get(sql, [txHash, blockNumber], (err, row) => {
        if (err) {
          console.log(err)
          reject(err.message)
        } else {
          //console.log("-------------count---------------")
          //console.log(row)
          if (row.count > 0) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
      })
    })
  }

  saveRate(rates) {
    return new Promise((resolve, reject) => {
      rates.forEach((rate) => {
        if ((rate[2] && rate[2].rate !== '0') || (rate[0] == constants.ETH.symbol && rate[1] == constants.ETH.symbol)) {
          let stmt = this.db.prepare(`INSERT OR REPLACE INTO rates(id, source, dest, rate, expBlock, balance) VALUES ((
          SELECT id FROM rates WHERE source = ? AND dest = ?
        ),?,?,?,?,?)`)
          stmt.run(rate[0], rate[1], rate[0], rate[1], rate[2].rate, rate[2].expBlock, rate[2].balance);
          stmt.finalize()
        }
        if ((rate[3] && rate[3].rate !== '0') || (rate[0] == constants.ETH.symbol && rate[1] == constants.ETH.symbol)) {
          let stmt2 = this.db.prepare(`INSERT OR REPLACE INTO rates(id, source, dest, rate, expBlock, balance) VALUES ((
          SELECT id FROM rates WHERE source = ? AND dest = ?
        ), ?,?,?,?,?)`)
          stmt2.run(rate[1], rate[0], rate[1], rate[0], rate[3].rate, rate[3].expBlock, rate[3].balance);
          stmt2.finalize()
        }
      })
      resolve(rates)
      console.log("all rate is inserted");
    })
  }

  getRate() {
    var sql = `SELECT * FROM rates`;
    return new Promise((resolve, reject) => {
      this.db.all(sql, [], (err, row) => {
        if (err) {
          console.log(err)
          reject(err.message)
        } else {
          resolve(row)
        }
      })
    })
  }

}


module.exports = SqlitePersist