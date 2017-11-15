
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
    this.wsUrl = "wss://kovan.kyber.network/ws/"
    //this.wsUrl = "ws://localhost:8546"
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
    this.currentProvider.subcribeNewBlock(this.fetchData.bind(this))
  }

  clearSubcription() {
    this.currentProvider.clearSubcription()
  }

  fetchData() {
    this.fetchCurrentBlock()
    this.fetchTxsData()
    this.fetchRateData()
    this.fetchAccountData()
    this.fetchRateExchange()
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
    Object.keys(txs).forEach((hash) => {
      tx = txs[hash]
      if (tx.status == "pending") {
        store.dispatch(updateTx(ethereum, tx))
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

  call(fn) {
    return this.currentProvider[fn].bind(this.currentProvider)
  }
}