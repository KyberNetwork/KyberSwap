import { newWeb3Instance } from "../web3"
import BaseWallet from "./BaseWallet";

export default class Metamask extends BaseWallet {
  constructor(props){
    super(props);
    this.web3 = newWeb3Instance();
  }
  
  getDisconnected() {
    const web3 = this.web3;
    
    return new Promise((resolve) => {
      web3.getCoinbase().then(address => {
        var addressInterval = setInterval(function() {
          web3.getCoinbase().then(updatedAddress => {
            if (updatedAddress != address){
              clearInterval(addressInterval)
              resolve()
            }
          })
        }, 1000)
      })
    })
  }
  
  getWalletName = () => {
    return this.web3.getWalletName();
  }
}
