import React from "react"
import { connect } from "react-redux"
import {  ImportAccountView, LandingPage } from '../../components/ImportAccount'
import {
  ImportKeystore, ImportByDevice, ImportByPrivateKey,
  ErrorModal, ImportByMetamask,
  ImportByDeviceWithLedger, ImportByDeviceWithTrezor, ImportByPromoCode
} from "../ImportAccount"
import { visitExchange, setOnMobile } from "../../actions/globalActions"
import { getTranslate } from 'react-localize-redux'
import { importAccountMetamask } from "../../actions/accountActions"
import BLOCKCHAIN_INFO from "../../../../env"
import * as web3Package from "../../services/web3"
import {isMobile} from '../../utils/common'

@connect((store, props) => {
  var tokens = store.tokens.tokens
  var supportTokens = []
  Object.keys(tokens).forEach((key) => {
    supportTokens.push(tokens[key])
  })
  
  return {
    ...store.account,
    translate: getTranslate(store.locale),
    isVisitFirstTime: store.global.isVisitFirstTime,
    translate: getTranslate(store.locale),
    termOfServiceAccepted: store.global.termOfServiceAccepted,
    ethereum: store.connection.ethereum,
    tokens: supportTokens,
    screen: props.screen,
    tradeType: props.tradeType,
    global: store.global,
    onMobile: store.global.onMobile
  }
})

export default class ImportAccount extends React.Component {
  componentDidMount = () => {
    var swapPage = document.getElementById("swap-app")
    swapPage.className = swapPage.className === "" ? "no-min-height" : swapPage.className + " no-min-height"


    var web3Service = web3Package.newWeb3Instance()
    
    var web3Service = web3Package.newWeb3Instance()
    if (this.props.termOfServiceAccepted){
      if (web3Service !== false) {
        var walletType = web3Service.getWalletType()
        
        if ((walletType !== "metamask") && (walletType !== "modern_metamask")) {
          this.props.dispatch(importAccountMetamask(web3Service, BLOCKCHAIN_INFO.networkId,
          this.props.ethereum, this.props.tokens, this.props.screen, this.props.translate, walletType))
        }
      }
    }
    if (web3Service === false) {
      if (isMobile.iOS()) {
        this.props.dispatch(setOnMobile(true, false));
      } else if (isMobile.Android()) {
        this.props.dispatch(setOnMobile(false, true));
      }
    }
  }

  render() {
    return (
      <ImportAccountView
        errorModal={<ErrorModal/>}
        translate={this.props.translate}
        onMobile={this.props.onMobile}
      />
    )
  }
}
