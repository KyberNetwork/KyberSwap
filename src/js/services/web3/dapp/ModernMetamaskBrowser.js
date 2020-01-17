import DappBrowser from "./DappBrowser";

export default class ModernMetamaskBrowser extends DappBrowser {
  getWalletType = () => {
    return "metamask"
  }
  
  getWalletName = () => {
    return 'Metamask';
  }

  setDefaultAddress(address) {
    this.web3.eth.defaultAccount = address
  }
}