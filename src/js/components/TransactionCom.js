import React from "react"
import { connect } from "react-redux"


@connect((store, props) => {
  var tx = store.txs[props.hash]
  return {
    hash: tx.hash,
    from: tx.from,
    gas: tx.gas,
    gasPrice: tx.gasPrice,
    nonce: tx.nonce,
    status: tx.status,
    type: tx.type,
  }
})
export default class TransactionCom extends React.Component {

  render() {
    return (
    <div>
      <p>Hash: {this.props.hash}</p>
      <p>From: {this.props.from}</p>
      <p>Gas: {this.props.gas}</p>
      <p>Gas price: {this.props.gasPrice}</p>
      <p>Nonce: {this.props.nonce}</p>
      <p>Status: {this.props.status}</p>
      <p>Type: {this.props.type}</p>
    </div>)
  }
}
