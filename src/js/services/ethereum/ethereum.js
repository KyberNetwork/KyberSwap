
import React from 'react';
import HttpEthereumProvider from "./httpProvider"
import WebsocketEthereumProvider from "./wsProvider"
import constants from "../constants"

import { updateBlock, updateBlockFailed, updateRate, updateAllRate, updateHistoryExchange } from "../../actions/globalActions"
import { updateAccount } from "../../actions/accountActions"
import { updateTx } from "../../actions/txActions"
import { updateRateExchange } from "../../actions/exchangeActions"
import BLOCKCHAIN_INFO from "../../../../env"
import { store } from "../../store"
import { setConnection } from "../../actions/connectionActions"

export default class EthereumService extends React.Component {
  constructor(props) {
    super(props)
    this.httpUrl = BLOCKCHAIN_INFO.connections.http
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
    this.currentProvider.subcribeNewBlock(this.fetchData.bind(this))
  }

  clearSubcription() {
    this.currentProvider.clearSubcription()
  }

  fetchData() {
    //this.fetchCurrentBlock()
    this.fetchTxsData()
    this.fetchRateData()
    this.fetchAccountData()
    this.fetchRateExchange()
    this.fetchHistoryExchange()
  }

  fetchRateData() {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    var ownerAddr = state.account.account.address
    //var tokens = state.tokens.tokens
    var supportTokens = []
    Object.keys(BLOCKCHAIN_INFO.tokens).forEach((key) => {
      supportTokens.push(BLOCKCHAIN_INFO.tokens[key])
    })
    for (var k = 0; k < constants.RESERVES.length; k++) {
      var reserve = constants.RESERVES[k]
      store.dispatch(updateAllRate(ethereum, supportTokens, reserve, ownerAddr))
    }

  }

  fetchTxsData = () => {
    var state = store.getState()
    var tx
    var txs = state.txs
    var ethereum = state.connection.ethereum
    var tokens = state.tokens.tokens
    var arrayTokens = []
    if(tokens){
      Object.keys(tokens).forEach((key) => {
        arrayTokens.push(tokens[key])
      })
    } 
    var account = state.account.account
    Object.keys(txs).forEach((hash) => {
      tx = txs[hash]
      if (tx.status == "pending") {
        store.dispatch(updateTx(ethereum, tx, arrayTokens, account))
      }
    })
  }

  fetchAccountData = () => {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    var account = store.getState().account.account
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
    var reserve = constants.RESERVES[0].index
    store.dispatch(updateRateExchange(ethereum, source, dest, reserve))
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

  call(fn) {
    return this.currentProvider[fn].bind(this.currentProvider)
  }
}