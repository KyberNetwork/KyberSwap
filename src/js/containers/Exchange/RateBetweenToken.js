
import React from "react"
import { connect } from "react-redux"
import { roundingNumber } from "../../utils/converter"
import * as actions from "../../actions/exchangeActions"

@connect((store, props) => {
  return props
})

export default class RateBetweenToken extends React.Component {

  resetOfferedRate = (e)=>{
    this.props.dispatch(actions.resetOfferedRate())
    this.props.dispatch(actions.caculateAmount())
  }

  render = () => {
    var tokenRate = this.props.isSelectToken ? <img src={require('../../../assets/img/waiting-white.svg')} /> : roundingNumber(this.props.exchangeRate.rate)
    return (
      <p class="token-compare" title="Click to reset rate" onClick={(e) => this.resetOfferedRate(e)}>
        1 {this.props.exchangeRate.sourceToken} = {tokenRate} {this.props.exchangeRate.destToken}
      </p>
    )
  }
}