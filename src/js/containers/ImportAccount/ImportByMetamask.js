import React from "react"
import { connect } from "react-redux"
import { importAccountMetamask, throwError } from "../../actions/accountActions"
import { ImportByMetamaskView } from "../../components/ImportAccount"
import BLOCKCHAIN_INFO from "../../../../env"
import Web3Service from "../../services/web3"

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

export default class ImportByMetamask extends React.Component {

  connect = (e) => {
    if (typeof web3 === "undefined") {
      this.props.dispatch(throwError('Cannot connect to metamask'))
      return
    }
    var web3Service = new Web3Service(web3)
    this.dispatchAccMetamask(web3Service);
  }

  dispatchAccMetamask(web3Service){
    this.props.dispatch(importAccountMetamask(web3Service, BLOCKCHAIN_INFO.networkId,
      this.props.ethereum, this.props.tokens))
  }

  render() {
    return (
      <ImportByMetamaskView 
        connect={this.connect}
      />
    )
  }
}
