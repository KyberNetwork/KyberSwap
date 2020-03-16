import BaseWallet from "./BaseWallet";
import Portis from '@portis/web3';
import Web3 from 'web3';
import BLOCKCHAIN_INFO from "../../../../env"
import { findNetworkCode } from "../../utils/converter";

export default class PortisWallet extends BaseWallet {
  constructor(props) {
    super(props);
    
    const networkId = BLOCKCHAIN_INFO.networkId;
    
    this.portis = new Portis(BLOCKCHAIN_INFO.portisKey, findNetworkCode(networkId));
    this.eth = this.portis.provider;
    this.web3 = new Web3(this.eth);
  }
  
  getDisconnected() {
    return new Promise((resolve) => {
      const checkingInterval = setInterval(() => {
        this.portis.isLoggedIn().then(({ error, result }) => {
          alert(result + ' test');
          if (!result) {
            clearInterval(checkingInterval);
            resolve();
          }
        });
      }, 5000);
    })
  }
  
  getWalletName = () => {
    return 'Portis';
  }
}
