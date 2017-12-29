
import React from "react"
import { connect } from "react-redux"
import * as converter from "../../utils/converter"
import * as actions from "../../actions/exchangeActions"

@connect((store) => {
  return {exchange: store.exchange}
})

export default class MinRate extends React.Component {

  changeOfferRate = (e) => {
    var value = e.target.value
    if (value === "" || isNaN(value)){
      this.props.dispatch(actions.setOfferedRate(value))  
    }else{
      var valueB = converter.toTWei(value)
      this.props.dispatch(actions.setOfferedRate(valueB.toString()))
    }
    this.props.dispatch(actions.caculateAmount())
  }

  render = () => {
    var offeredRate = this.props.exchange.offeredRate
    if (offeredRate !== "" && !isNaN(offeredRate)){
      offeredRate = converter.toT(offeredRate, 18)
    }
    return (
    <div class="column small-12 medium-6 min-rate">
      <label class="title">Min Rate<span class="help has-tip top" data-tooltip title="Lower rates for better success chance during market volatility"></span></label>
      <div className ={this.props.exchange.errors.rateError !==""? "error":""}>
        <input type="number" value={offeredRate} onChange={(e) => this.changeOfferRate(e)}/>
        <span className="error-text">{this.props.exchange.errors.rateError}</span>
      </div>
    </div>
    )
  }
}