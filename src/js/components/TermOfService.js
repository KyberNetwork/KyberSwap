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

  render() {
    return (
    <div>
      <h2>KyberWallet term of service</h2>
      <p>Term of service body</p>
      <button class="button" onClick={this.acceptTOS}>Accept</button>
    </div>)
  }
}
