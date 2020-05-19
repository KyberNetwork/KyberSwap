import Web3 from "web3";
import BLOCKCHAIN_INFO from "../../../../env"
import BaseWallet from "./BaseWallet";
import { findNetworkCode } from "../../utils/converter";

export default class TorusWallet extends BaseWallet {
  constructor(props) {
    super(props);
    
    this.torus = null;
    this.address = '';
    this.needToBeInitiated = true;
  }
  
  async initiateWallet() {
    this.torus = new Torus();

    const networkId = BLOCKCHAIN_INFO.networkId;
  
    const params = {
      network: {
        host: findNetworkCode(networkId),
        chainId: networkId,
        networkName: BLOCKCHAIN_INFO.chainName
      },
      showTorusButton: false
    };
  
    await this.torus.init(params);
    
    const addresses = await this.torus.login();
    
    this.address = addresses[0];
    this.web3 = new Web3(this.torus.provider);
  }
  
  clearSession = () => {
    this.torus.cleanUp();
  };
  
  getWalletName = () => {
    return 'Torus';
  }
}
