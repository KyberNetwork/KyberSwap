import React from "react"
import { connect } from "react-redux"
import { roundingRateNumber, convertBuyRate } from "../../utils/converter"
import { getTranslate } from 'react-localize-redux';
import * as converter from '../../utils/converter'
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
    exchange, theme: store.global.theme
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
            1 {destToken} =<span className="rate-loading"> <img src={require(`../../../assets/img/${this.props.theme === 'dark' ? 'waiting-black' : 'waiting-white'}.svg`)} /></span> ETH
          </div>
        )
      }

      return (
        <div className={"token-compare__item"}>
          1 {sourceToken} =<span className="rate-loading"> <img src={require(`../../../assets/img/${this.props.theme === 'dark' ? 'waiting-black' : 'waiting-white'}.svg`)} /></span> {this.props.exchange.destTokenSymbol}
        </div>
      )
    }

    var expectedRate = converter.toT(this.props.exchange.expectedRate)
    var change = this.props.exchange.percentChange
    var rateUSD = !!parseFloat(this.props.rateUSD) ? parseFloat(this.props.rateUSD) : 0
    let tokenRateText;

    if (isSourceTokenETH) {
      const tokenETHBuyRate = this.props.exchange.expectedRate ? convertBuyRate(this.props.exchange.expectedRate) : 0;
      const tokenUSDBuyRate = tokenETHBuyRate * this.props.rateEthUsd;

      tokenRateText = <span>1 {destToken} = {roundingRateNumber(tokenETHBuyRate)} ETH {tokenUSDBuyRate ? `= ${tokenUSDBuyRate.toFixed(3)} USD` : ""}</span>
    } else {
      
      if(rateUSD != 0 && expectedRate != 0){
        rateUSD = rateUSD*(100-change)/100
      }else{
        rateUSD = 0
      }
      tokenRateText = <span>1 {sourceToken} = {roundingRateNumber(expectedRate)} {this.props.exchange.destTokenSymbol} {rateUSD != 0 ? `= ${rateUSD.toFixed(3)} USD` : ""}</span>
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
        <span
          className="token-compare__tooltip"
          data-html={true}
          data-tip={`
            <div class="info-indicator">
              <div class="info-indicator__text">There is a ${change}% difference between the estimated price for your swap amount and the reference price.</div>
              <div class="info-indicator__note">Note: Estimated price depends on your swap amount. Reference price is from Chainlink and Kyber Network.</div>
            </div>
          `}
          data-for="info_indicator"
          currentitem="false"
        >
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
