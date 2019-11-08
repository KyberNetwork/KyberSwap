import React from "react"
import { connect } from "react-redux"
import { importAccountMetamask, throwError } from "../../actions/accountActions"
import BLOCKCHAIN_INFO from "../../../../env"
import * as web3Package from "../../services/web3"
import WalletLink from "walletlink"
import Web3 from "web3"
import { getTranslate } from 'react-localize-redux'
import ImportByWalletLinkView from "../../components/ImportAccount/ImportByWalletLinkView";
import { KYBER_SWAP_LOGO_URL, APP_NAME } from "../../services/constants";

@connect((store, props) => {
  var tokens = store.tokens.tokens
  var supportTokens = []
  Object.keys(tokens).forEach((key) => {
    supportTokens.push(tokens[key])
  })
  return {
    account: store.account,
    ethereum: store.connection.ethereum,
    tokens: supportTokens,
    translate: getTranslate(store.locale),
    metamask: store.global.metamask,
    screen: props.screen,
    analytics: store.global.analytics
  }
})
export default class ImportByWalletLink extends React.Component {
  connect = (e) => {
    this.props.analytics.callTrack("trackClickImportAccount", "Wallet Link");
    
    // Should be fetched from ENV
    const ETH_JSONRPC_URL = "https://mainnet.infura.io/v3/c1d32946e55e45b78c330954cf543fc7"

    // Initialize WalletLink
    const walletLink = new WalletLink({
      appName: APP_NAME,
      appLogoUrl: KYBER_SWAP_LOGO_URL
    })
    
    // Initialize a Web3 Provider object
    const ethereum = walletLink.makeWeb3Provider(ETH_JSONRPC_URL, BLOCKCHAIN_INFO.networkId)
    
    // Initialize a Web3 object
    const web3 = new Web3(ethereum)
    
    // Optionally, have the default account be set automatically when available
    ethereum.on("accountsChanged", (accounts) => {
      web3.eth.defaultAccount = accounts[0]
    })
    
    web3.eth.defaultAccount = web3.eth.accounts[0]
    
    ethereum.enable().then((accounts) => {
      console.log(`User's address is ${accounts[0]}`)
    })
  };
  
  render() {
    return (
      <ImportByWalletLinkView
        connect={this.connect}
      />
    )
  }
}
