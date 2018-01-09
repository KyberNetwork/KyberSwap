
import React from 'react';
import HttpEthereumProvider from "./httpProvider"
import WebsocketEthereumProvider from "./wsProvider"
import constants from "../constants"

import { updateBlock, updateBlockFailed, updateRate, updateAllRate, updateAllRateUSD, 
        updateHistoryExchange, checkConnection, setGasPrice, setMaxGasPrice } from "../../actions/globalActions"
import { updateAccount, updateTokenBalance } from "../../actions/accountActions"
import { updateTx } from "../../actions/txActions"
import { updateRateExchange, estimateGas } from "../../actions/exchangeActions"
import BLOCKCHAIN_INFO from "../../../../env"
import { store } from "../../store"
import { setConnection } from "../../actions/connectionActions"
import {stringToHex} from "../../utils/converter"

export default class EthereumService extends React.Component {
  constructor(props) {
    super(props)

    var httpArr = BLOCKCHAIN_INFO.connections.http
    var randomNum = Math.floor((Math.random() * httpArr.length))
    this.httpUrl = httpArr[randomNum]
    // this.httpUrl = BLOCKCHAIN_INFO.connections.http
    this.wsUrl = BLOCKCHAIN_INFO.connections.ws
    // this.wsUrl = "ws://localhost:8546"
    this.httpProvider = this.getHttpProvider()
    this.wsProvider = this.getWebsocketProvider()

    this.initProvider(props.default)
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

  getWebsocketProvider() {
    return new WebsocketEthereumProvider({
      url: this.wsUrl, failEvent: () => {
        var state = store.getState()
        var ethereum = state.connection.ethereum
        if (ethereum.wsProvider.connection) {
          ethereum.wsProvider.connection = false
          //ethereum.wsProvider.reconnectTime = 0
          store.dispatch(setConnection(ethereum))
        }
      }
    })
  }

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
    //get gas price
    //this.fetchGasPrice()
    this.currentProvider.subcribeNewBlock(this.fetchData.bind(this))
  }

  clearSubcription() {
    this.currentProvider.clearSubcription()
  }

  fetchData() {
    this.fetchTxsData()

    this.fetchRateData()
    this.fetchRateUSD()

    this.fetchAccountData()
    this.fetchTokenBalance()

    this.fetchRateExchange()
    this.fetchHistoryExchange()
    this.checkConnection()

    this.fetchGasprice()
   // this.fetchGasExchange()
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
    if(sourceTokenSymbol === 'ETH' && destTokenSymbol !=='ETH'){
      rateInit = tokens[destTokenSymbol].minRateEth
    }
    if(sourceTokenSymbol !== 'ETH' && destTokenSymbol ==='ETH'){
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
    var ethereum = state.connection.ethereum
    var exchange = state.exchange
    var tokens = state.tokens.tokens

    var sourceDecimal = 18
    var sourceTokenSymbol = exchange.sourceTokenSymbol
    if (tokens[sourceTokenSymbol]) {
      sourceDecimal = tokens[sourceTokenSymbol].decimal
    }

    var kyber_address = BLOCKCHAIN_INFO.network
    var destAddress = account.address
    store.dispatch(estimateGas(ethereum, {...state.exchange, sourceDecimal, kyber_address, destAddress}))
  }

  checkConnection = () => {
    var state = store.getState()
    var checker = state.global.conn_checker
    var ethereum = state.connection.ethereum
    store.dispatch(checkConnection(ethereum, checker.count, checker.maxCount, checker.isCheck))
  }

  call(fn) {
    return this.currentProvider[fn].bind(this.currentProvider)
  }
}