import React from "react"
import { connect } from "react-redux"
import {  ImportAccountView, LandingPage } from '../../components/ImportAccount'
import {
  ImportKeystore, ImportByDevice, ImportByPrivateKey,
  ErrorModal, ImportByMetamask,
  ImportByDeviceWithLedger, ImportByDeviceWithTrezor, ImportByPromoCode
} from "../ImportAccount"
import { setIsAndroid, setIsIos } from "../../actions/globalActions"
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
  constructor() {
    super()
    this.state = {
      isOpen: false
    }
  }

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

  getAppDownloadHtml(downloadLink) {
    return (<div className="download-mobile">
      <div className="mobile-left">
        <div className="mobile-icon"></div>
        <div className="mobile-content">
          <div className="mobile-title">Coinbase Wallet</div>
          <div className="mobile-desc">Ethereum Wallet & DApp Browser</div>
        </div>
      </div>
      <a href={downloadLink} className="mobile-btn" target="_blank">
        {this.props.translate("download") || "Download"}
      </a>
    </div>)
  }

  render() {
    {/*<LandingPage translate={this.props.translate} tradeType={this.props.tradeType}/>*/}
    return (
      <ImportAccountView
        metamaskImport={<ImportByMetamask/>}
        keystoreImport={<ImportKeystore/>}
        trezorImport={<ImportByDeviceWithTrezor/>}
        ledgerImport={<ImportByDeviceWithLedger/>}
        privateKeyImport={<ImportByPrivateKey/>}
        promoCodeImport = {<ImportByPromoCode/>}
        errorModal={<ErrorModal/>}
        translate={this.props.translate}
        onMobile={this.props.onMobile}
      />
    )
  }
}
