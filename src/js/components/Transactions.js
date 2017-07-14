import React from "react"
import { connect } from "react-redux"
import * as _ from "underscore"

import TransactionCom from "./TransactionCom"


@connect((store) => {
  var nonceToTxs= {}
  var sortedTxs = _.sortBy(store.txs, (tx) => {
    return tx.status + "-" + tx.nonce + "-" + tx.hash
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
    <div class="k-page k-page-transaction">
      <div>
        <table class="unstriped" id="transaction-list">
          <thead>
            <tr>
              <th>Hash</th>
              <th>From</th>
              <th width="200">Broadcasted</th>
              <th>Nonce</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {txs}
          </tbody>
        </table>
      </div>
    </div>)
  }
}
