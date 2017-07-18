import React from "react"
import { connect } from "react-redux"

import JoinPaymentForm from "./Payment/JoinPaymentForm"
import PaymentForm from "./Payment/PaymentForm"
import ExchangeRates from "./ExchangeRates"


@connect((state, props) => {
  var addresses = Object.keys(state.accounts.accounts)
  var account
  if (addresses.length > 0) {
    account = state.accounts.accounts[addresses[0]]
  }
  return { account }
})
export default class Payment extends React.Component {
  render() {
    var account = this.props.account
    if (account) {
      if (account.joined) {
        <h2>Exchange Rates</h2>
        return (
        <div>
          <PaymentForm passphraseID="payment-passphrase" address={account.address} />
          <ExchangeRates />
        </div>
        )
      } else {
        return <JoinPaymentForm passphraseID="join-payment-passphrase" />
      }
    } else {
      return <div>You haven't imported any account yet</div>
    }
  }
}
