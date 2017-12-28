
import React from "react"
import { connect } from "react-redux"
import { roundingNumber } from "../../utils/converter"

@connect((store, props) => {
  return props
})

export default class RateBetweenToken extends React.Component {
  render = () => {
    var tokenRate = this.props.isSelectToken ? <img src={require('../../../assets/img/waiting-white.svg')} /> : roundingNumber(this.props.exchangeRate.rate)
    return (
      <p class="token-compare" title={tokenRate}>
        1 {this.props.exchangeRate.sourceToken} = {tokenRate} {this.props.exchangeRate.destToken}
      </p>
    )
  }
}