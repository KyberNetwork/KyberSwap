import React from "react"
import { connect } from "react-redux"
import { ImportByPKeyView } from "../../components/ImportAccount"
import { importNewAccount, throwError, pKeyChange, throwPKeyError, openPkeyModal, closePkeyModal } from "../../actions/accountActions"
import { addressFromPrivateKey } from "../../utils/keys"
import { getTranslate } from 'react-localize-redux'

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
    translate: getTranslate(store.locale)
  }
})

export default class ImportByPrivateKey extends React.Component {

  openModal() {
    this.props.dispatch(openPkeyModal());
  }

  closeModal() {
    this.props.dispatch(closePkeyModal());    
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
      this.props.dispatch(importNewAccount(address,
        "privateKey",
        privateKey,
        this.props.ethereum,
        this.props.tokens))
    }
    catch (e) {
      console.log(e)
      this.props.dispatch(throwPKeyError(this.props.translate("error.invalid_private_key") || 'Invalid private key'))
    }

  }

  render() {
    return (
      <ImportByPKeyView
        importPrivateKey={this.importPrivateKey.bind(this)}
        modalOpen={this.openModal.bind(this)}
        onRequestClose={this.closeModal.bind(this)}
        isOpen={this.props.account.pKey.modalOpen}
        onChange={this.inputChange.bind(this)}
        pKeyError={this.props.account.pKey.error}
        translate={this.props.translate}
      />
    )
  }
}
