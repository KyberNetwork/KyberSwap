import React from "react"
import ReactTooltip from 'react-tooltip'
import { filterInputNumber } from "../../utils/validators";

const TransactionConfig = (props) => {

  function specifyGasPrice(value) {
    props.gasPriceHandler(value)
  }
  function handleChangeGasPrice(e) {
    var check = filterInputNumber(e, e.target.value, props.gasPrice)
    if(check) props.gasPriceHandler(e.target.value)
  }

  function handleChangeGasPrice(e) {
    filterInputNumber(e, e.target.value)
    props.gasPriceHandler(e.target.value)
  }

  function tooltipGasSuggest(time) {
    return props.translate("transaction.transaction_time", { time: time })
  }

  var caption = props.maxGasPrice ?
    props.translate("transaction.transaction_gasprice_50") || "Higher gas price, faster transaction. Max gas price: 50 Gwei" :
    props.translate("transaction.transaction_gasprice") || "Higher gas price, faster transaction"
  var gasPriceError = props.gasPriceError !== "" &&
    <p class="error-text mb-1">{props.translate(props.gasPriceError, { maxGas: props.maxGasPrice })}</p>
  var gasPriceSuggest = props.gasPriceSuggest
  return (
    <div className="gas-config">
      <div className="row small-11 medium-12 hide-on-choose-token-pair">
        <div className="advanced-content" disabled={props.advanced ? false : true}>
          {props.minRate}
          <div className="row gas-price text-light small-12 medium-8 mt-3">
            <label className="column small-12 medium-3">
              <span>{props.translate("transaction.gas_price") || "Gas price"}</span>
              <span className="k k-info k-2x ml-3" data-tip={caption} data-for='gas-price-tip'></span>
              <ReactTooltip place="bottom" id="gas-price-tip" type="light" />
            </label>
            <div className="column small-12 medium-6 end p-relative">
              <input type="text" min="0" max="99" className="gas-price-input" step="0.1" value={props.gasPrice} onChange={handleChangeGasPrice} maxLength="20" autoComplete="off" />
              <div class="mt-2">
                <span className="unit text-lowercase">gwei</span>
                {gasPriceError}
                <div className="d-flex justify-content-between gas-select">
                  <button onClick={() => specifyGasPrice(gasPriceSuggest.safeLowGas)} data-tip={tooltipGasSuggest(30)} data-for="low">
                    {props.translate("low") || 'Slow'}
                  </button>
                  <ReactTooltip place="bottom" id="low" type="light" />

                  <button onClick={() => specifyGasPrice(gasPriceSuggest.standardGas)} data-tip={tooltipGasSuggest(5)} data-for="standard">
                    {props.translate("standard") || 'Standard'}
                  </button>
                  <ReactTooltip place="bottom" id="standard" type="light" />

                  <button onClick={() => specifyGasPrice(gasPriceSuggest.fastGas)} data-tip={tooltipGasSuggest(2)} data-for="fast">
                    {props.translate("fast") || 'Fast'}
                  </button>
                  <ReactTooltip place="bottom" id="fast" type="light" />
                </div>
                {props.translate("transaction.transaction_fee") || "Transaction Fee"}: <span className="text-success font-w-b">{props.totalGas} ETH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default TransactionConfig