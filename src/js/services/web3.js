
import * as converters from "../utils/converter"
import * as common from "../utils/common"
import {verifyAccount} from "../utils/validators"

export default class Web3Service {
  constructor(web3Instance) {
    this.web3 = web3Instance
  }

  isTrust = () => {
    if (this.web3.currentProvider && this.web3.currentProvider.isTrust === true){
      return true
    }
    return false
  }
  getNetworkId = ()=> {
    return new Promise((resolve, reject)=>{
      this.web3.version.getNetwork((error, result) => { 
        if (error || !result) {
          var error = new Error("Cannot get network id")
          reject(error)
        }else{
          resolve(result)
        }
      })
    })
  }

  getWalletType = () => {
    if (this.web3.currentProvider && web3.currentProvider.isMetaMask){
      return "metamask"
    }

    if (this.web3.currentProvider && web3.currentProvider.isTrust === true){
      return "trust"
    }    

    //is cipher
    if((!!window.__CIPHER__) && (this.web3.currentProvider && this.web3.currentProvider.constructor && this.web3.currentProvider.constructor.name === "CipherProvider")){
      return "cipher"
    }

    if (this.web3.isDAppBrowser && this.web3.isDAppBrowser()){
      return "dapp"
    }

    return "unknown"
        
  }

  getCoinbase(){
    return new Promise((resolve, reject)=>{
      this.web3.eth.getCoinbase((error, result) => {
        // alert(error)
        // alert(result)
        // console.log(error)
        //   console.log(result)      
        if (error || !result) {
          var error = new Error("Cannot get coinbase")
          reject(error)
        }else{
          resolve(result)
        }
      })
    })
  }
  setDefaultAddress(address){
    web3.eth.defaultAccount = address
  }
}

function getCommissionId(blockNo){
  var refAddr = common.getParameterByName("ref")
  if (!verifyAccount(refAddr)){
    return refAddr
  }
  if (typeof web3 !== "undefined" && web3.kyberID && !verifyAccount(web3.kyberID)){
    return web3.kyberID
  }
  return converters.numberToHexAddress(blockNo)
}

export function getWalletId(walletType, blockNo){
  switch(walletType){
      case "cipher":
        return "0xdd61803d4a56c597e0fc864f7a20ec7158c6cba5"
        break
      case "trust":
        return "0xf1aa99c69715f423086008eb9d06dc1e35cc504d"
        break
      case "metamask":
      case "dapp":
      case "unknown":
      default:
        return getCommissionId(blockNo)
        break
    }
}