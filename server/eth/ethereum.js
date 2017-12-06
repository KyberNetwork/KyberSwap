
//import React from 'react';
var HttpEthereumProvider = require("./httpProvider")
//import WebsocketEthereumProvider from "./wsProvider"
var constants = require("../../src/js/services/constants")

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
    this.httpUrl = BLOCKCHAIN_INFO.connections.http
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
    //this.currentProvider.clearSubcription()
    this.currentProvider.subcribeNewBlock(() => {
      this.fetchData.bind(this)()
      this.fetchAllRateData.bind(this)()
    })
  }

  clearSubcription() {
    this.currentProvider.clearSubcription()
  }

  async fetchData() {
    // //get currentBlock
    // this.fetchLogExchange()

    // // get current rate
    // this.fetchRate()
    var currentBlock = await this.persistor.getCurrentBlock()
    var rangeBlock = await this.persistor.getRangeBlock()
    var count = await this.persistor.getCount()
    var frequency = await this.persistor.getFrequency()
    var latestBlock = await this.currentProvider.getLatestBlock()
    await this.persistor.saveLatestBlock(latestBlock)
    if (count > frequency){
      await this.persistor.updateCount(0)
      var blockUpdated = currentBlock + rangeBlock > latestBlock ?latestBlock: currentBlock + rangeBlock 
      await this.persistor.updateBlock(blockUpdated)
    }else{
      this.persistor.updateCount(++count)
      var toBlock = currentBlock + rangeBlock
      if (toBlock > latestBlock){
        toBlock = latestBlock
      }
      var events  = await this.currentProvider.getLogExchange(currentBlock, toBlock)
      this.handleEvent(events)
    }
  }

  async fetchAllRateData(){
    var allRate = await this.currentProvider.getAllRate(BLOCKCHAIN_INFO.tokens, constants.RESERVES[0])
    this.persistor.saveRate(allRate)
  }


  async handleEvent(logs) {
    var arrayAddressToken = Object.keys(BLOCKCHAIN_INFO.tokens).map((tokenName) => {return BLOCKCHAIN_INFO.tokens[tokenName].address})
    for (var i = 0; i < logs.length; i++) {
      var dest = logs[i].returnValues.dest.toLowerCase()
      var source = logs[i].returnValues.source.toLowerCase()
      /// unsave for not support token
      if(arrayAddressToken.indexOf(dest) < 0 || arrayAddressToken.indexOf(source) < 0) continue
      var savedEvent = {
        actualDestAmount: logs[i].returnValues.actualDestAmount,
        actualSrcAmount: logs[i].returnValues.actualSrcAmount,
        dest: dest,
        source: source,
        sender: logs[i].returnValues.sender.toLowerCase(),
        blockNumber: logs[i].blockNumber,
        txHash: logs[i].transactionHash,
        status: logs[i].type
      }
      var check = await this.persistor.checkEventByHash(savedEvent.txHash, savedEvent.blockNumber)
      console.log(check)
      if(!check){
        await this.persistor.savedEvent(savedEvent)
      }
    }
  }
  

  call(fn) {
    return this.currentProvider[fn].bind(this.currentProvider)
  }
}

module.exports = EthereumService