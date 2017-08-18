import React from "react"
import { connect } from "react-redux"
//import { Link } from 'react-router-dom'


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
  stopParentClick(event){
    event.stopPropagation();
  }
  render() {
    return (
    <tr class="item" onClick={this.props.click}>
      <td class="hash">
         <a target="_blank" href={"https://kovan.etherscan.io/tx/" + this.props.hash} onClick={this.stopParentClick.bind(this)}>
            {this.props.hash}
          </a>
      </td>
      <td class="from"><span>{this.props.from}</span></td>
      <td></td>
      <td>{this.props.nonce}</td>
      <td>{this.props.type}</td>
      <td><span class={this.props.status == "mined" || this.props.status == "success" ? "success" : "fail"}>{this.props.status}</span></td>
    </tr>)
  }
}
