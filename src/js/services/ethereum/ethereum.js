import React from 'react';
import { updateAllRate, checkConnection, setGasPrice, checkUserEligible } from "../../actions/globalActions"
import { updateAccount, updateTokenBalance } from "../../actions/accountActions"
import * as marketActions from "../../actions/marketActions"
import BLOCKCHAIN_INFO from "../../../../env"
import { store } from "../../store"
import * as providers from "./nodeProviders"

export default class EthereumService extends React.Component {
  constructor(props) {
    super(props)

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

  getNumProvider() {
    return this.listProviders.length
  }

  subscribe(callBack) {
    this.fetchGasPrice();
    this.checkUserEligible();

    var callBack_10s = this.fetchData_10s.bind(this)
    callBack_10s()
    this.interval_10s = setInterval(callBack_10s, 10000)
  }

  clearSubscription() {
    clearInterval(this.interval_10s)
  }

  fetchData_10s() {
    this.fetchAccountData()
    this.fetchTokenBalance()
    this.checkConnection()
    this.fetchRateData()
    this.fetchMarketData()
  }

  fetchMarketData () {
    store.dispatch(marketActions.fetchMarketData())
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

  fetchAccountData = () => {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    var account = state.account.account
    if (account.address) {
      store.dispatch(updateAccount(ethereum, account))
    }
  }

  fetchGasPrice = () => {
    store.dispatch(setGasPrice())
  }

  checkUserEligible = () => {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    var account = state.account.account
    if (account.address) {
      store.dispatch(checkUserEligible(ethereum))
    }
  }

  checkConnection = () => {
    var state = store.getState()
    var checker = state.global.conn_checker
    var ethereum = state.connection.ethereum
    store.dispatch(checkConnection(ethereum, checker.count, checker.maxCount, checker.isCheck))
  }

  promiseOneNode(list, index, fn, callBackSuccess, callBackFail, ...args) {
    if (!list[index]) {
      callBackFail(new Error("Cannot resolve result: " + fn))
      return
    }
    if (!list[index][fn]) {
      this.promiseOneNode(list, ++index, fn, callBackSuccess, callBackFail, ...args)
      return
    }
    list[index][fn](...args).then(result => {
      callBackSuccess(result)
    }).catch(err => {
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
    })
  }
}
