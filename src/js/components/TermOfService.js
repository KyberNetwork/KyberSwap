import React from "react"
import { connect } from "react-redux"

import { acceptTermOfService } from "../actions/globalActions"


@connect((store) => {
  return {}
})
export default class TermOfService extends React.Component {

  acceptTOS = (event) => {
    event.preventDefault()
    this.props.dispatch(acceptTermOfService())
  }

  declineTOS = (event) => {
    event.preventDefault()
  }

  render() {
    return (
    <div class="term-page">
      <div class="term-wrapper">
      </div>
      <div class="term-content">
        <h2>KyberWallet - Terms of Use</h2>
        <div class="body k-scroll">
          <p>
            Kyber testnet wallet provides a platform for experimenting and understanding
            our exchange and payment services. The current implementation is not
            secure in any way. Using it may cause loss of funds and could compromise
            user privacy. The user bears the sole responsibility for any outcome that
            is using Kyber testnet wallet.
          </p>
          <div class="gap">
          </div>
          <h3 class="warning">
            USE ONLY TESTNET ACCOUNTS!!!
          </h3>
          <h3 class="warning">
            DO NOT USE REAL ETHEREUM ACCOUNTS!!!
          </h3>
        </div>
        <div class="term-btn">
          <button class="decline" onClick={this.acceptTOS}>Accept</button>
        </div>
      </div>
    </div>)
  }
}
