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
      <div>
        <div id="wallet-list">
          {accDetails}
        </div>
      </div>
    )
  }
}
