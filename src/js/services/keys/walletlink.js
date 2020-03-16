import React from 'react';
import BLOCKCHAIN_INFO from "../../../../env"
import WalletLink from "walletlink"
import Web3 from "web3"
import BaseWallet from "./BaseWallet";

export default class WalletLinkKey extends BaseWallet {
  constructor(props) {
    super(props);
    
    this.walletLink = new WalletLink({
      appName: 'KyberSwap',
      appLogoUrl: 'https://kyberswap.com/app/images/Kyber_Swap_Black.svg'
    });
    this.eth = this.walletLink.makeWeb3Provider(BLOCKCHAIN_INFO["connections"]["http"][1]["endPoint"], BLOCKCHAIN_INFO.networkId);
    this.web3 = new Web3(this.eth)
  }
  
  getWalletName = () => {
    return 'Wallet Link';
  }
}
