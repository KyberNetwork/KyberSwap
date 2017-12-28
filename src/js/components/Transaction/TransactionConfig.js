import React from "react"

const TransactionConfig = (props) => {
  function specifyGas(event) {
    props.gasHandler(event)
  }

  function specifyGasPrice(event) {
    props.gasPriceHandler(event)
  }

  return (
    <div className="gas-config">
      <div className="row small-11 medium-12 hide-on-choose-token-pair">
        <div className="column">
          <div className="advanced-content" disabled>
            <div className="transaction-fee text-light">
              <div className="font-w-b text-white">
                {props.translate("transaction.transaction_fee") || "Transaction Fee"}
                <span className="k k-info k-2x ml-3" data-tooltip title={props.translate("transaction.transaction_config_tooltip") || "Change gas limit or gas price affect the time to proccess transaction"}></span>
              </div>
              <div className="gas-limit">
                <span className="mr-auto">Gas limit</span> 
                <span>{props.gas}</span>
              </div>
              <div className="symbol"> x </div>
              <div className="gas-price">
                <span className="mr-auto">Gas price</span>
                <input type="number" min="0" max="99" className="gas-price-input" step="0.1" onKeyPress={props.onGasPricePress} value={props.gasPrice} onChange={specifyGasPrice.bind(this)} />
                <span className="text-lowercase">gwei</span>
                {props.gasPriceError !== "" && <span class="error-text">{props.gasPriceError}</span>}
              </div>
              <div className="text-center"><span className="result text-success font-w-b">= {props.totalGas} eth</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default TransactionConfig