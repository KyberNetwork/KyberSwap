
import React from 'react';
import HttpEthereumProvider from "./httpProvider.fake"
import constants from "../../../src/js/services/constants"

import { updateBlock, updateBlockFailed, updateRate, updateAllRate } from "../../../src/js/actions/globalActions"
import { updateAccount } from "../../../src/js/actions/accountActions"
import { updateTx } from "../../../src/js/actions/txActions"
import { updateRateExchange } from "../../../src/js/actions/exchangeActions"
import BLOCKCHAIN_INFO from "../../../env"
import { store } from "../../../src/js/store"
import { setConnection } from "../../../src/js/actions/connectionActions"

export default class EthereumService extends React.Component {
  constructor(props) {
    super(props)
    this.httpUrl = "https://kovan.infura.io/DtzEYY0Km2BA3YwyJcBG"

    this.httpProvider = this.getHttpProvider()

    this.initProvider(props.default)
  }

  initProvider(provider) {
    this.currentProvider = this.httpProvider
    this.currentLabel = "http"
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
  }

  fetchRateData() {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    for (var k = 0; k < constants.RESERVES.length; k++) {
      var reserve = constants.RESERVES[k]
      store.dispatch(updateAllRate(ethereum, BLOCKCHAIN_INFO.tokens, reserve))
    }
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