
import * as converters from "../../../utils/converter"
import * as common from "../../../utils/common"
import { verifyAccount } from "../../../utils/validators"
import Web3 from "web3"
import DappBrowser from "./DappBrowser";


export default class ModernMetamaskBrowser extends DappBrowser {
  constructor() {
    super()
    this.web3 = new Web3(Web3.givenProvider)
  }

  getWalletType = () => {
    return "metamask"
  }

  getNetworkId = () => {
    return new Promise((resolve, reject) => {
      this.web3.eth.net.getId((error, result) => {
        // alert(error)
        // alert(result)
        if (error || !result) {
          var error = new Error("Cannot get network id")
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }

  getCoinbase(isManual = false) {
    // console.log("is_manual")
    // console.log(isManual)
    if (window.ethereum && isManual) {
      return new Promise((resolve, reject) => {
        window.ethereum.enable().then(() => {
          this.web3.eth.getCoinbase((error, result) => {
            // alert(error)
            // alert(result)
            console.log(error)
            //   console.log(result)      
            if (error || !result) {
              var error = new Error("Cannot get coinbase")
              reject(error)
            } else {
              resolve(result)
            }
          })
        }).catch(err => {
          console.log(err)
          var error = new Error("Cannot get coinbase")
          reject(error)
        })
       
      })
    } else {
      return new Promise((resolve, reject) => {
        this.web3.eth.getCoinbase((error, result) => {
          // alert(error)
          // alert(result)
          console.log(error)
          //   console.log(result)      
          if (error || !result) {
            var error = new Error("Cannot get coinbase")
            reject(error)
          } else {
            resolve(result)
          }
        })
      })
    }
  }

  setDefaultAddress(address) {
    this.web3.eth.defaultAccount = address
  }
  
}

// function getCommissionId(blockNo) {
//   var refAddr = common.getParameterByName("ref")
//   if (!verifyAccount(refAddr)) {
//     return refAddr
//   }
//   var web3Service = new Web3Service()
//   if (web3Service.isHaveWeb3() && web3Service.web3.kyberID && !verifyAccount(web3Service.web3.kyberID)) {
//     return web3Service.web3.kyberID
//   }
//   if (common.isUserEurope()){
//    return "0x440bBd6a888a36DE6e2F6A25f65bc4e16874faa9" 
//   }
//   return converters.numberToHexAddress(blockNo)
// }

// export function getWalletId(walletType, blockNo) {
//   switch (walletType) {
//     case "cipher":
//       return "0xdd61803d4a56c597e0fc864f7a20ec7158c6cba5"
//       break
//     case "trust":
//       return "0xf1aa99c69715f423086008eb9d06dc1e35cc504d"
//       break
//     case "metamask":
//     case "dapp":
//     case "unknown":
//     default:
//       return getCommissionId(blockNo)
//       break
//   }
// }