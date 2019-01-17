import React from "react"
import { connect } from "react-redux"
import { roundingNumber } from "../../utils/converter"
import * as actions from "../../actions/exchangeActions"
import { getTranslate } from 'react-localize-redux';
import * as converter from '../../utils/converter'

@connect((store, props) => {
  var rateEthUsd = store.tokens.tokens.ETH.rateUSD
  var sourceToken = props.exchangeRate.sourceToken
  var tokens = store.tokens.tokens
  var rateUSD = 0

  if (sourceToken === "ETH") {
    rateUSD = tokens[sourceToken].rateUSD    
  } else {
    var rateTokenETH = converter.toT(tokens[sourceToken].rate, 18)
    rateUSD = rateTokenETH * rateEthUsd
  }

  return {...props, translate: getTranslate(store.locale), rateEthUsd, rateUSD}
})

export default class RateBetweenToken extends React.Component {
  render = () => {
    var tokenRate = this.props.isSelectToken ? "Loading..." : roundingNumber(this.props.exchangeRate.rate)
    return (
      <div class="exchange-rate">
        {/* <span className="exchange-rate__unit">{this.props.exchangeRate.sourceToken}</span>
        <span className="exchange-rate__amount">1</span>
        <span className="exchange-rate__equal">=</span>
        <span className="exchange-rate__unit">{this.props.exchangeRate.destToken}</span>
        <span className="exchange-rate__amount">{tokenRate}</span>
        {this.props.rateUSD != 0 &&
          <span>
            <span className="exchange-rate__bracket">(</span>
            <span className="exchange-rate__unit">USD</span>
            <span className="exchange-rate__amount">{converter.roundingNumber(this.props.rateUSD)}</span>
            <span className="exchange-rate__bracket">)</span>
          </span>
        } */}
        <span>1 {this.props.exchangeRate.sourceToken} = {tokenRate} {this.props.exchangeRate.destToken} = {converter.roundingNumber(this.props.rateUSD)} USD</span>
      </div>
    )
  }
}
