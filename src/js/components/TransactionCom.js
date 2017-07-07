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
    source: tx.source,
    sourceAmount: tx.sourceAmount,
    dest: tx.dest,
    minConversionRate: tx.minConversionRate,
    recipient: tx.recipient,
    maxDestAmount: tx.maxDestAmount,
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
      <p>Source: {this.props.source}</p>
      <p>SourceAmount: {this.props.sourceAmount}</p>
      <p>Dest: {this.props.dest}</p>
      <p>MinConversionRate: {this.props.minConversionRate}</p>
      <p>Recipient: {this.props.recipient}</p>
      <p>MaxDestAmount: {this.props.maxDestAmount}</p>
    </div>)
  }
}
