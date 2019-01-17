
import Web3 from "web3"

//import DappBrowser from "DappBrowser.js"
import * as common from "../../../utils/common"
import { verifyAccount } from "../../../utils/validators"
import * as converters from "../../../utils/converter"

export default class DappBrowser {
  constructor() {
    this.web3 = new Web3(Web3.givenProvider || window.web3.currentProvider || window.web3.givenProvider)
    //for older verions of web3
    console.log("web3_v5")
    if (this.web3 && this.web3.net && !this.web3.eth.net){
      this.web3.eth.net = this.web3.net
    }
    //console.log(this.web3)
  }

  getWalletType = () => {
    return "dapp"
  }

  getNetworkId = () => {
    return new Promise((resolve, reject) => {
      this.web3.eth.net.getId((error, result) => {
        if (error || !result) {
          console.log(error)  
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
          if (error || result.length === 0) {
            var error = new Error("Cannot get coinbase")
            reject(error)
          } else {
            resolve(result[0])
          }
        })

        // this.web3.eth.getAccounts((error, result) => {
        //   if (error || result.length === 0) {
        //     var error = new Error("Cannot get coinbase")
        //     reject(error)
        //   } else {
        //     resolve(result[0])
        //   }
        // })

      })
    } 


  setDefaultAddress(address) {
    this.web3.eth.defaultAccount = address
  }

  
  getWalletId(blockNo){
    var refAddr = common.getParameterByName("ref")
  //  alert(refAddr)
    
    if (!verifyAccount(refAddr)) {
    //  alert("xxxx")
      return refAddr
    }
    if (common.isUserEurope()){
        return "0x440bBd6a888a36DE6e2F6A25f65bc4e16874faa9" 
    }

    if (web3.kyberID && !verifyAccount(web3.kyberID)) {
      return web3Service.web3.kyberID
    }

    return "0xea1a7de54a427342c8820185867cf49fc2f95d43"
    //return converters.numberToHexAddress(blockNo)
  }

}