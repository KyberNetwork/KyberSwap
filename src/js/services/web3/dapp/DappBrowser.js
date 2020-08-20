import Web3 from "web3"
import * as ethUtil from 'ethereumjs-util'
import * as common from "../../../utils/common"
import { verifyAccount } from "../../../utils/validators"
import * as constants from "../../constants"

export default class DappBrowser {
  constructor() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      this.web3 = new Web3(Web3.givenProvider || window.web3.currentProvider || window.web3.givenProvider);
    }
  }

  getWalletType = () => {
    return "dapp"
  }
  
  getWalletName = () => {
    return 'Dapp';
  }

  getNetworkId = () => {
    return new Promise((resolve, reject) => {
      this.web3.eth.net.getId((error, result) => {
        if (error || !result) {
          error = new Error("Cannot get network id")
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }

  getCoinbase(isManual = false) {
    if (window.ethereum && isManual) {
      return new Promise((resolve, reject) => {
        window.ethereum.enable().then(() => {
          this.web3.eth.getAccounts((error, result) => {
            if (error || result.length === 0) {
              error = new Error("Cannot get coinbase")
              reject(error)
            } else {
              resolve(result[0])
            }
          })
        }).catch(() => {
          var error = new Error("Cannot get coinbase")
          reject(error)
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        this.web3.eth.getAccounts((error, result) => {
          if (error || result.length === 0) {
            error = new Error("Cannot get coinbase")
            reject(error)
          } else {
            resolve(result[0])
          }
        })
      })
    }
  }
  
  setDefaultAddress(address) {
    this.web3.eth.defaultAccount = address
  }

  getWalletId() {
    if (this.web3.kyberID && !verifyAccount(this.web3.kyberID)) {
      return this.web3.kyberID
    }
    var refAddr = common.getParameterByName("ref")
    if (!verifyAccount(refAddr)) {
      return refAddr
    }
    return constants.EXCHANGE_CONFIG.COMMISSION_ADDR
  }

  personalSign = (message, account) => {
    return new Promise((resolve, reject)=>{
      this.web3.eth.personal.sign(message, account, (error, result)=>{
        if(!error){
          resolve(result)
        }else{
          reject(error)
        }
      })
    })
  }

  async sign(message) {
    try {
      var account = await this.getCoinbase(true)
      
      let signature = await this.personalSign(message, account);
      
      var {v, r, s} = ethUtil.fromRpcSig(signature)
      r = ethUtil.bufferToHex(r)    
      s = ethUtil.bufferToHex(s)    

      signature = ethUtil.toRpcSig(v, r, s)

      return signature
    } catch(err) {
      console.log(err)
      throw err
    }
  }
}
