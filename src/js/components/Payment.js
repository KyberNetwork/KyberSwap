import React from "react"
import { connect } from "react-redux"

import JoinPaymentForm from "./Payment/JoinPaymentForm"
import PaymentForm from "./Payment/PaymentForm"
import ExchangeRates from "./ExchangeRates"


@connect((state, props) => {
  var address = "0x001adbc838ede392b5b054a47f8b8c28f2fa9f3f"
  const account = state.accounts.accounts[address]
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
        return <JoinPaymentForm address={account.address} passphraseID="join-payment-passphrase" />
      }
    } else {
      return <div>You haven't imported any account yet</div>
    }
  }
}
