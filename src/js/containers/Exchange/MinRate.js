
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
      <div className="min-rate">
        <span>Min Rate</span>
        <input type="number" value={offeredRate} onChange={(e) => this.changeOfferRate(e)}/>
        <span className="error">{this.props.exchange.errors.rateError}</span>
      </div>
    )
  }
}