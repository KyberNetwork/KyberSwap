import React from "react"
import { connect } from "react-redux"
import {  ImportAccountView } from '../../components/ImportAccount'
import {
  ImportKeystore, ImportByDevice, ImportByPrivateKey,
  ErrorModal, ImportByMetamask,
  ImportByDeviceWithLedger, ImportByDeviceWithTrezor, ImportByPromoCode
} from "../ImportAccount"
import { visitExchange, setOnMobile } from "../../actions/globalActions"
import { getTranslate } from 'react-localize-redux'
import { importAccountMetamask, setOnDAPP } from "../../actions/accountActions"
import BLOCKCHAIN_INFO from "../../../../env"
import * as web3Package from "../../services/web3"
import {isMobile} from '../../utils/common'
import { TermAndServices } from "../../containers/CommonElements";

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
    onMobile: store.global.onMobile,
    acceptTerm: props.acceptTerm
  }
})

export default class ImportAccount extends React.Component {
  componentDidMount = () => {
    var swapPage = document.getElementById("swap-app")
    swapPage.className = swapPage.className === "" ? "no-min-height" : swapPage.className + " no-min-height"


    // var web3Service = web3Package.newWeb3Instance()
    
    var web3Service = web3Package.newWeb3Instance()
    // if (this.props.termOfServiceAccepted){
    //   if (web3Service !== false) {
    //     var walletType = web3Service.getWalletType()
        
    //     if ((walletType !== "metamask") && (walletType !== "modern_metamask")) {
    //       this.props.dispatch(importAccountMetamask(web3Service, BLOCKCHAIN_INFO.networkId,
    //       this.props.ethereum, this.props.tokens, this.props.screen, this.props.translate, walletType))
    //     }
    //   }
    // }
    if (web3Service === false) {
      if (isMobile.iOS()) {
        this.props.dispatch(setOnMobile(true, false));
      } else if (isMobile.Android()) {
        this.props.dispatch(setOnMobile(false, true));
      }
    }
  }

  acceptTerm = () => {
  
    const web3Service = web3Package.newWeb3Instance();
    if (web3Service !== false) {
      const walletType = web3Service.getWalletType();
      const isDapp = (walletType !== "metamask") && (walletType !== "modern_metamask");

      if (isDapp) {
        const ethereumService = this.props.ethereum ? this.props.ethereum : new EthereumService();

        this.props.dispatch(importAccountMetamask(web3Service, BLOCKCHAIN_INFO.networkId,
          ethereumService, this.props.tokens, this.props.translate, walletType))
        this.props.dispatch(setOnDAPP())
      } else {
        this.props.acceptTerm()
      }
    } else {
      this.props.acceptTerm()
    }
  }

  render() {
    return (
      <div>
        {(!this.props.isAgreedTermOfService && this.props.account === false) &&
          <div className={"exchange-content__accept-term"}>
            <div className={"accept-buttom"} onClick={(e) => this.acceptTerm()}>{this.props.tradeType === "swap" ? "Swap Now" : "Transfer Now"}</div>
            <TermAndServices tradeType={this.props.tradeType}/>
          </div>
        }
        <ImportAccountView
          isAgreedTermOfService={this.props.isAgreedTermOfService}
          errorModal={<ErrorModal/>}
          translate={this.props.translate}
          onMobile={this.props.onMobile}
          tradeType={this.props.tradeType}
        />
      </div>
    )
  }
}
