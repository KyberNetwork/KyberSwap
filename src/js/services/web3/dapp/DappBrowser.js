
import Web3 from "web3"

//import DappBrowser from "DappBrowser.js"
import * as common from "../../../utils/common"
import { verifyAccount } from "../../../utils/validators"
import * as converters from "../../../utils/converter"

export default class DappBrowser {
  constructor() {
    this.web3 = new Web3(Web3.givenProvider)
  }

  getWalletType = () => {
    return "dapp"
  }

  getNetworkId = () => {
    return new Promise((resolve, reject) => {
      this.web3.eth.net.getId((error, result) => {
        // alert(error)
        // alert(result)
        //console.log()
        console.log(result)
        if (error || !result) {
          var error = new Error("Cannot get network id")
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }

  getCoinbase() {
      return new Promise((resolve, reject) => {
        this.web3.eth.getAccounts((error, result) => {
          console.log(error)
          console.log(result)
          if (error || result.length === 0) {
            var error = new Error("Cannot get coinbase")
            reject(error)
          } else {
            resolve(result[0])
          }
        })
      })
    } 


  setDefaultAddress(address) {
    this.web3.eth.defaultAccount = address
  }

  
  getWalletId(blockNo){
    var refAddr = common.getParameterByName("ref")
    if (!verifyAccount(refAddr)) {
      return refAddr
    }
    if (common.isUserEurope()){
        return "0x440bBd6a888a36DE6e2F6A25f65bc4e16874faa9" 
    }

    if (web3.kyberID && !verifyAccount(web3.kyberID)) {
      return web3Service.web3.kyberID
    }

    return converters.numberToHexAddress(blockNo)
  }

}