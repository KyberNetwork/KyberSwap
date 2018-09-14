import React from "react"
import { connect } from "react-redux"
import {  ImportAccountView, LandingPage } from '../../components/ImportAccount'
import {
  ImportKeystore, ImportByDevice, ImportByPrivateKey,
  ErrorModal, ImportByMetamask,
  ImportByDeviceWithLedger, ImportByDeviceWithTrezor
} from "../ImportAccount"
import { setIsAndroid, setIsIos } from "../../actions/globalActions"
import { getTranslate } from 'react-localize-redux'
import { importAccountMetamask } from "../../actions/accountActions"
import BLOCKCHAIN_INFO from "../../../../env"
import Web3Service from "../../services/web3"

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
    global: store.global
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
    var swapPage = document.getElementById("swap-app");
    swapPage.className = swapPage.className === "" ? "no-min-height" : swapPage.className + " no-min-height";

    var web3Service = new Web3Service();

    if (!web3Service.isHaveWeb3()) {
      if (isMobile.iOS()) {
        this.props.dispatch(setIsIos(true));
      } else if (isMobile.Android()) {
        this.props.dispatch(setIsAndroid(true));
      }
    }

    if (this.props.termOfServiceAccepted){
      if (web3Service.isHaveWeb3()) {
        var walletType = web3Service.getWalletType()
        if (walletType !== "metamask") {
          this.props.dispatch(importAccountMetamask(web3Service, BLOCKCHAIN_INFO.networkId,
          this.props.ethereum, this.props.tokens, this.props.screen, this.props.translate, walletType))
        }
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
    var content;

    if (!this.props.termOfServiceAccepted) {
      content = <LandingPage translate={this.props.translate} tradeType={this.props.tradeType}/>
    } else {
      if (this.props.global.isIos){
        content = this.getAppDownloadHtml("https://itunes.apple.com/us/app/coinbase-wallet/id1278383455?mt=8");
      } else if (this.props.global.isAndroid) {
        content = this.getAppDownloadHtml("https://play.google.com/store/apps/details?id=org.toshi&hl=en");
      } else {
        content = (
          <ImportAccountView
            firstKey={<ImportByMetamask />}
            secondKey={<ImportKeystore />}
            thirdKey={<ImportByDeviceWithTrezor />}
            fourthKey={<ImportByDeviceWithLedger />}
            fifthKey={<ImportByPrivateKey />}
            errorModal={<ErrorModal />}
            translate={this.props.translate}
            isChangingWallet = {this.props.isChangingWallet}
            closeChangeWallet = {this.props.closeChangeWallet}
          />
        )
      }
    }

    return (
      <div id="landing_page">{content}</div>
    )
  }
}
