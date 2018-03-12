
import React from 'react';
// import HttpEthereumProvider from "./httpProvider"
// import WebsocketEthereumProvider from "./wsProvider"
import constants from "../constants"

import {
  updateBlock, updateBlockFailed, updateRate, updateAllRate, updateAllRateUSD,
  updateHistoryExchange, checkConnection, setGasPrice, setMaxGasPrice
} from "../../actions/globalActions"
import { updateAccount, updateTokenBalance } from "../../actions/accountActions"
import { updateTx, updateApproveTxsData } from "../../actions/txActions"
import { updateRateExchange, estimateGas, analyzeError, checkKyberEnable, verifyExchange, caculateAmount, fetchExchangeEnable } from "../../actions/exchangeActions"
import { estimateGasTransfer, verifyTransfer } from "../../actions/transferActions"
import BLOCKCHAIN_INFO from "../../../../env"
import { store } from "../../store"
import { setConnection } from "../../actions/connectionActions"
import { stringToHex } from "../../utils/converter"

import * as providers from "./nodeProviders"

export default class EthereumService extends React.Component {
  constructor(props) {
    super(props)

    // this.listProviders = BLOCKCHAIN_INFO.connections.http.filter(node => {
    //   console.log
    //   switch (node.type) {
    //     case "cached":
    //       return new providers.CachedServerProvider({ url: node.endPoint })
    //       break
    //     case "prune":
    //       return new providers.PruneProvider({ url: node.endPoint })
    //       break
    //     case "none_prune":
    //       return new providers.NonePruneProvider({ url: node.endPoint })
    //       break
    //   }
    // })
    this.listProviders = []
    for (var node of BLOCKCHAIN_INFO.connections.http) {
      switch (node.type) {
        case "cached":
          var provider = new providers.CachedServerProvider({ url: node.endPoint })
          this.listProviders.push(provider)
          break
        case "prune":
          var provider = new providers.PruneProvider({ url: node.endPoint })
          this.listProviders.push(provider)
          break
        case "none_prune":
          var provider = new providers.NonePruneProvider({ url: node.endPoint })
          this.listProviders.push(provider)
          break
      }
    }
  }

  subcribe(callBack) {
    var callBackAsync = this.fetchData.bind(this)
    callBackAsync()
    this.intervalAsyncID = setInterval(callBackAsync, 10000)

    var callBackSync = this.fetchDataSync.bind(this)
    callBackSync()
    this.intervalSyncID = setInterval(callBackSync, 3000)
  }

  clearSubcription() {
    clearInterval(this.intervalID)
    clearInterval(this.intervalSyncID)
  }


  //var httpArr = BLOCKCHAIN_INFO.connections.http


  // var randomNum = Math.floor((Math.random() * httpArr.length))
  // this.httpUrl = httpArr[randomNum]
  // this.wsUrl = BLOCKCHAIN_INFO.connections.ws
  // this.httpProvider = this.getHttpProvider()
  // this.wsProvider = false

  //this.initProvider(props.default)

  // initProvider(provider) {
  //   switch (provider) {
  //     case "http":
  //       this.currentProvider = this.httpProvider
  //       this.currentLabel = "http"
  //       break
  //     case "ws":
  //       this.currentProvider = this.wsProvider
  //       this.currentLabel = "ws"
  //       break
  //     default:
  //       this.currentProvider = this.httpProvider
  //       this.currentLabel = "http"
  //       break
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

  // getHttpProvider() {
  //   return new HttpEthereumProvider({ url: this.httpUrl })
  // }

  // getProvider() {
  //   return this.currentProvider
  // }

  // setProvider(provider) {
  //   this.currentProvider = provider
  // }

  // subcribe() {
  //   //this.currentProvider.clearSubcription()
  //   //get gas price
  //   //this.fetchGasPrice()
  //   this.currentProvider.subcribeNewBlock(this.fetchData.bind(this))
  // }

  // clearSubcription() {
  //   this.currentProvider.clearSubcription()
  // }

  fetchData() {
    this.checkKyberEnable()

     this.fetchTxsData()
     this.fetchApproveTxsData()

    this.fetchRateData()
    this.fetchRateUSD()

    this.fetchAccountData()
    this.fetchTokenBalance()

    this.fetchRateExchange()

    this.fetchHistoryExchange()

    this.checkConnection()

    this.fetchGasprice()

    this.fetchExchangeEnable()
    //this.verifyExchange()
    //this.verifyTransfer()

    this.fetchGasExchange()
    this.fetchGasTransfer()

   //this.testAnalize()
  }

  fetchDataSync() {
    var state = store.getState()
    var account = state.account
    if (account.isGetAllBalance){
      this.verifyExchange()
      this.verifyTransfer()
    }
  }

  testAnalize() {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    store.dispatch(analyzeError(ethereum, "0x9219e71f9172549595e42ce6d8cc2d3c7ac052236f461b0005128f25d331bec1"))
  }

  fetchRateData() {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    // for (var k = 0; k < constants.RESERVES.length; k++) {
    //   var reserve = constants.RESERVES[k]
    //   store.dispatch(updateAllRate(ethereum, BLOCKCHAIN_INFO.tokens, reserve))
    // }
    store.dispatch(updateAllRate(ethereum, BLOCKCHAIN_INFO.tokens))
  }

  fetchTokenBalance() {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    var account = state.account.account
    if (account.address) {
      store.dispatch(updateTokenBalance(ethereum, account.address, BLOCKCHAIN_INFO.tokens))
    }
  }

  fetchRateUSD() {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    store.dispatch(updateAllRateUSD(ethereum, BLOCKCHAIN_INFO.tokens))
  }

  fetchTxsData = () => {
    var state = store.getState()
    var tx
    var txs = state.txs
    var ethereum = state.connection.ethereum

    var account = state.account.account
    var listToken = {}
    Object.keys(txs).forEach((hash) => {
      tx = txs[hash]
      if (tx.status == "pending") {
        if (tx.type === "exchange") {
          var exchange = state.exchange
          listToken = {
            source: {
              symbol: exchange.sourceTokenSymbol,
              address: exchange.sourceToken
            },
            dest: {
              symbol: exchange.destTokenSymbol,
              address: exchange.destToken
            }
          }
          store.dispatch(updateTx(ethereum, tx, account, listToken))
        } else {
          var transfer = state.transfer
          listToken = {
            token: {
              symbol: transfer.tokenSymbol,
              address: transfer.token
            }
          }
          store.dispatch(updateTx(ethereum, tx, account, listToken))
        }

      }
    })
  }


  fetchApproveTxsData = () =>{
    store.dispatch(updateApproveTxsData())
  }

  fetchAccountData = () => {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    var account = state.account.account
    if (account.address) {
      store.dispatch(updateAccount(ethereum, account))
    }
  }

  fetchCurrentBlock = () => {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    store.dispatch(updateBlock(ethereum))
  }

  fetchRateExchange = () => {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    var source = state.exchange.sourceToken
    var dest = state.exchange.destToken
    var sourceAmount = state.exchange.sourceAmount

    var tokens = state.tokens.tokens
    var sourceDecimal = 18
    var sourceTokenSymbol = state.exchange.sourceTokenSymbol
    if (tokens[sourceTokenSymbol]) {
      sourceDecimal = tokens[sourceTokenSymbol].decimal
    }

    var sourceAmountHex = stringToHex(sourceAmount, sourceDecimal)

    var destTokenSymbol = state.exchange.destTokenSymbol
    var rateInit = 0
    if (sourceTokenSymbol === 'ETH' && destTokenSymbol !== 'ETH') {
      rateInit = tokens[destTokenSymbol].minRateEth
    }
    if (sourceTokenSymbol !== 'ETH' && destTokenSymbol === 'ETH') {
      rateInit = tokens[sourceTokenSymbol].minRate
    }

    store.dispatch(updateRateExchange(ethereum, source, dest, sourceAmountHex, false, rateInit))
  }

  fetchHistoryExchange = () => {
    var state = store.getState()
    var history = state.global.history
    var ethereum = state.connection.ethereum
    store.dispatch(updateBlock(ethereum))
    //if (history.page,){      
    store.dispatch(updateHistoryExchange(ethereum, history.page, history.itemPerPage, true))
    //}
  }

  fetchGasprice = () => {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    store.dispatch(setGasPrice(ethereum))
  }

  // fetchMaxGasPrice = () => {
  //   var state = store.getState()
  //   var ethereum = state.connection.ethereum

  //   console.log("++++++++++++++++++++++")
  //   console.log(ethereum)
  //   store.dispatch(setMaxGasPrice(ethereum))
  // }

  fetchGasExchange = () => {
    var state = store.getState()
    var account = state.account.account
    if (!account.address) {
      return
    }
    var pathname = state.router.location.pathname
    if (pathname !== "/exchange") {
      return
    }
    store.dispatch(estimateGas())
  }

  fetchGasTransfer = () => {
    var state = store.getState()
    var account = state.account.account
    if (!account.address) {
      return
    }

    var pathname = state.router.location.pathname
    if (pathname !== "/transfer") {
      return
    }
    store.dispatch(estimateGasTransfer())
  }

  verifyExchange = () => {
    var state = store.getState()
    var account = state.account.account
    if (!account.address) {
      return
    }

    var pathname = state.router.location.pathname
    if (pathname !== "/exchange") {
      return
    }
    store.dispatch(verifyExchange())
    store.dispatch(caculateAmount())
  }

  verifyTransfer = () => {
    var state = store.getState()
    var account = state.account.account
    if (!account.address) {
      return
    }

    var pathname = state.router.location.pathname
    if (pathname !== "/transfer") {
      return
    }
    store.dispatch(verifyTransfer())
  }

  checkConnection = () => {
    var state = store.getState()
    var checker = state.global.conn_checker
    var ethereum = state.connection.ethereum
    store.dispatch(checkConnection(ethereum, checker.count, checker.maxCount, checker.isCheck))
  }

  checkKyberEnable = () => {
    store.dispatch(checkKyberEnable())
  }

  fetchExchangeEnable = () => {
    var state = store.getState()
    var account = state.account.account
    if (!account.address) {
      return
    }

    var pathname = state.router.location.pathname
    if (pathname !== "/exchange") {
      return
    }
    store.dispatch(fetchExchangeEnable())
  }

  promiseOneNode(list, index, fn, callBackSuccess, callBackFail, ...args) {
    if (!list[index]) {
      callBackFail(new Error("Cannot resolve result: " + fn))
      return
    }
    if (!list[index][fn]) {
      console.log("Not have " + fn + " in " + list[index].rpcUrl)
      this.promiseOneNode(list, ++index, fn, callBackSuccess, callBackFail, ...args)
      return
    }
    list[index][fn](...args).then(result => {
      console.log("Resolve " + fn + "successful in " + list[index].rpcUrl)
      callBackSuccess(result)
    }).catch(err => {
      console.log(err.message + " -In provider: " + list[index].rpcUrl)
      this.promiseOneNode(list, ++index, fn, callBackSuccess, callBackFail, ...args)
    })
  }

  call(fn, ...args) {
    return new Promise((resolve, reject) => {
      this.promiseOneNode(this.listProviders, 0, fn, resolve, reject, ...args)
    })
  }


  promiseMultiNode(list, index, fn, callBackSuccess, callBackFail, results, errors, ...args) {
    if (!list[index]) {
      if(results.length > 0){
       // callBackSuccess(results[0])
       console.log("resolve "+fn+" successfully in some nodes")
      }else{
        callBackFail(errors)
      }      
      return
    }
    if (!list[index][fn]) {
      console.log(list[index].rpcUrl +  " not support func: " + fn)
      errors.push(new Error(list[index].rpcUrl +  " not support func: " + fn))
      this.promiseMultiNode(list, ++index, fn, callBackSuccess, callBackFail, results, errors, ...args)
      return
    }
    list[index][fn](...args).then(result => {      
      console.log("Call " + fn + " successfully in " + list[index].rpcUrl)
      results.push(result)
      this.promiseMultiNode(list, ++index, fn, callBackSuccess, callBackFail, results, errors, ...args)
      callBackSuccess(result)
    }).catch(err => {
      console.log(err.message + " -In provider: " + list[index].rpcUrl)
      errors.push(err)
      this.promiseMultiNode(list, ++index, fn, callBackSuccess, callBackFail, results, errors, ...args)
    })
  }

  callMultiNode(fn, ...args) {
    var errors = []
    var results = []
    return new Promise((resolve, reject) => {
      this.promiseMultiNode(this.listProviders, 0, fn, resolve, reject, results, errors, ...args)
    })
  }

}