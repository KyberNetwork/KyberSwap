import Web3 from "web3"
//import Wallet from "ethereumjs-wallet"
import constants from "./constants"

import { updateBlock, updateBlockFailed, updateRate, updateAllRate } from "../actions/globalActions"
import { updateAccount } from "../actions/accountActions"
//import { updateWallet } from "../actions/walletActions"
import { updateTx } from "../actions/txActions"
import {updateRateExchange} from "../actions/exchangeActions"
import SupportedTokens from "./supported_tokens"
import * as ethUtil from 'ethereumjs-util'
import {store} from "../store"

export default class EthereumService {
  constructor() {    
    //this.rpc = new Web3(new Web3.providers.HttpProvider("https://kovan.kyber.network", 9000))
    //this.rpc = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.24.239:8546/", 9000))
    this.rpc = new Web3(new Web3.providers.WebsocketProvider("wss://kovan.kyber.network/ws/", 9000))
    //this.rpc = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/0BRKxQ0SFvAxGL72cbXi", 9000))
    //this.rpc = new Web3(new Web3.providers.HttpProvider("http://192.168.25.215:8545", 9000))
    this.erc20Contract = new this.rpc.eth.Contract(constants.ERC20)
    this.networkAddress = constants.NETWORK_ADDRESS
    this.networkContract = new this.rpc.eth.Contract(constants.KYBER_NETWORK, this.networkAddress)
    this.intervalID = null
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
    this.rpc.eth.getTransactionCount(address, "pending").then((nonce) => {
      if (nonce != null) {        
        callback(nonce)
      }
    })
  }

  getTokenBalance(address, ownerAddr, callback) {
    var instance = this.erc20Contract
    instance.options.address = address
    instance.methods.balanceOf(ownerAddr).call().then((result)=>{
      if (result != null) {
        callback(result)
      } 
    })
    // instance.balanceOf(ownerAddr, (error, result) => {
    //   if (error != null) {
    //     console.log(error)
    //   } else {
    //     callback(result)
    //   }
    // })
  }

  // watch() {
  //   this.rpc.eth.filter("latest", this.actAndWatch.bind(this), (error) => {
  //     // the node is not support for filtering
  //     this.fetchData()
  //     this.intervalID = setInterval(this.fetchData.bind(this), 10000)
  //   })
  // }

  watch() {
    this.rpc.eth.subscribe("newBlockHeaders", this.actAndWatch.bind(this))
  }

  actAndWatch(error, result) {
    if (error != null) {
      store.dispatch(updateBlockFailed(error))
    } else {
      this.fetchData()
    }
  }

  fetchRateData() {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    var ownerAddr = state.account.account.address
    // for (var i = 0; i < SupportedTokens.length; i++) {
    //   var token = {
    //     name: SupportedTokens[i].name,
    //     icon: SupportedTokens[i].icon,
    //     symbol: SupportedTokens[i].symbol,
    //     address: SupportedTokens[i].address
    //   }
    //   for (var k = 0; k < constants.RESERVES.length; k++) {
    //     var reserve = constants.RESERVES[k]
    //     store.dispatch(updateRate(ethereum, token, reserve, ownerAddr))



    //     ///////////////////////////////////////
    //   }
    // }
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
    if (account.address){
      store.dispatch(updateAccount(ethereum, account))
    }
    
    // Object.keys(accounts).forEach((key) => {
    //   store.dispatch(updateAccount(ethereum, accounts[key]))
    // })
  }

  // fetchWalletsData = () => {
  //   var state = store.getState()
  //   var ethereum = state.connection.ethereum
  //   var wallets = store.getState().wallets.wallets
  //   Object.keys(wallets).forEach((key) => {
  //     store.dispatch(updateWallet(ethereum, wallets[key]))
  //   })
  // }

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
        
    // return this.networkContract.call().getRate(source, dest, reserve, (error, result) => {
    //   if (error != null) {
    //     console.log(error)
    //   } else {
    //     store.dispatch(updateRateExchange(result))
    //   }
    // })

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

  // paymentData(walletAddress, sourceToken, sourceAmount, destToken, maxDestAmount,
  //   minConversionRate, destAddress, data, onlyApproveToken, throwOnFailure) {
  //   var wallet = new this.rpc.eth.Contract(constants.KYBER_WALLET, walletAddress)
  //   return wallet.convertAndCall.getData(
  //     sourceToken, sourceAmount, destToken, maxDestAmount,
  //     minConversionRate, destAddress, data, onlyApproveToken, throwOnFailure
  //   )
  // }

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
    return new Promise((resolve, reject)=>{
        tokenContract.methods.allowance(owner, this.networkAddress).call().then((result)=>{       
          if(result !== null){            
            resolve(result)
          }                      
        })                 
    })    
  }

  txMined(hash, callback) {
    this.rpc.eth.getTransactionReceipt(hash).then((result) => {
      if (result != null) {
        callback(true, result)
      }else{
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
    // return this.networkContract.getRate(source, dest, reserve, (error, result) => {
    //   if (error != null) {
    //     console.log(error)
    //   } else {
    //     callback(result)
    //   }
    // })
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
    //console.log(ethUtil.bufferToHex(tx.serialize()))
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
  
  // deployKyberWalletData(from) {
  //   var _kyberNetwork = constants.NETWORK_ADDRESS
  //   var contract = new this.rpc.eth.Contract(constants.KYBER_WALLET)
  //   return contract.new.getData(_kyberNetwork, {
  //     data: constants.KYBER_WALLET_DATA,
  //   })
  // }

  // createNewAddress(passphrase) {
  //   var newAddress = Wallet.generate()
  //   return newAddress.toV3(passphrase, {kdf: "pbkdf2", c: 10240})
  // }
}
