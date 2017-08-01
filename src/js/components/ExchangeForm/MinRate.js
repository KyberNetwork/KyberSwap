import React from "react"
import { connect } from "react-redux"
import BigNumber from 'bignumber.js'
import { toTWei, toT } from "../../utils/converter"
import { specifyMinRate } from "../../actions/exchangeFormActions"


@connect((store, props) => {
  var exchangeForm = store.exchangeForm[props.exchangeFormID]
  exchangeForm = exchangeForm || {...constants.INIT_EXCHANGE_FORM_STATE}
  return {
    minConversionRate: exchangeForm.minConversionRate,
    isCrossSend: exchangeForm.isCrossSend,
  }
})
export default class MinRate extends React.Component {

  specifyMinRate = (event) => {
    var valueString = event.target.value == "" ? "0" : event.target.value
    this.props.dispatch(
      specifyMinRate(this.props.exchangeFormID, toTWei(valueString)))
  }

  render() {
    var minRateApp = null
    if (this.props.isCrossSend || !this.props.allowDirectSend) {
      minRateApp = (
        <li>
          <div>
            <label>Min rate</label>
            <span class="placeholder"> </span>
            <input value={toT(this.props.minConversionRate)}
              type="number" min="0" step="any"
              placeholder="Min rate that you accept"
              onChange={this.specifyMinRate}/>
          </div>
        </li>)
    }
    return minRateApp
  }
}
