import React from "react"
import { connect } from "react-redux"
import * as _ from "underscore"

import TransactionCom from "./TransactionCom"


@connect((store) => {
  var nonceToTxs= {}
  var sortedTxs = _.sortBy(store.txs, (tx) => {
    return tx.nonce + "-" + tx.hash
  }).reverse()
  return {
    txs: sortedTxs
  }
})
export default class Transactions extends React.Component {

  render() {
    var txs = this.props.txs.map((tx) =>
      <TransactionCom key={tx.hash} hash={tx.hash} />
    )
    return (
    <div>
      {txs}
    </div>)
  }
}
