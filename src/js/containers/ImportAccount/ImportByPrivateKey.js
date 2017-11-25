import React from "react"
import { connect } from "react-redux"
import { ImportByPKeyView } from "../../components/ImportAccount"
import { importNewAccount, throwError, pKeyChange, throwPKeyError, openPkeyModal, closePkeyModal } from "../../actions/accountActions"
import { addressFromPrivateKey, getRandomAvatar } from "../../utils/keys"

@connect((store) => {
  var tokens = store.tokens.tokens
  var supportTokens = []
  Object.keys(tokens).forEach((key) => {
    supportTokens.push(tokens[key])
  })
  return {
    account: store.account,
    ethereum: store.connection.ethereum,
    tokens: supportTokens
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
    console.log(privateKey)
    try {
      let address = addressFromPrivateKey(privateKey)
      this.props.dispatch(importNewAccount(address,
        "privateKey",
        privateKey,
        this.props.ethereum,
        getRandomAvatar(address),
        this.props.tokens))
    }
    catch (e) {
      this.props.dispatch(throwPKeyError('Invalid private key'))
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
      />
    )
  }
}
