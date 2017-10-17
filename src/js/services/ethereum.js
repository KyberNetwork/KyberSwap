import Web3 from "web3"
import Wallet from "ethereumjs-wallet"
import constants from "./constants"

import { updateBlock, updateBlockFailed, updateRate } from "../actions/globalActions"
import { updateAccount } from "../actions/accountActions"
import { updateWallet } from "../actions/walletActions"
import { updateTx } from "../actions/txActions"
import {updateRateExchange} from "../actions/exchangeActions"
import SupportedTokens from "./supported_tokens"
import * as ethUtil from 'ethereumjs-util'
import store from "../store"

export default class EthereumService {
  constructor() {
    // this.rpc = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
    this.rpc = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/0BRKxQ0SFvAxGL72cbXi", 9000))
    this.erc20Contract = this.rpc.eth.contract(constants.ERC20)
    this.networkAddress = constants.NETWORK_ADDRESS
    this.networkContract = this.rpc.eth.contract(constants.KYBER_NETWORK).at(this.networkAddress)
    this.intervalID = null
  }

  version() {
    return this.rpc.version.api
  }

  getLatestBlockPromise(ethereum) {
    return new Promise((resolve, reject) => {
      ethereum.rpc.eth.getBlock("latest", false, (error, block) => {
        if (error != null) {
          console.log(error)
        } else {
          resolve(block.number)
        }
      })
    })
  }

  getLatestBlock(callback) {
    return this.rpc.eth.getBlock("latest", false, (error, block) => {
      if (error != null) {
        console.log(error)
      } else {
        callback(block.number)
      }
    })
  }

  getBalance(address, callback) {
    this.rpc.eth.getBalance(address, (error, balance) => {
      if (error != null) {
        console.log(error)
      } else {
        callback(balance)
      }
    })
  }

  getNonce(address, callback) {
    this.rpc.eth.getTransactionCount(address, "pending", (error, nonce) => {
      if (error != null) {
        console.log(error)
      } else {
        callback(nonce)
      }
    })
  }

  getTokenBalance(address, ownerAddr, callback) {
    var instance = this.erc20Contract.at(address)
    instance.balanceOf(ownerAddr, (error, result) => {
      if (error != null) {
        console.log(error)
      } else {
        callback(result)
      }
    })
  }

  watch() {
    this.rpc.eth.filter("latest", this.actAndWatch.bind(this), (error) => {
      // the node is not support for filtering
      this.fetchData()
      this.intervalID = setInterval(this.fetchData.bind(this), 10000)
    })
  }

  fetchRateData() {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    var ownerAddr = state.account.address
    for (var i = 0; i < SupportedTokens.length; i++) {
      var token = {
        name: SupportedTokens[i].name,
        icon: SupportedTokens[i].icon,
        symbol: SupportedTokens[i].symbol,
        address: SupportedTokens[i].address
      }
      for (var k = 0; k < constants.RESERVES.length; k++) {
        var reserve = constants.RESERVES[k]
        store.dispatch(updateRate(ethereum, token, reserve, ownerAddr))
      }
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

  fetchAccountsData = () => {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    var accounts = store.getState().accounts.accounts
    Object.keys(accounts).forEach((key) => {
      store.dispatch(updateAccount(ethereum, accounts[key]))
    })
  }

  fetchWalletsData = () => {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    var wallets = store.getState().wallets.wallets
    Object.keys(wallets).forEach((key) => {
      store.dispatch(updateWallet(ethereum, wallets[key]))
    })
  }

  fetchCurrentBlock = () => {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    store.dispatch(updateBlock(ethereum))
  }

  fetchRateExchange = () => {
    var state = store.getState()
    var source = state.exchange.sourceToken
    var dest = state.exchange.destToken
    var reserve = constants.RESERVES[0].index
    
    console.log(source)    
    console.log(dest)    
    console.log(reserve)    
    return this.networkContract.getRate(source, dest, reserve, (error, result) => {
      if (error != null) {
        console.log(error)
      } else {
        console.log(result)
        store.dispatch(updateRateExchange(result))
      }
    })
  }


  fetchData() {
    this.fetchCurrentBlock()
    this.fetchTxsData()
    this.fetchRateData()
    this.fetchWalletsData()
    this.fetchAccountsData()
    this.fetchRateExchange()

  }

  actAndWatch(error, result) {
    if (error != null) {
      store.dispatch(updateBlockFailed(error))
    } else {
      this.fetchData()
    }
  }

  executeWalletData(walletAddress, to, value, data) {
    var wallet = this.rpc.eth.contract(constants.KYBER_WALLET).at(walletAddress)
    return wallet.execute.getData(to, value, data)
  }

  exchangeData(sourceToken, sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate, throwOnFailure) {
    return this.networkContract.trade.getData(
      sourceToken, sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate, throwOnFailure)
  }

  paymentData(walletAddress, sourceToken, sourceAmount, destToken, maxDestAmount,
    minConversionRate, destAddress, data, onlyApproveToken, throwOnFailure) {
    var wallet = this.rpc.eth.contract(constants.KYBER_WALLET).at(walletAddress)
    return wallet.convertAndCall.getData(
      sourceToken, sourceAmount, destToken, maxDestAmount,
      minConversionRate, destAddress, data, onlyApproveToken, throwOnFailure
    )
  }

  approveTokenData(sourceToken, sourceAmount) {
    var tokenContract = this.erc20Contract.at(sourceToken)
    return tokenContract.approve.getData(this.networkAddress, sourceAmount)
  }

  sendTokenData(sourceToken, sourceAmount, destAddress) {
    var tokenContract = this.erc20Contract.at(sourceToken)
    return tokenContract.transfer.getData(destAddress, sourceAmount)
  }

  txMined(hash, callback) {
    this.rpc.eth.getTransactionReceipt(hash, (error, result) => {
      if (error != null) {
        console.log(error)
      } else {
        result == null ? callback(false, undefined) : callback(true, result)
      }
    })
  }

  getRate(source, dest, reserve, callback) {
    console.log(source)
    console.log(dest)
    console.log(reserve)
    return this.networkContract.getRate(source, dest, reserve, (error, result) => {
      if (error != null) {
        console.log(error)
      } else {
        callback(result)
        console.log(result)
      }
    })
  }  
  // tx should be ethereumjs-tx object
  // sendRawTransaction(tx, callback, failCallback) {
  //   return this.rpc.eth.sendRawTransaction(
  //     ethUtil.bufferToHex(tx.serialize()), (error, hash) => {
  //       if (error != null) {
  //         failCallback(error)
  //       } else {
  //         callback(hash)
  //       }
  //     })
  // }
  sendRawTransaction(tx, ethereum) {
    return new Promise((resolve, rejected) => {
      ethereum.rpc.eth.sendRawTransaction(
      ethUtil.bufferToHex(tx.serialize()), (error, hash) => {
        if (error != null) {
          rejected(error)
        } else {
          resolve(hash)
        }
      })
    })    
  }
  
  deployKyberWalletData(from) {
    var _kyberNetwork = constants.NETWORK_ADDRESS
    var contract = this.rpc.eth.contract(constants.KYBER_WALLET)
    return contract.new.getData(_kyberNetwork, {
      data: constants.KYBER_WALLET_DATA,
    })
  }

  createNewAddress(passphrase) {
    var newAddress = Wallet.generate()
    return newAddress.toV3(passphrase, {kdf: "pbkdf2", c: 10240})
  }
}
