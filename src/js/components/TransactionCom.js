import React from "react"
import { connect } from "react-redux"
import { Link } from 'react-router-dom'


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
    <tr class="item">
      <td class="from">
        <Link to={"/transactions/" + this.props.hash}>
          {this.props.hash}
        </Link>
      </td>
      <td>{this.props.from}</td>
      <td></td>
      <td>{this.props.nonce}</td>
      <td>{this.props.type}</td>
      <td><span class={this.props.status == "mined" ? "success" : "fail"}>{this.props.status}</span></td>
    </tr>)
  }
}
