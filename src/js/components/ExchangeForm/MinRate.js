import React from "react"
import { connect } from "react-redux"
import BigNumber from 'bignumber.js'
import { toTWei, toT } from "../../utils/converter"
import { specifyMinRate } from "../../actions/exchangeFormActions"
import ReactTooltip from 'react-tooltip'

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
            <label>
              Min rate 
              <span data-tip data-for='min-rate-tooltip'>
                <i class="k-icon k-icon-question"></i>
              </span>                           
            </label>
            <ReactTooltip id='min-rate-tooltip' effect="solid" place="right" offset="{'left': -15}" className="k-tooltip">                                            
                  <span>Minimum exchange rate between chosen token pair:</span> 
                  <ul>
                    <li>If Kyber has <span class="underline">better rate</span> at <span class="underline">execution time</span>, <span class="underline">such rate</span> will be used.</li>
                    <li>If Kyber doesn <span class="underline">not</span> have <span class="underline">greater</span> or <span class="underline">equal rate</span>, the <span class="underline">transaction</span> will fail.</li>
                  </ul>                                     
             </ReactTooltip> 
            <span class="placeholder"> </span>
            <input value={toT(this.props.minConversionRate)} name="min_rate" onKeyPress={this.props.onKeyPress}
              type="number" min="0" step="any"
              placeholder="Min rate that you accept"
              onChange={this.specifyMinRate}/>
          </div>
        </li>)
    }
    return minRateApp
  }
}
