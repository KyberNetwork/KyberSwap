import Torus from "@toruslabs/torus-embed";
import Web3 from "web3";
import BLOCKCHAIN_INFO from "../../../../env"

export default class TorusWallet {
  constructor() {
    this.torus = new Torus();
    this.web3 = null;
  }
  
  async getAddress() {
    await this.torus.init();
    
    const addresses = await this.torus.login({
      network: {
        host: BLOCKCHAIN_INFO["connections"]["http"][1]["endPoint"],
        chainId: BLOCKCHAIN_INFO.networkId,
        networkName: BLOCKCHAIN_INFO.chainName
      },
      showTorusButton: false
    });
  
    this.torus.hideTorusButton();
    
    this.web3 = new Web3(this.torus.provider);
    
    return addresses[0];
  };
  
  getWalletName = () => {
    return 'Torus';
  }
}
