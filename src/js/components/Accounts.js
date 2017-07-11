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
        <div key={addr} >
          <AccountDetail address={addr} />
          <br/>
        </div>
      )
    })
    return (
      <div>
        <h2>Accounts</h2>
        {accDetails}
      </div>
    )
  }
}
