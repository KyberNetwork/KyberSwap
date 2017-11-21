import React from "react"
import { connect } from "react-redux"
import { ImportByPKeyView } from "../../components/ImportAccount"
import { importNewAccount, throwError } from "../../actions/accountActions"
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

  constructor(props) {
    super(props)
    this.state = {
      modalOpen: false
    }
  }

  openModal() {
    this.setState({
      modalOpen: true,
    })
  }

  closeModal() {
    this.setState({
      modalOpen: false,
    })
  }

  importPrivateKey() {
    const privateKey = document.getElementById("private_key").value
    const address = addressFromPrivateKey(privateKey)
    this.props.dispatch(importNewAccount(address,
      "privateKey",
      privateKey,
      this.props.ethereum,
      getRandomAvatar(address),
      this.props.tokens))
  }

  render() {
    return (
      <ImportByPKeyView
        importPrivateKey={this.importPrivateKey.bind(this)}
        modalOpen={this.openModal.bind(this)}
        onRequestClose={this.closeModal.bind(this)}
        isOpen={this.state.modalOpen}
      />
    )
  }
}
