
import React from "react"
import { connect } from "react-redux"
import * as converter from "../../utils/converter"
import * as actions from "../../actions/exchangeActions"
import { getTranslate } from 'react-localize-redux';
import ReactTooltip from 'react-tooltip'
import { filterInputNumber } from "../../utils/validators";

@connect((store) => {
  return { 
    exchange: store.exchange,
    translate: getTranslate(store.locale)
  }
})

export default class MinRate extends React.Component {

  changeMinRate = (e) => {
    filterInputNumber(e, e.target.value)
    this.props.dispatch(actions.setMinRate(e.target.value))
  }

  render = () => {
    var minConversionRate = this.props.exchange.minConversionRate
    return (
      <div className="row min-rate small-12 medium-8">
        <label className="column small-12 medium-3 text-right">
          <span>{this.props.translate("transaction.best_rate") || "Min Rate"}</span>
          <span className="k k-info k-2x ml-3" data-for="rate-tip" data-tip={this.props.translate("transaction.best_rate_tooltip") || "Lower rates for better success chance during market volatility"}></span>
          <ReactTooltip place="bottom" id="rate-tip" type="light"/>
        </label>
        <div className="column small-12 medium-6 end p-relative">
          <input type="text" value={minConversionRate} maxLength="20"
            onChange={(e) => this.changeMinRate(e)} 
          />
          <span className="error-text">{this.props.exchange.errors.rateError}</span>
        </div>
      </div>
    )
  }
}