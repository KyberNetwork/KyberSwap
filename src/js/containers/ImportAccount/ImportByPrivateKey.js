import React from "react"
import { connect } from "react-redux"
import { ImportByPKeyView } from "../../components/ImportAccount"
import { importNewAccount, throwError, pKeyChange, throwPKeyError } from "../../actions/accountActions"
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

  inputChange = (e) => {
    var value = e.target.value
    this.props.dispatch(pKeyChange(value));
  }

  importPrivateKey() {
    const privateKey = document.getElementById("private_key").value
    try {
      let address = addressFromPrivateKey(privateKey)
      this.props.dispatch(importNewAccount(address,
        "privateKey",
        privateKey,
        this.props.ethereum,
        getRandomAvatar(address),
        this.props.tokens))
    } 
    catch(e){
      console.log(e)
      this.props.dispatch(throwPKeyError(e.message))
    }
    
  }

  render() {
    return (
      <ImportByPKeyView
        importPrivateKey={this.importPrivateKey.bind(this)}
        modalOpen={this.openModal.bind(this)}
        onRequestClose={this.closeModal.bind(this)}
        isOpen={this.state.modalOpen}
        onChange={this.inputChange}
        pKeyError={this.props.account.pKeyError}
      />
    )
  }
}
