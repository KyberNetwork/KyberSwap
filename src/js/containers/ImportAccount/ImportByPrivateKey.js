import React from "react"
import { connect } from "react-redux"
//import { push } from 'react-router-redux'
//import { DropFile } from "../../components/ImportAccount"
import { importNewAccount, throwError } from "../../actions/accountActions"
//import { verifyKey, anyErrors } from "../../utils/validators"
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

  importPrivateKey = () => {
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
      <div>
        <textarea id="private_key"></textarea>
        <button onClick={this.importPrivateKey}>Import private key</button>
      </div>      
    )
  }
}
