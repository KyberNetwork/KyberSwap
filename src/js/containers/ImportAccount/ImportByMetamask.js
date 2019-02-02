import React from "react"
import { connect } from "react-redux"
import { importAccountMetamask, throwError } from "../../actions/accountActions"
import { ImportByMetamaskView } from "../../components/ImportAccount"
import BLOCKCHAIN_INFO from "../../../../env"
import * as web3Package from "../../services/web3"
import { getTranslate } from 'react-localize-redux'

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

export default class ImportByMetamask extends React.Component {

  connect = (e) => {   
    this.props.analytics.callTrack("trackClickImportAccount", "metamask");

    var web3Service = web3Package.newWeb3Instance()

    if (web3Service === false) {
      this.props.dispatch(throwError(this.props.translate('error.metamask_not_install') || 'Cannot connect to metamask. Please make sure you have metamask installed'))
      return
    }

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
