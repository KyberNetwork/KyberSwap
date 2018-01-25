import React from "react"
import ReactTooltip from 'react-tooltip'

const TransactionConfig = (props) => {

  function specifyGasPrice(value) {
    props.gasPriceHandler(value)
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
              <input type="number" min="0" max="99" className="gas-price-input" step="0.1" onKeyPress={props.onGasPricePress} value={props.gasPrice} onChange={e => specifyGasPrice(e.target.value)} />
              <div class="mt-2">
                <span className="unit text-lowercase">gwei</span>
                {gasPriceError}
                <div className="d-flex justify-content-between gas-select">
                  <button onClick={() => specifyGasPrice(gasPriceSuggest.safeLowGas)}>Slow</button>
                  <button onClick={() => specifyGasPrice(gasPriceSuggest.standardGas)}>Medium</button>
                  <button onClick={() => specifyGasPrice(gasPriceSuggest.fastGas)}>Fast</button>
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