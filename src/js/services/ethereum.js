import Web3 from "web3"
//import Wallet from "ethereumjs-wallet"
import constants from "./constants"

import { updateBlock, updateBlockFailed, updateRate, updateAllRate } from "../actions/globalActions"
import { updateAccount } from "../actions/accountActions"
//import { updateWallet } from "../actions/walletActions"
import { updateTx } from "../actions/txActions"
import { updateRateExchange } from "../actions/exchangeActions"
import SupportedTokens from "./supported_tokens"
import * as ethUtil from 'ethereumjs-util'
import { store } from "../store"

export default class EthereumService {
  constructor() {
    //this.rpc = new Web3(new Web3.providers.HttpProvider("https://kovan.kyber.network", 9000))
    //var provider = new Web3.providers.WebsocketProvider("ws://192.168.24.239:8546/")
    this.rpcUrl = "wss://kovan.kyber.network/ws/"
    
    //this.rpcUrl = "ws://localhost:8546"
    //this.rpcUrl = "wss://kovan.infura.io/DtzEYY0Km2BA3YwyJcBG"
    this.rpc    
    this.provider  
    this.createConnection()
    //this.rpc = new Web3(new Web3.providers.WebsocketProvider("wss://kovan.kyber.network/ws/"))
    //this.rpcHttp = new Web3(new Web3.providers.HttpProvider("http://localhost:8545", 9000))
    //this.rpc = new Web3(new Web3.providers.HttpProvider("http://192.168.25.215:8545", 9000))
    this.erc20Contract = new this.rpc.eth.Contract(constants.ERC20)
    this.networkAddress = constants.NETWORK_ADDRESS
    this.networkContract = new this.rpc.eth.Contract(constants.KYBER_NETWORK, this.networkAddress)
    this.intervalID = null
  }

  createConnection() {
    this.provider = new Web3.providers.WebsocketProvider(this.rpcUrl)     
    this.provider.on('end', (err)=>{
      console.log(err)
      store.dispatch(updateBlockFailed())      
    })
    this.provider.on('error', (err)=>{
      console.log(err)
      store.dispatch(updateBlockFailed())
    })    
    this.rpc = new Web3(this.provider)    
    //this.fetchData()
    this.rpc.eth.subscribe("newBlockHeaders", this.fetchData.bind(this))                     
  }

  removeSubcribe(callback){    
    this.rpc.currentProvider.reset()
    this.provider.reset()
    callback()
  }

  version() {
    return this.rpc.version.api
  }

  getLatestBlockPromise(ethereum) {
    return new Promise((resolve, reject) => {
      ethereum.rpc.eth.getBlock("latest", false).then((block) => {
        if (block != null) {
          resolve(block.number)
        }
      })
    })
  }

  getLatestBlock(callback) {
    return this.rpc.eth.getBlock("latest", false).then((block) => {
      if (block != null) {
        callback(block.number)
      }
    })
  }

  getBalance(address, callback) {
    this.rpc.eth.getBalance(address).then((balance) => {
      if (balance != null) {
        callback(balance)
      }
    })
  }

  getNonce(address, callback) {
    this.rpc.eth.getTransactionCount(address).then((nonce) => {
      if (nonce != null) {
        callback(nonce)
      }
    })
  }

  getTokenBalance(address, ownerAddr, callback) {
    var instance = this.erc20Contract
    instance.options.address = address
    instance.methods.balanceOf(ownerAddr).call().then((result) => {
      if (result != null) {
        callback(result)
      }
    })
  }  

  fetchRateData() {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    var ownerAddr = state.account.account.address
    for (var k = 0; k < constants.RESERVES.length; k++) {
      var reserve = constants.RESERVES[k]
      store.dispatch(updateAllRate(ethereum, SupportedTokens, reserve, ownerAddr))
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
    var source = state.exchange.sourceToken
    var dest = state.exchange.destToken
    var reserve = constants.RESERVES[0].index

    return this.networkContract.methods.getRate(source, dest, reserve).call().then((result) => {
      if (result != null) {
        store.dispatch(updateRateExchange(result))
      }
    })
  }


  fetchData() {
    this.fetchCurrentBlock()
    this.fetchTxsData()
    this.fetchRateData()
    this.fetchAccountData()
    this.fetchRateExchange()

  }


  // executeWalletData(walletAddress, to, value, data) {
  //   var wallet = new this.rpc.eth.Contract(constants.KYBER_WALLET, walletAddress)
  //   return wallet.execute.getData(to, value, data)
  // }

  exchangeData(sourceToken, sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate, throwOnFailure) {
    return this.networkContract.methods.trade(
      sourceToken, sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate, throwOnFailure).encodeABI()
  }

  approveTokenData(sourceToken, sourceAmount) {
    var tokenContract = this.erc20Contract
    tokenContract.options.address = sourceToken
    return tokenContract.methods.approve(this.networkAddress, sourceAmount).encodeABI()
  }

  sendTokenData(sourceToken, sourceAmount, destAddress) {
    var tokenContract = this.erc20Contract
    tokenContract.options.address = sourceToken
    return tokenContract.methods.transfer(destAddress, sourceAmount).encodeABI()
  }

  getAllowance(sourceToken, owner) {
    var tokenContract = this.erc20Contract
    tokenContract.options.address = sourceToken
    return new Promise((resolve, reject) => {
      tokenContract.methods.allowance(owner, this.networkAddress).call().then((result) => {
        if (result !== null) {
          resolve(result)
        }
      })
    })
  }

  getDecimalsOfToken(token){
    var tokenContract = this.erc20Contract
    tokenContract.options.address = token
    return new Promise((resolve, reject) => {
      tokenContract.methods.decimals().call().then((result)=>{        
        if (result !== null) {
          resolve(result)
        }
      })
    })
  }

  txMined(hash, callback) {
    this.rpc.eth.getTransactionReceipt(hash).then((result) => {
      if (result != null) {
        callback(true, result)
      } else {
        callback(false, undefined)
      }
    })
  }

  getRate(source, dest, reserve, callback) {
    return this.networkContract.methods.getRate(source, dest, reserve).call().then((result) => {
      if (result != null) {
        callback(result)
      }
    })    
  }

  sendRawTransaction(tx, ethereum) {  
    return new Promise((resolve, rejected) => {
      ethereum.rpc.eth.sendSignedTransaction(
        ethUtil.bufferToHex(tx.serialize()), (error, hash) => {
          if (error != null) {
            rejected(error)
          } else {
            resolve(hash)
          }
        })
    })
  }  
}
