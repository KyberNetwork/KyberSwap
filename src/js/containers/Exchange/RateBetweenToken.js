
import React from "react"
import { connect } from "react-redux"
import { roundingNumber } from "../../utils/converter"
import * as actions from "../../actions/exchangeActions"
import { getTranslate } from 'react-localize-redux';
import * as converter from '../../utils/converter'
import * as constants from '../../services/constants'
import ReactTooltip from 'react-tooltip'

@connect((store, props) => {

  var tokens = store.tokens.tokens
  var exchange = store.exchange
  var rateEthUsd = tokens.ETH.rateUSD
  // var sourceToken = props.exchangeRate.sourceToken
  
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
    if (this.props.exchange.isSelectToken) {
      return (
        <div className={"token-compare__item"}>
          1 {this.props.exchange.sourceTokenSymbol} = <img src={require('../../../assets/img/waiting-white.svg')} /> {this.props.exchange.destTokenSymbol}
        </div>
      )
    }
    var expectedRate = converter.toT(this.props.exchange.offeredRate)
    var tokens = this.props.tokens
    var sourceToken = this.props.exchange.sourceTokenSymbol
    var destToken = this.props.exchange.destTokenSymbol
    
    var change = this.props.exchange.percentChange
    if (change == 0) {
      return (<div className={"token-compare__item"}>
        1 {this.props.exchange.sourceTokenSymbol} = {roundingNumber(expectedRate)} {this.props.exchange.destTokenSymbol}
      </div>)
    }
    return (
      <div className={"token-compare__item"}>
        <span>
          1 {this.props.exchange.sourceTokenSymbol} = {roundingNumber(expectedRate)} {this.props.exchange.destTokenSymbol} 
        </span>
        <span className="token-compare__change">
          {change}% 
        </span>        
        <span className="token-compare__tooltip" data-html={true} data-tip={`<p>Price is dependent on your swap value. There is a ${change}% difference in price for the requested quantity and the default ${constants.MIN_AMOUNT_DEFAULT_RATE} ETH quantity</p>`} data-for="info_indicator" currentitem="false">
            <img src={require('../../../assets/img/info_indicator.svg')}/>
        </span>
        <ReactTooltip place="top" offset={{left:95}} id="info_indicator" type="light" html={true}/>
      </div>
    )
  }

  render = () => {
    //var tokenRate = this.props.isSelectToken ? <img src={require('../../../assets/img/waiting-white.svg')} /> : roundingNumber(this.props.exchangeRate.rate)
    return (
      <div class="token-compare">
        {/* <div className={"token-compare__item"}>
          1 {this.props.exchangeRate.sourceToken} = {tokenRate} {this.props.exchangeRate.destToken}
        </div> */}
        {this.compareRate()}
        {this.props.rateUSD != 0 &&
          <div>
            {/* <span className={"token-compare__separator"}>|</span> */}
            <span className={"token-compare__item"}>
              1 {this.props.exchange.sourceTokenSymbol} = {converter.roundingNumber(this.props.rateUSD)} USD
            </span>
          </div>
        }
      </div>
    )
  }
}
