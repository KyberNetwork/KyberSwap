
import React from "react"
import { connect } from "react-redux"
import { roundingNumber } from "../../utils/converter"
import * as actions from "../../actions/exchangeActions"
import { getTranslate } from 'react-localize-redux';
import ReactTooltip from 'react-tooltip'

@connect((store, props) => {
  return {...props, translate: getTranslate(store.locale)}
})

export default class RateBetweenToken extends React.Component {

  // resetMinRate = (e)=>{
  //   this.props.dispatch(actions.resetMinRate())
  //   //this.props.dispatch(actions.caculateAmount())
  // }

  render = () => {
    var tokenRate = this.props.isSelectToken ? <img src={require('../../../assets/img/waiting-white.svg')} /> : roundingNumber(this.props.exchangeRate.rate)
    var caption = this.props.translate("transaction.rate_info") || "Rates might be changed during settlement.<br> You can indicate your minimum rate by clicking \"Advanced\""
    return (
      <div class="token-compare">
        <span>
          1 {this.props.exchangeRate.sourceToken} = {tokenRate} {this.props.exchangeRate.destToken}
        </span>
        <span className="k k-info k-2x ml-3" data-tip={caption} data-for='rate-notice-tip'></span>
        <ReactTooltip place="right" id="rate-notice-tip" type="light" multiline={true}/>
      </div>
    )
  }
}