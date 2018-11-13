


//import {DappBrowser} from "./DappBrowser"
// import {ModernMetamaskBrowser} from "./ModernMetamaskBrowser"
// import {MetamaskBrowser} from "MetamaskBrowser.js"
// import {TrustBrowser} from "./TrustBrowser"
// import {CipherBrowser} from "./CipherBrowser"


import * as common from "../../utils/common"
import * as dapp from "./dapp"


export function newWeb3Instance(){
    var type = getWeb3Type()
    var web3Instance
    switch(type){
        case "modern_metamask":
            web3Instance = new dapp.ModernMetamaskBrowser()
            break
        case "trust":
            web3Instance = new dapp.TrustBrowser()
            break
        case "cipher":
            web3Instance = new dapp.CipherBrowser()
            break
        case "metamask":
            web3Instance = new dapp.MetamaskBrowser()
            break
        case "dapp":
        case "unknown":
            web3Instance = new dapp.DappBrowser()
            break
        case "non_web3":
            web3Instance = false
            break
        default:
            web3Instance = false
            break
    }
    console.log("web3_type")
    console.log(type)
    return web3Instance
}   




function getWeb3Type(){
    if (window.ethereum){
        return "modern_metamask"
    }
    if (window.web3){
        if (window.web3.currentProvider && window.web3.currentProvider.isMetaMask){
            return "metamask"
        }
        if (window.web3.currentProvider && window.web3.currentProvider.isTrust === true) {
            return "trust"
        }
        if ((!!window.__CIPHER__) && (window.web3.currentProvider && window.web3.currentProvider.constructor && window.web3.currentProvider.constructor.name === "CipherProvider")) {
            return "cipher"
        }
        if (window.web3.isDAppBrowser && window.web3.isDAppBrowser()) {
            return "dapp"
        }
        return "unknown"
    }
    return "non_web3"    
}



// function getCommissionId(blockNo, walletType) {
//     var refAddr = common.getParameterByName("ref")
//     if (!verifyAccount(refAddr)) {
//       return refAddr
//     }
//     var web3Service = new Web3Service(walletType)
//     if (web3Service.isHaveWeb3() && web3Service.web3.kyberID && !verifyAccount(web3Service.web3.kyberID)) {
//       return web3Service.web3.kyberID
//     }
//     if (common.isUserEurope()){
//      return "0x440bBd6a888a36DE6e2F6A25f65bc4e16874faa9" 
//     }
//     return converters.numberToHexAddress(blockNo)
//   }
  
//   export function getWalletId(walletType, blockNo) {
//     switch (walletType) {
//       case "cipher":
//         return "0xdd61803d4a56c597e0fc864f7a20ec7158c6cba5"
//         break
//       case "trust":
//         return "0xf1aa99c69715f423086008eb9d06dc1e35cc504d"
//         break
//       case "metamask":
//       case "dapp":
//       case "unknown":
//       default:
//         return getCommissionId(blockNo, walletType)
//         break
//     }
//   }