import React from "react"

const TransactionConfig = (props) => {
  function specifyGas(event) {
    props.gasHandler(event)
  }

  function specifyGasPrice(event) {
    props.gasPriceHandler(event)
  }
  
  return (
    <div className="frame">
      <div className="gas-config">
        <div class="row hide-on-choose-token-pair">
          <div class="column">
            <div class="advanced-content" disabled>
              <div class="transaction-fee">
                <div>
                  {props.translate("transaction.transaction_fee") || "Transaction Fee"}<span class="help has-tip top" data-tooltip title={props.translate("transaction.transaction_config_tooltip") || "Change gas limit or gas price affect the time to proccess transaction"}></span>
                </div>
                <div className="gas-limit">
                  <span>Gas limit</span>
                  <span>{props.gas} </span>
                </div>
                <div className="symbol">
                  x
                </div>
                <div className="gas-price">
                    <span>Gas price</span>
                    <input type="number" min="0" max="99" className="gas-price-input" step="0.1" onKeyPress={props.onGasPricePress} value={props.gasPrice} onChange={specifyGasPrice.bind(this)} />
                    <span>gwei</span>
                    {props.gasPriceError !== "" && <span class="error-text">{props.gasPriceError}</span>}
                </div>
                <div>
                  <span class="result">{props.totalGas} eth</span>
                </div>
              </div>

              {/* <div class="transaction-fee row">
                <div className="column small-11 medium-11 large-2">
                  {props.translate("transaction.transaction_fee") || "Transaction Fee"}<span class="help has-tip top" data-tooltip title={props.translate("transaction.transaction_config_tooltip") || "Change gas limit or gas price affect the time to proccess transaction"}></span>
                </div>
                <div class="column small-11 medium-3 large-3 gas-limit">
                  <span>Gas limit</span>
                  <span>{props.gas} </span>
                </div>
                <div className="column small-11 medium-2 large-1 symbol">×</div>
                <div className="column small-11 medium-3 large-3">
                  <div className={props.gasPriceError !== "" ? "gas-price error" : "gas-price"}>
                    <span>Gas price</span>
                    <input type="number" min="0" max="99" className="gas-price-input" step="0.1" onKeyPress={props.onGasPricePress} value={props.gasPrice} onChange={specifyGasPrice.bind(this)} />
                    <span>gwei</span>
                    {props.gasPriceError !== "" && <span class="error-text">{props.gasPriceError}</span>}

                  </div>
                </div>
                <div className="column small-11 medium-2 large-3">
                  <span class="result">{props.totalGas} eth</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default TransactionConfig