
import React from "react"
import { connect } from "react-redux"
import * as converter from "../../utils/converter"
import * as actions from "../../actions/exchangeActions"
import { getTranslate } from 'react-localize-redux'
import ReactTooltip from 'react-tooltip'
import { filterInputNumber } from "../../utils/validators"

@connect((store) => {
  return { 
    exchange: store.exchange,
    translate: getTranslate(store.locale)
  }
})

export default class MinRate extends React.Component {

  changeMinRate = (e) => {
    var check = filterInputNumber(e, e.target.value, this.props.exchange.minConversionRate)
    if(check) this.props.dispatch(actions.setMinRate(e.target.value))
  }

  render = () => {
    var minConversionRate = this.props.exchange.minConversionRate
    return (
      <div className="min-rate">
        <div className="des-up">
          A higher percentage will lead to a higher success rate during market volatility
        </div>
        <div className = {!this.props.exchange.errors.rateError? "":"error"}>
          <span  className="sub_title">PERCENTAGE RATE</span>
          <input type="text" maxLength="40" value={minConversionRate} onChange={(e) => this.changeMinRate(e)} autoComplete="off"/>
          {this.props.exchange.errors.rateError && <div className="error-text">{this.props.exchange.errors.rateError}</div>}
          <div className="des-down">Lower rate typically results in better success rate when the market is volatle</div>
        </div>
        {/* <label className="column small-12 medium-3 text-right">
          <span>{this.props.translate("transaction.best_rate") || "Min Rate"}</span>
          <span className="k k-info k-2x ml-3" data-for="rate-tip" data-tip={this.props.translate("transaction.best_rate_tooltip") || "Lower rates for better success chance during market volatility"}></span>
          <ReactTooltip place="bottom" id="rate-tip" type="light"/>
        </label>
        <div className="column small-12 medium-6 end p-relative">
          <input type="text" maxLength="40" value={minConversionRate} onChange={(e) => this.changeMinRate(e)} autoComplete="off"/>
          <span className="error-text">{this.props.exchange.errors.rateError}</span>
        </div> */}
      </div>
    )
  }
}