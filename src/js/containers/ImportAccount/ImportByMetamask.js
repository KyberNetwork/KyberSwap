import React from "react"
import { connect } from "react-redux"
import { importAccountMetamask, throwError } from "../../actions/accountActions"
import { ImportByMetamaskView } from "../../components/ImportAccount"
import BLOCKCHAIN_INFO from "../../../../env"
import Web3Service from "../../services/web3"
import { getTranslate } from 'react-localize-redux'
import bowser from 'bowser'

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
    screen: props.screen
  }
})

export default class ImportByMetamask extends React.Component {

  connect = (e) => {   
    if (typeof web3 === "undefined") {
      this.props.dispatch(throwError(this.props.translate('error.metamask_not_install') || 'Cannot connect to metamask. Please make sure you have metamask installed'))
      return
    }            
    var web3Service = new Web3Service(web3)
    
    // let browser = bowser.name
    // console.log(browser)
		// if(browser != 'Chrome' && browser != 'Firefox' && browser !== 'Opera'){
    //   if(!web3Service.isTrust()){
    //     let erroMsg = this.props.translate("error.browser_not_support_metamask", {browser: browser}) || `Metamask is not supported on ${browser}, you can use Chrome or Firefox instead.`
    //     this.props.dispatch(throwError(erroMsg))
    //     return
    //   }
    // }

    this.dispatchAccMetamask(web3Service);
  }

  dispatchAccMetamask(web3Service){
    this.props.dispatch(importAccountMetamask(web3Service, BLOCKCHAIN_INFO.networkId,
      this.props.ethereum, this.props.tokens, this.props.translate, this.props.screen))
  }

  render() {
    return (
      <ImportByMetamaskView 
        connect={this.connect}
        translate={this.props.translate}
        metamask = {this.props.metamask}
      />
    )
  }
}
