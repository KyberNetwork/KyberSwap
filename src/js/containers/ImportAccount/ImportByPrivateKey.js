import React from "react"
import { connect } from "react-redux"
import { ImportByPKeyView } from "../../components/ImportAccount"
import {
  importNewAccount,
  pKeyChange,
  throwPKeyError,
  openPkeyModal,
  closePkeyModal,
  closeOtherConnectModal
} from "../../actions/accountActions"
import { addressFromPrivateKey } from "../../utils/keys"
import { getTranslate } from 'react-localize-redux'

@connect((store) => {
  return {
    account: store.account,
    ethereum: store.connection.ethereum,
    translate: getTranslate(store.locale),
    analytics: store.global.analytics
  }
})

export default class ImportByPrivateKey extends React.Component {
  openModal() {
    this.props.dispatch(openPkeyModal());
    this.props.analytics.callTrack("trackClickImportAccount", "private_key", this.props.tradeType);
  }

  closeModal() {
    this.props.dispatch(closePkeyModal());
    this.props.analytics.callTrack("trackClickCloseModal", "import private-key");
  }

  inputChange(e) {
    var value = e.target.value
    this.props.dispatch(pKeyChange(value));
  }

  importPrivateKey(privateKey) {
    try {
      if (privateKey.match(/^0[x | X].{3,}$/)) {
          privateKey = privateKey.substring(2)
      }    
      let address = addressFromPrivateKey(privateKey)
      
      this.props.dispatch(closePkeyModal());
      this.props.dispatch(closeOtherConnectModal());
  
      this.props.dispatch(importNewAccount(
        address,
        "privateKey",
        privateKey,
        this.props.ethereum,
        null,
        null,
        "Private Key"
      ))
    } catch (e) {
      console.log(e)
      this.props.dispatch(throwPKeyError(this.props.translate("error.invalid_private_key") || 'Invalid private key'))
    }
  }

render() {
    return (
      <ImportByPKeyView
        isOnMobile={this.props.isOnMobile}
        importPrivateKey={this.importPrivateKey.bind(this)}
        modalOpen={this.openModal.bind(this)}
        onRequestClose={this.closeModal.bind(this)}
        isOpen={this.props.account.pKey.modalOpen}
        onChange={this.inputChange.bind(this)}
        pKeyError={this.props.account.pKey.error}
        translate={this.props.translate}
        analytics={this.props.analytics}
        {...(this.props.closeParentModal && {
          closeParentModal: this.props.closeParentModal
        })}
      />
    )
  }
}
