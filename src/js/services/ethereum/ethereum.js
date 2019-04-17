
import React from 'react';
// import HttpEthereumProvider from "./httpProvider"
// import WebsocketEthereumProvider from "./wsProvider"
import constants from "../constants"

import {
  updateBlock, updateBlockFailed, updateRate, updateAllRate, updateAllRateUSD,
  checkConnection, setGasPrice, setMaxGasPrice
} from "../../actions/globalActions"
import { updateAccount, updateTokenBalance } from "../../actions/accountActions"
import { updateTx, updateApproveTxsData } from "../../actions/txActions"
import { updateRateExchange, estimateGasNormal, analyzeError, checkKyberEnable, verifyExchange, caculateAmount, fetchExchangeEnable, throwErrorHandleAmount } from "../../actions/exchangeActions"
import { estimateGasTransfer, verifyTransfer } from "../../actions/transferActions"

import * as marketActions from "../../actions/marketActions"

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

  getNumProvider(){
    return this.listProviders.length
  }

  subcribe(callBack) {
    this.fetchGasprice() // fetch gas price when app load

    // callback 10s
    var callBack_10s = this.fetchData_10s.bind(this)
    callBack_10s()
    this.interval_10s = setInterval(callBack_10s, 10000)

    var callBack_5s = this.fetchData_5s.bind(this)
    callBack_5s()
    this.interval_5s = setInterval(callBack_5s, 3000)

    var callBack_3s = this.fetchData_3s.bind(this)
    callBack_3s()
    this.interval_3s = setInterval(callBack_3s, 3000)

    var callBack_5min = this.fetchData_5Min.bind(this)
    callBack_5min()
    var interval_5min = setInterval(callBack_5min, 300000)
  }

  clearSubcription() {
    clearInterval(this.intervalID)
    clearInterval(this.intervalSyncID)
  }

  fetchData_10s() {
    this.checkKyberEnable()

    this.fetchTxsData()
    this.fetchApproveTxsData()    

    this.fetchAccountData()
    this.fetchTokenBalance()

    this.fetchRateExchange()

    //this.fetchHistoryExchange()

    this.checkConnection()


    this.fetchMaxGasPrice()
    // this.fetchGasprice()
    

    this.fetchExchangeEnable()
    // this.verifyExchange()
    // this.verifyTransfer()

    this.fetchGasExchange()
    this.fetchGasTransfer()

    //this.fetMarketData()

    this.fetGeneralInfoTokens()

    //  this.testAnalize()
  // this.testEstimateGas()
  }

  fetchData_5s(){
    this.fetchRateData()
  }


  fetchData_3s() {
    var state = store.getState()
    var account = state.account
    // console.log("verify account")
    // console.log(account)
    if (account.isGetAllBalance){
      this.verifyExchange()
      this.verifyTransfer()
    }
  }

  fetchData_5Min(){
    this.fetchVolumn()
    this.fetchRateUSD()
  }

  testAnalize() {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    store.dispatch(analyzeError(ethereum, "0x01eb9edc466055563ffea0a07edd770bc0407d78e4271ec6b6d54396dc4a8e82"))
  }

  // testEstimateGas() {
  //   this.call("estimateGasContract")
  // }
  
  fetchVolumn () {
    store.dispatch(marketActions.getVolumn())
  }
  
  fetchRateData() {
    var state = store.getState()
    var ethereum = state.connection.ethereum  
    var tokens = state.tokens.tokens
    store.dispatch(updateAllRate(ethereum, tokens))
  }

  fetchTokenBalance() {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    var account = state.account.account
    var tokens = state.tokens.tokens
    if (account.address) {
      store.dispatch(updateTokenBalance(ethereum, account.address, tokens))
    }
  }

  fetchRateUSD() {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    store.dispatch(updateAllRateUSD(ethereum))
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

  fetchRateExchange = (isManual = false) => {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    var source = state.exchange.sourceToken
    var dest = state.exchange.destToken
    
    var sourceAmount = state.exchange.sourceAmount
    var sourceTokenSymbol = state.exchange.sourceTokenSymbol    
    
    if (sourceTokenSymbol === "ETH") {
      if (parseFloat(sourceAmount) > constants.ETH.maxAmount) {
        store.dispatch(throwErrorHandleAmount());
        return;
      }
    } else {
      const tokens = state.tokens.tokens;
      const sourceAmountInEth = sourceAmount * tokens[sourceTokenSymbol].rate / Math.pow(10, 18);
      if (parseFloat(sourceAmountInEth) > constants.ETH.maxAmount) {
        store.dispatch(throwErrorHandleAmount());
        return;
      }
    }

    //check input focus
    if (state.exchange.inputFocus !== "source"){
      //calculate source amount by dest amount
      var destAmount = state.exchange.destAmount
      var destTokenSymbol = state.exchange.destTokenSymbol    
      // relative source amount 
      var tokens = state.tokens.tokens
      var rateSourceEth = sourceTokenSymbol === "ETH" ? 1: tokens[sourceTokenSymbol].rate / Math.pow(10,18)
      var rateEthDest = destTokenSymbol === "ETH" ? 1: tokens[destTokenSymbol].rateEth / Math.pow(10,18)
      
      if (rateSourceEth != 0 && rateEthDest != 0){
        sourceAmount = destAmount / (rateSourceEth * rateEthDest)
      }else{
        sourceAmount = 0
      }
    }    
    

    store.dispatch(updateRateExchange(ethereum, source, dest, sourceAmount, sourceTokenSymbol, isManual))
  }

  // fetchHistoryExchange = () => {
  //   var state = store.getState()
  //   var history = state.global.history
  //   var ethereum = state.connection.ethereum
  //   store.dispatch(updateBlock(ethereum))
  //   store.dispatch(updateHistoryExchange(ethereum, history.page, history.itemPerPage, true))
  // }

  fetchGasprice = () => {
    store.dispatch(setGasPrice())
  }

  fetchMaxGasPrice = () => {
    var state = store.getState()
    store.dispatch(setMaxGasPrice())
  }

  fetchGasExchange = () => {
    var state = store.getState()
    var account = state.account.account
    if (!account.address) {
      return
    }
    var pathname = state.router.location.pathname
    console.log(pathname)
    if (!pathname.includes(constants.BASE_HOST + "/swap")) {
      return
    }
    store.dispatch(estimateGasNormal())
  }

  fetchGasTransfer = () => {
    var state = store.getState()
    var account = state.account.account
    if (!account.address) {
      return
    }

    var pathname = state.router.location.pathname
    if (!pathname.includes(constants.BASE_HOST + "/transfer")) {
      return
    }
    store.dispatch(estimateGasTransfer())
  }

  fetMarketData = () => {
    store.dispatch(marketActions.getMarketData())
  }

  fetGeneralInfoTokens() {
    store.dispatch(marketActions.getGeneralInfoTokens())
  }

  verifyExchange = () => {
    var state = store.getState()
    var account = state.account.account
    if (!account.address) {
      return
    }

    var pathname = state.router.location.pathname
    if (!pathname.includes(constants.BASE_HOST + "/swap")) {
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
    if (!pathname.includes(constants.BASE_HOST + "/transfer")) {
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
    if (!pathname.includes(constants.BASE_HOST + "/swap")) {
      return
    }
    store.dispatch(fetchExchangeEnable())
  }

  shuffleArr = (arr) => {
    for (let i = arr.length - 1; i > 1; i--) {
      const j = Math.floor((Math.random() * i) + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  copyArr = (arr) => {
    var newArr = []
    arr.forEach(function(ele){
      newArr.push(ele)
    })
    return newArr
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
    // var cloneArr =  this.copyArr(this.listProviders)
    // var shuffleArr = this.shuffleArr(cloneArr)
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
      this.listProviders.map(val => {
        if (!val[fn]) {
          errors.push({
            code: 0,
            msg: "Provider not support this API"
          })
          return
        }
        val[fn](...args).then(result => {
          resolve(result)
        }).catch(err => {
          console.log(err)
          errors.push({
            code: 1,
            msg: err
          })          
          if (errors.length === this.listProviders.length){
            //find error with code 1
            for (var i = 0; i<errors.length; i++){
              if (errors[i].code === 1){
                reject(errors[i].msg)
              }
            }
          }
        })
      })
      //this.promiseMultiNode(this.listProviders, 0, fn, resolve, reject, results, errors, ...args)
    })
  }

}
