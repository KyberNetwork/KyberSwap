import React from "react"

const TransactionConfig = (props) => {
  function specifyGas(event) {
    props.gasHandler(event)
  }

  function specifyGasPrice(event) {
    props.gasPriceHandler(event)
  }

  var caption = props.maxGasPrice? 
    props.translate("transaction.transaction_gasprice_50") || "Higher gas price, faster transaction. Max gas price: 50 Gwei" : 
    props.translate("transaction.transaction_gasprice") || "Higher gas price, faster transaction"
  return (
    <div className="gas-config">
      <div className="row small-11 medium-12 hide-on-choose-token-pair">
        <div className="advanced-content" disabled>
          {props.minRate}
          <div className="row gas-price text-light small-12 medium-8 mt-3">
            <label className="column small-12 medium-3">
              <span>{props.translate("transaction.gas_price") || "Gas price"}</span>
              <span className="k k-info k-2x ml-3" data-tooltip title={caption}></span>
            </label>
            <div className="column small-12 medium-6 end p-relative">
              <input type="number" min="0" max="99" className="gas-price-input" step="0.1" onKeyPress={props.onGasPricePress} value={props.gasPrice} onChange={specifyGasPrice.bind(this)} />
              <div class="mt-2">
                <span className="unit text-lowercase">gwei</span>
                {props.gasPriceError !== "" && <p class="error-text mb-1">{props.gasPriceError}</p>}
                {props.translate("transaction.transaction_fee") || "Transaction Fee"}: <span className="text-success font-w-b">{props.totalGas} eth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default TransactionConfig