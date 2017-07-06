import Web3 from "web3"
import constants from "./constants"

import { updateBlock, updateBlockFailed, updateRates } from "../actions/globalActions"
import { updateAccounts } from "../actions/accountActions"
import { updateTxs } from "../actions/txActions"
import { fetchRates } from "../services/exchange"
import * as ethUtil from 'ethereumjs-util'
import store from "../store"

export default class EthereumService {
  constructor() {
    this.rpc = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
    this.erc20Contract = this.rpc.eth.contract(constants.ERC20)
    this.networkAddress = constants.NETWORK_ADDRESS
    this.networkContract = this.rpc.eth.contract(constants.KYBER_NETWORK).at(this.networkAddress)
  }

  version() {
    return this.rpc.version.api
  }

  getBalance(address) {
    return this.rpc.eth.getBalance(address)
  }

  getNonce(address) {
    return this.rpc.eth.getTransactionCount(address, "pending")
  }

  getTokenBalance(address, ownerAddr) {
    var instance = this.erc20Contract.at(address)
    return instance.balanceOf(ownerAddr)
  }

  watch() {
    this.rpc.eth.filter("latest", this.actAndWatch)
  }

  actAndWatch(error, result) {
    if (error != null) {
      store.dispatch(updateBlockFailed(error))
    } else {
      store.dispatch(updateBlock(result))
      var newTxs = {}
      var state = store.getState()
      var txs = state.txs
      var tx
      var ethereum = state.global.ethereum
      Object.keys(txs).forEach((hash) => {
        tx = txs[hash]
        if (tx.status == "pending") {
          newTxs[hash] = tx.sync(ethereum)
        } else {
          newTxs[hash] = tx
        }
      })
      store.dispatch(updateTxs(newTxs))
      store.dispatch(updateAccounts())
      var rates = fetchRates(ethereum)
      store.dispatch(updateRates(rates))
    }
  }

  exchangeData(sourceToken, sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate, throwOnFailure) {
    return this.networkContract.trade.getData(
      sourceToken, sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate, throwOnFailure)
  }

  approveTokenData(sourceToken, sourceAmount) {
    var tokenContract = this.erc20Contract.at(sourceToken)
    return tokenContract.approve.getData(this.networkAddress, sourceAmount)
  }

  txMined(hash) {
    var receipt = this.rpc.eth.getTransactionReceipt(hash)
    return receipt == null ? false : true
  }

  getRate(source, dest, reserve) {
    return this.networkContract.getRate(source, dest, reserve)
  }

  // tx should be ethereumjs-tx object
  sendRawTransaction(tx) {
    return this.rpc.eth.sendRawTransaction(
      ethUtil.bufferToHex(tx.serialize()))
  }
}
