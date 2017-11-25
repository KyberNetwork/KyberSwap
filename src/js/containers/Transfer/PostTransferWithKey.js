
import React from "react"
import { PostTransfer } from "../Transfer"
import { KeyStore, Trezor, Ledger, PrivateKey, Metamask } from "../../services/keys"
import { connect } from "react-redux"

@connect((store) => {
  var account = store.account.account
  var keyService
  switch (account.type) {
    case "keystore":
      keyService = new KeyStore()
      break
    case "privateKey":
      keyService = new PrivateKey()
      break
    case "trezor":
      keyService = new Trezor()
      break
    case "ledger":
      keyService = new Ledger()
      break
    case "metamask":
      keyService = new Metamask()
      break
    default:
      keyService = new KeyStore()
      break
  }
  return {
    keyService: keyService
  }
})

export default class PostTransferWithKey extends React.Component {
  render = () => {
    return <PostTransfer keyService={this.props.keyService} />
  }
}