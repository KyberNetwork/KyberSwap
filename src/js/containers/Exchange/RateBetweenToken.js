import React from "react"
import { connect } from "react-redux"
import { roundingNumber, convertBuyRate } from "../../utils/converter"
import * as actions from "../../actions/exchangeActions"
import { getTranslate } from 'react-localize-redux';
import * as converter from '../../utils/converter'
import * as constants from '../../services/constants'
import ReactTooltip from 'react-tooltip'

@connect((store, props) => {
  var tokens = store.tokens.tokens
  var exchange = store.exchange
  var rateEthUsd = tokens.ETH.rateUSD

  var rateUSD = 0
  if (exchange.sourceTokenSymbol === "ETH") {
    rateUSD = tokens[exchange.sourceTokenSymbol].rateUSD
  } else {
    var rateTokenETH = converter.toT(tokens[exchange.sourceTokenSymbol].rate, 18)
    rateUSD = rateTokenETH * rateEthUsd
  }

  return {
    ...props,
    translate: getTranslate(store.locale), rateEthUsd, rateUSD, tokens,
    exchange
  }
})

export default class RateBetweenToken extends React.Component {
  compareRate = () => {
    const sourceToken = this.props.exchange.sourceTokenSymbol
    const destToken = this.props.exchange.destTokenSymbol
    const isSourceTokenETH = sourceToken === "ETH";

    if (this.props.exchange.isSelectToken) {
      if (isSourceTokenETH) {
        return (
          <div className={"token-compare__item"}>
            1 {destToken} =<span className="rate-loading"> <img src={require('../../../assets/img/waiting-white.svg')} /></span> ETH
          </div>
        )
      }

      return (
        <div className={"token-compare__item"}>
          1 {sourceToken} =<span className="rate-loading"> <img src={require('../../../assets/img/waiting-white.svg')} /></span> {this.props.exchange.destTokenSymbol}
        </div>
      )
    }

    var expectedRate = converter.toT(this.props.exchange.offeredRate)
    var tokens = this.props.tokens
    var change = this.props.exchange.percentChange
    var rateUSD = !!parseFloat(this.props.rateUSD) ? parseFloat(this.props.rateUSD) : 0
    let tokenRateText;

    if (isSourceTokenETH && this.props.exchange.offeredRate) {
      const tokenETHBuyRate = convertBuyRate(this.props.exchange.offeredRate);
      const tokenUSDBuyRate = tokenETHBuyRate * this.props.rateEthUsd;

      tokenRateText = <span>1 {destToken} = {roundingNumber(tokenETHBuyRate)} ETH {tokenUSDBuyRate ? `= ${tokenUSDBuyRate.toFixed(3)} USD` : ""}</span>
    } else {
      tokenRateText = <span>1 {sourceToken} = {roundingNumber(expectedRate)} {this.props.exchange.destTokenSymbol} {rateUSD != 0 ? `= ${rateUSD.toFixed(3)} USD` : ""}</span>
    }

    if (change == 0) {
      return (<div className={"token-compare__item"}>{tokenRateText}</div>)
    }

    return (
      <div className={"token-compare__item"}>
        <span>{tokenRateText}</span>
        <span className={"token-compare__change change-negative"}>
          {change}%
          <img src={require('../../../assets/img/v3/arrow-down-red.svg')}/>
        </span>
        <span className="token-compare__tooltip" data-html={true} data-tip={`<p>Price is dependent on your swap value. There is a ${change}% difference in price for the requested quantity and the default ${constants.MIN_AMOUNT_DEFAULT_RATE} ETH quantity</p>`} data-for="info_indicator" currentitem="false">
            <img src={require('../../../assets/img/common/blue-indicator.svg')}/>
        </span>
        <ReactTooltip place="top" offset={{left:95}} id="info_indicator" className={"common-tooltip"} type="light" html={true}/>
      </div>
    )
  }

  render = () => {
    return (
      <div class="exchange-rate">
        {this.compareRate()}
      </div>
    )
  }
}
