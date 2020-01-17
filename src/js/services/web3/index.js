import * as dapp from "./dapp"

export function newWeb3Instance() {
    const type = getWeb3Type();
    let web3Instance;

    switch(type) {
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
            web3Instance = new dapp.DappBrowser()
            break
        default:
            web3Instance = false
            break
    }
    
    return web3Instance
}

function getWeb3Type() {
    if (window.ethereum || window.web3) {
        return getEthereumBrowser();
    }
    
    return "non_web3"
}

function getEthereumBrowser() {
    if (window.web3 && window.web3.currentProvider && window.web3.currentProvider.isMetaMask) {
        return "metamask"
    }
    
    if (window.web3 && window.web3.currentProvider && window.web3.currentProvider.isTrust === true) {
        return "trust"
    }
    
    if (window.web3 && (!!window.__CIPHER__) && (window.web3.currentProvider && window.web3.currentProvider.constructor && window.web3.currentProvider.constructor.name === "CipherProvider")) {
        return "cipher"
    }
    
    return "dapp"
}
