import Web3 from "web3"
import Formatic from "fortmatic"
import BaseWallet from "./BaseWallet";
import BLOCKCHAIN_INFO from "../../../../env"

export default class FortmaticWallet extends BaseWallet {
  constructor(props){
    super(props);
  
    this.fortmatic = new Formatic(BLOCKCHAIN_INFO.fortmaticKey);
    this.eth = this.fortmatic.getProvider();
    this.web3 = new Web3(this.fortmatic.getProvider());
  }
  
  getAddress = () => {
    return new Promise((resolve, reject) => {
      this.eth.enable().then((accounts) => {
        resolve(accounts[0])
      }).catch(err => {
        console.log(err);
        reject(err.message)
      })
    })
  };
  
  getWalletName = () => {
    return "Fortmatic";
  }
}
