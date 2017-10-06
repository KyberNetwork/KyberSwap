import React from "react"
import { connect } from "react-redux"
import BigNumber from 'bignumber.js'
import { toTWei, toT } from "../../utils/converter"
import { specifyMinRate } from "../../actions/exchangeFormActions"
import ReactTooltip from 'react-tooltip'
import constants from "../../services/constants"

@connect((store, props) => {
  var exchangeForm = store.exchangeForm[props.exchangeFormID]
  exchangeForm = exchangeForm || {...constants.INIT_EXCHANGE_FORM_STATE}
  var sourceToken = exchangeForm.sourceToken
  var destToken = exchangeForm.destToken
  return {
    minConversionRate: exchangeForm.minConversionRate,
    isCrossSend: sourceToken != destToken,
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
        <div>
          <div>
            <label>
              Min rate
              <span data-tip data-for='min-rate-tooltip'>
                <i class="k-icon k-icon-question"></i>
              </span>
            </label>
            <ReactTooltip id='min-rate-tooltip' effect="solid" place="right" offset={{'left': -15}} className="k-tooltip">                                            
              <span>Minimum exchange rate between chosen token pair:</span> 
              <ul>
                <li>The current rate may change when your transaction is included in a block. This indicates a minimum rate that you want for your trade, set by default 0.2% less than the current rate.</li>
              </ul>
             </ReactTooltip>
            <input value={toT(this.props.minConversionRate)} name="min_rate" onKeyPress={this.props.onKeyPress}
              type="number" min="0" step="any"
              placeholder="Min rate that you accept"
              onChange={this.specifyMinRate}/>
          </div>
        </div>)
    }
    return minRateApp
  }
}
