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
        case "alpha_wallet":
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

    return web3Instance
}

function getWeb3Type(){
    if (window.web3){
        if (window.ethereum && window.web3.currentProvider && window.web3.currentProvider.isMetaMask){
            return "modern_metamask"
        }
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
        return "dapp"
    }
    return "non_web3"    
}
