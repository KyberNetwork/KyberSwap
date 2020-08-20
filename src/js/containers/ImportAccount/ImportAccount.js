import React from "react"
import { connect } from "react-redux"
import { ImportAccountView } from '../../components/ImportAccount'
import { ErrorModal } from "../ImportAccount"
import { setOnMobile } from "../../actions/globalActions"
import { getTranslate } from 'react-localize-redux'
import {closeOtherConnectModal, importAccountMetamask, setOnDAPP} from "../../actions/accountActions"
import BLOCKCHAIN_INFO from "../../../../env"
import * as web3Package from "../../services/web3"
import { isMobile } from '../../utils/common'
import EthereumService from "../../services/ethereum/ethereum";
import { isUserLogin } from "../../utils/common";

@connect((store) => {
  return {
    ...store.account,
    translate: getTranslate(store.locale),
    ethereum: store.connection.ethereum,
    global: store.global,
    onMobile: store.global.onMobile
  }
})
export default class ImportAccount extends React.Component {
  componentDidMount = () => {
    var swapPage = document.getElementById("swap-app")
    swapPage.className = swapPage.className === "" ? "no-min-height" : swapPage.className + " no-min-height"

    var web3Service = web3Package.newWeb3Instance()
    if (web3Service !== false) {
      const walletType = web3Service.getWalletType();
      const isDapp = (walletType !== "metamask") && (walletType !== "modern_metamask");
      if (isDapp) {
        this.props.dispatch(setOnDAPP());
        
        setTimeout(()=>{
          const ethereumService = this.props.ethereum ? this.props.ethereum : new EthereumService();
          this.props.dispatch(importAccountMetamask(web3Service, BLOCKCHAIN_INFO.networkId,
            ethereumService, this.props.translate, walletType))
        }, 1000)
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
  
  closeModal() {
    this.props.dispatch(closeOtherConnectModal());
  }

  acceptTerm = () => {
    if (this.props.isOnDAPP) {
      var web3Service = web3Package.newWeb3Instance()
      const walletType = web3Service.getWalletType();
      const ethereumService = this.props.ethereum ? this.props.ethereum : new EthereumService();

      this.props.dispatch(importAccountMetamask(web3Service, BLOCKCHAIN_INFO.networkId,
        ethereumService, this.props.translate, walletType))
    } else {
      this.props.acceptTerm()
    }
    this.props.global.analytics.callTrack("acceptTerm")
  };
  
  viewKyberSwapApp = (os) => {
    this.props.global.analytics.callTrack("trackViewingKyberSwapApp", os)
  };

  render() {
    return (
      <div id={"import-account"}>
        {(!this.props.account && !this.props.isAgreedTermOfService) &&
          <div className={"exchange-content__accept-term"}>
            <div className={"accept-button theme__button"} onClick={this.acceptTerm}>
              {this.props.translate("import.connect_wallet") || "Connect Wallet"}
            </div>
          </div>
        }
        {(!this.props.isOnDAPP && this.props.isAgreedTermOfService) && (
          <ImportAccountView
            isAgreedTermOfService={this.props.isAgreedTermOfService}
            errorModal={<ErrorModal />}
            closeModal={this.closeModal.bind(this)}
            translate={this.props.translate}
            onMobile={this.props.onMobile}
            tradeType={this.props.tradeType}
            isUserLogin={isUserLogin()}
            viewKyberSwapApp={this.viewKyberSwapApp}
          />
        )}
      </div>
    )
  }
}
