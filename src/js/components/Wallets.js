import React from "react"
import { connect } from "react-redux"

import WalletDetail from "./WalletDetail"


@connect((store) => {
  return {
    wallets: store.wallets.wallets,
  }
})
export default class Wallets extends React.Component {
  render() {
    var wallets = this.props.wallets
    var walletDetails = Object.keys(wallets).map((addr) => {
      return (
        <div key={addr} >
          <WalletDetail address={addr} />
          <br/>
        </div>
      )
    })
    return (
      <div>
        <h2>Wallets</h2>
        {walletDetails}
      </div>
    )
  }
}
