
import React from "react"
import { connect } from "react-redux"
import { roundingNumber } from "../../utils/converter"
import * as actions from "../../actions/exchangeActions"
import { getTranslate } from 'react-localize-redux';
import * as converter from '../../utils/converter'
//import ReactTooltip from 'react-tooltip'

@connect((store, props) => {
  var rateEthUsd = store.tokens.tokens.ETH.rateUSD
  var sourceToken = props.exchangeRate.sourceToken
  var tokens = store.tokens.tokens
  var rateUSD = 0
  if (tokens[sourceToken]){
    rateUSD = tokens[sourceToken].rateUSD
  }
  return {...props, translate: getTranslate(store.locale), rateEthUsd, rateUSD}
})

export default class RateBetweenToken extends React.Component {

  // resetMinRate = (e)=>{
  //   this.props.dispatch(actions.resetMinRate())
  //   //this.props.dispatch(actions.caculateAmount())
  // }

  render = () => {
    var tokenRate = this.props.isSelectToken ? <img src={require('../../../assets/img/waiting-white.svg')} /> : roundingNumber(this.props.exchangeRate.rate)
    return (
      <div class="token-compare grid-x">
        <div className="cell large-5">
          1 {this.props.exchangeRate.sourceToken} = {tokenRate} {this.props.exchangeRate.destToken}
        </div>
        <div className="cell large-2 seperator">|</div>
        <div className="cell large-5">

          1 {this.props.exchangeRate.sourceToken} = {converter.roundingNumber(this.props.rateUSD)} USD
        </div>
      </div>
    )
  }
}