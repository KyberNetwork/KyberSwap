import React from "react"
import { connect } from "react-redux"
import { closeOtherConnectModal } from "../../actions/accountActions"
import { getTranslate } from 'react-localize-redux'
import * as common from "../../utils/common"
import { Modal } from '../../components/CommonElement'
import { QRCode } from "../CommonElements";

import {
  ImportByPrivateKey,
  ImportByWalletLink,
  ImportByWalletConnect,
} from "../../containers/ImportAccount";

@connect((store) => {
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
    analytics: store.global.analytics,
    global: store.global
  }
})
export default class ImportByOtherConnectModal extends React.Component {
  constructor(){
    super()
  }

  closeModal() {
    this.props.dispatch(closeOtherConnectModal());
  }

  render() {
    const isOnMobile = this.props.global.onMobile.isIOS || this.props.global.onMobile.isAndroid;
    return (
      <div>
        <Modal
          className={{ base: 'reveal medium promocode', afterOpen: 'reveal medium import-promocode' }}
          isOpen={this.props.account.otherConnect.modalOpen}
          onRequestClose={this.closeModal.bind(this)}
          content={
            <div>
              {/*<div className="title">*/}
              {/*  {this.props.translate("import.promo_code") || "Promocode"}*/}
              {/*</div>*/}
              {/*<a className="x" onClick={this.closeModal.bind(this)}>*/}
              {/*  <img src={require("../../../assets/img/v3/Close-3.svg")} />*/}
              {/*</a>*/}
              <div className="content with-overlap theme__background-2">
                <div className="title">
                  {this.props.translate("import.connect_other_wallet") || "Connect other wallet"}
                </div>
                <div className={`import-account__content ${isOnMobile ? ' import-account__content--mobile' : ''}`}>
                  <div className={`import-account__item large`}>
                    <ImportByPrivateKey isOnMobile={isOnMobile} closeParentModal={this.closeModal.bind(this)} />
                  </div>

                  <div className={`import-account__item large import-account__item-walletlink`}>
                    <ImportByWalletLink closeParentModal={this.closeModal.bind(this)} />
                  </div>

                  <div className={`import-account__item large import-account__item-walletconnect`}>
                    <ImportByWalletConnect closeParentModal={this.closeModal.bind(this)} />
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </div>
    )
  }
}
