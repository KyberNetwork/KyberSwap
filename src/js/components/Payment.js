import React from "react"
import { connect } from "react-redux"

import JoinPaymentForm from "./Payment/JoinPaymentForm"
import PaymentForm from "./Payment/PaymentForm"


@connect((state, props) => {
  const account = state.accounts.accounts[props.address]
  return { account }
})
export default class Payment extends React.Component {
  render() {
    var account = this.props.account
    if (account) {
      if (account.joined) {
        return <PaymentForm address={account.address} />
      } else {
        return <JoinPaymentForm address={account.address} passphraseID="join-payment-passphrase" />
      }
    } else {
      return <div>You haven't imported any account yet</div>
    }
  }
}
