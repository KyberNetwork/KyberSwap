
import React from "react"
import { connect } from "react-redux"
import * as converter from "../../utils/converter"
import * as actions from "../../actions/exchangeActions"
import { getTranslate } from 'react-localize-redux';

@connect((store) => {
  return { 
    exchange: store.exchange,
    translate: getTranslate(store.locale)
  }
})

export default class MinRate extends React.Component {

  changeOfferRate = (e) => {
    var value = e.target.value
    if (value === "" || isNaN(value)) {
      this.props.dispatch(actions.setOfferedRate(value))
    } else {
      var valueB = converter.toTWei(value)
      this.props.dispatch(actions.setOfferedRate(valueB.toString()))
    }
    this.props.dispatch(actions.caculateAmount())
  }

  render = () => {
    var offeredRate = this.props.exchange.offeredRate
    if (offeredRate !== "" && !isNaN(offeredRate)) {
      offeredRate = converter.toT(offeredRate, 18)
    }
    return (
      <div className="row min-rate small-12 medium-8">
        <label className="column small-12 medium-3 text-right">
          <span>{this.props.translate("transaction.best_rate") || "Best Rate"}</span>
          <span className="k k-info k-2x ml-3" title={this.props.translate("transaction.best_rate_tooltip") || "Lower rates for better success chance during market volatility"}></span>
        </label>
        <div className="column small-12 medium-6 end p-relative">
          <input type="number" value={offeredRate} onChange={(e) => this.changeOfferRate(e)} />
          <span className="error-text">{this.props.exchange.errors.rateError}</span>
        </div>
      </div>
    )
  }
}