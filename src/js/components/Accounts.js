import React from "react"
import { connect } from "react-redux"

import AccountDetail from "./AccountDetail"


@connect((store) => {
  return {
    accounts: store.accounts.accounts,
  }
})
export default class Wallets extends React.Component {
  render() {
    var accounts = this.props.accounts
    var accDetails = Object.keys(accounts).map((addr) => {
      return (
        <AccountDetail key={addr} address={addr} />
      )
    })
    return (
      <div class="k-page k-page-account">
        <div id="wallet-list">
          {accDetails}
        </div>
        <div class="import-wallet">
          <button id="import" class="k-tooltip">
            +<span class="k-tooltip-content down-arrow">Import Wallet</span>
          </button>
        </div>
      </div>
    )
  }
}
