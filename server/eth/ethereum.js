
//import React from 'react';
var HttpEthereumProvider = require("./httpProvider")
//import WebsocketEthereumProvider from "./wsProvider"
var constants = require("../../src/js/services/constants")

//var converters = require("../../src/js/utils/converter")
//import { updateBlock, updateBlockFailed, updateRate, updateAllRate, updateHistoryExchange } from "../../actions/globalActions"
//import { updateAccount } from "../../actions/accountActions"
//import { updateTx } from "../../actions/txActions"
//import { updateRateExchange } from "../../actions/exchangeActions"
var BLOCKCHAIN_INFO = require("../../env")
//import { store } from "../../store"
//import { setConnection } from "../../actions/connectionActions"
//var co = require('co')



class EthereumService {
  constructor(props) {
    //super(props)
    //get random node
    var httpArr = BLOCKCHAIN_INFO.connections.http
    var randomNum = Math.floor((Math.random() * httpArr.length))
    this.httpUrl = httpArr[randomNum]

    this.wsUrl = BLOCKCHAIN_INFO.connections.ws
    // this.wsUrl = "ws://localhost:8546"
    this.httpProvider = this.getHttpProvider()
    //this.wsProvider = this.getWebsocketProvider()

    //for metamask/mist
    this.callbackLogs = props.callbackLogs

    this.initProvider(props.default)
    this.fromBlock = 0
    this.range = 0
    this.persistor = props.persistor

    //console.log(this.currentProvider.deCode())
    //this.initProvider()
  }

  initProvider(provider) {
    switch (provider) {
      case "http":
        this.currentProvider = this.httpProvider
        this.currentLabel = "http"
        break
      case "ws":
        this.currentProvider = this.wsProvider
        this.currentLabel = "ws"
        break
      default:
        this.currentProvider = this.httpProvider
        this.currentLabel = "http"
        break
    }
  }

  // getSubInstance(){
  //   if(typeof web3 !== 'undefined'){
  //     return web3
  //   }else{
  //     return false
  //   }

  // }

  // getWebsocketProvider() {
  //   return new WebsocketEthereumProvider({
  //     url: this.wsUrl, failEvent: () => {
  //       var state = store.getState()
  //       var ethereum = state.connection.ethereum
  //       if (ethereum.wsProvider.connection) {
  //         ethereum.wsProvider.connection = false
  //         //ethereum.wsProvider.reconnectTime = 0
  //         store.dispatch(setConnection(ethereum))
  //       }
  //     }
  //   })
  // }

  getHttpProvider() {
    return new HttpEthereumProvider({ url: this.httpUrl })
  }

  getProvider() {
    return this.currentProvider
  }

  setProvider(provider) {
    this.currentProvider = provider
  }

  subcribe() {
    // this.currentProvider.subcribeNewBlock(() => {
    //   // return Promise.all([
    //   //   this.fetchData.bind(this)(),
    //   //   this.fetchAllRateData.bind(this)(),
    //   //   this.fetchAllRateUSD.bind(this)()
    //   // ])
    //   this.fetchData.bind(this)(),
    //   this.fetchAllRateData.bind(this)(),
    //   this.fetchAllRateUSD.bind(this)()
    // })

    this.currentProvider.subcribeNewBlock(() => {
      this.fetchData.bind(this)()
      this.fetchAllRateData.bind(this)()
      this.fetchAllRateUSD.bind(this)()
      //   return Promise.all([
      //  //   this.fetchData.bind(this)(),
      //     ,
      //     ()
      //   ])
      // this.fetchAllRateData.bind(this)(),
      // this.fetchAllRateUSD.bind(this)()
    })
  }

  clearSubcription() {
    this.currentProvider.clearSubcription()
  }

  async fetchData() {

    var currentBlock = await this.persistor.getCurrentBlock()
    var rangeBlock = await this.persistor.getRangeBlock()
    var count = await this.persistor.getCount()
    var frequency = await this.persistor.getFrequency()
    var latestBlock
    try{
      latestBlock = await this.currentProvider.getLatestBlockFromEtherScan()
    }catch(e){
      latestBlock = await this.currentProvider.getLatestBlockFromNode()
    } 
    //console.log("latest block:" + latestBlock)
    await this.persistor.saveLatestBlock(latestBlock)
    if (count > frequency) {
      await this.persistor.updateCount(0)
      var blockUpdated = currentBlock + rangeBlock > latestBlock ? latestBlock : currentBlock + rangeBlock
      await this.persistor.updateBlock(blockUpdated)
    } else {
      this.persistor.updateCount(++count)
      var toBlock = currentBlock + rangeBlock
      if (toBlock > latestBlock) {
        toBlock = latestBlock
      }
      // console.log("xxx")
      if (toBlock - currentBlock < 2000) {
        currentBlock = toBlock - 2000
      }
     // console.log("get logs")
      try {
        var events = await this.currentProvider.getLogExchange(currentBlock, toBlock)
        //console.log("events etherscan: " + JSON.stringify(events))
        this.handleEvent(events)
        // var events = await this.currentProvider.getLogExchangeFromNode(currentBlock, toBlock)
        // this.handleEventFromNode(events, latestBlock)
      } catch (e) {
       // console.log(e.msg)
        var events = await this.currentProvider.getLogExchangeFromNode(currentBlock, toBlock)
       // console.log("events node: " + events)
        this.handleEventFromNode(events, latestBlock)
      }

    }

    return new Promise((resolve, rejected) => {
      resolve(true)
    })
  }

  async fetchAllRateData() {
    try {
      var allRate = await this.currentProvider.getAllRatesFromEtherscan(BLOCKCHAIN_INFO.tokens, constants.RESERVES[0])
      //console.log(allRate)
      this.persistor.saveRate(allRate)
    } catch (e) {
      console.log(e.message)
      try {
        var allRate = await this.currentProvider.getAllRatesFromBlockchain(BLOCKCHAIN_INFO.tokens, constants.RESERVES[0])
        //   console.log(allRate)
        this.persistor.saveRate(allRate)
      } catch (e) {
        console.log(e.message)
      }
    }

    return new Promise((resolve, rejected) => {
      resolve(true)
    })
  }

  delay(second) {
    return new Promise(resolve => setTimeout(resolve, second))
  }

  async fetchAllRateUSD() {
    var tokens = BLOCKCHAIN_INFO.tokens
    for (let key in tokens) {
      try {
        var rate = await this.currentProvider.getRateUSD(tokens[key].usd_id)
        // console.log(rate)
        await this.delay(5000)
        await this.persistor.saveRateUSD(rate)
      } catch (e) {
        console.log(e.message)
        continue
      }
    }
    return new Promise((resolve, rejected) => {
      resolve(true)
    })
  }


  async handleEvent(logs) {
   // console.log(logs)
    var arrayAddressToken = Object.keys(BLOCKCHAIN_INFO.tokens).map((tokenName) => { return BLOCKCHAIN_INFO.tokens[tokenName].address })
    for (var i = 0; i < logs.length; i++) {
      var savedEvent = this.getEvent(logs[i])

      var dest = savedEvent.dest
      var source = savedEvent.source
      if (arrayAddressToken.indexOf(dest) < 0 || arrayAddressToken.indexOf(source) < 0) continue

      var check = await this.persistor.checkEventByHash(savedEvent.txHash, savedEvent.blockNumber)
      // console.log(check)
      if (!check) {
        await this.persistor.savedEvent(savedEvent)
      }
    }
  }

  async handleEventFromNode(logs, latestBlock) {
    var arrayAddressToken = Object.keys(BLOCKCHAIN_INFO.tokens).map((tokenName) => { return BLOCKCHAIN_INFO.tokens[tokenName].address })
    for (var i = 0; i < logs.length; i++) {
      var savedEvent = this.getEventFromNode(logs[i], latestBlock)

      var dest = savedEvent.dest
      var source = savedEvent.source
      if (arrayAddressToken.indexOf(dest) < 0 || arrayAddressToken.indexOf(source) < 0) continue

      var check = await this.persistor.checkEventByHash(savedEvent.txHash, savedEvent.blockNumber)
      // console.log(check)
      if (!check) {
        await this.persistor.savedEvent(savedEvent)
      }
    }
  }

  getEvent(log) {
    var blockNumber = this.currentProvider.rpc.eth.abi.decodeParameters(['uint256'], log.blockNumber)
    var eventData = this.currentProvider.rpc.eth.abi.decodeParameters(['address', 'address', 'uint256', 'uint256'], log.data)
    var timeStamp = this.currentProvider.rpc.eth.abi.decodeParameters(['uint256'], log.timeStamp)
    return {
      blockNumber: blockNumber['0'],
      actualDestAmount: eventData['3'],
      actualSrcAmount: eventData['2'],
      dest: eventData['1'].toLowerCase(),
      source: eventData['0'].toLowerCase(),
      txHash: log.transactionHash.toLowerCase(),
      timestamp: timeStamp['0'],
      status: "mined"
    }
  }

  getEventFromNode(log, latestBlock) {
    var timeStamp = Date.now() - (latestBlock - log.blockNumber) * BLOCKCHAIN_INFO.averageBlockTime
    timeStamp = Math.round(timeStamp / 1000)
    return {
      blockNumber: log.blockNumber,
      actualDestAmount: log.returnValues.actualDestAmount,
      actualSrcAmount: log.returnValues.actualSrcAmount,
      dest: log.returnValues.dest.toLowerCase(),
      source: log.returnValues.source.toLowerCase(),
      txHash: log.transactionHash.toLowerCase(),
      timestamp: timeStamp,
      status: "mined"
    }
  }

  call(fn) {
    return this.currentProvider[fn].bind(this.currentProvider)
  }
}

module.exports = EthereumService