import React from "react"

const TransactionConfig = (props) => {
  function specifyGas(event) {
    props.gasHandler(event)
  }

  function specifyGasPrice(event) {
    props.gasPriceHandler(event)
  }
  // var gasError = ""
  // if (props.gasError && props.gasError != "") {
  //   gasError = (<div class="error">
  //     <i class="k-icon k-icon-error"></i>
  //     Specified gas limit is {props.gasError}
  //   </div>)
  // }
  // var gasPriceError = ""
  // if (props.gasPriceError && props.gasPriceError != "") {
  //   gasPriceError = (<div class="error">
  //     <i class="k-icon k-icon-error"></i>
  //     Specified gas limit is {props.gasPriceError}
  //   </div>)
  // }
  return (
    <div className="frame">
      <div className="gas-config">
        <div class="row hide-on-choose-token-pair">
          <div class="column">
            <div class="advanced-content" disabled>
              <div class="transaction-fee">
                <label>{props.translate("transaction.transaction_fee") || "Transaction Fee"}<span class="help has-tip top" data-tooltip title={props.translate("transaction.transaction_config_tooltip") || "Change gas limit or gas price affect the time to proccess transaction"}></span></label>
                <div class="gas-limit">
                  <span>Gas limit</span>
                  <span>{props.gas} </span>
                </div>
                <div class="symbol">×</div>
                <div className={props.gasPriceError !== "" ? "gas-price error" : "gas-price"}>
                  <span>Gas price</span>
                  <input type="number" min="0" max="99" className="gas-price-input" step="0.1" onKeyPress={props.onGasPricePress} value={props.gasPrice} onChange={specifyGasPrice.bind(this)} />
                  <span>gwei</span>
                  {props.gasPriceError !== "" && <span class="error-text">{props.gasPriceError}</span>}
                  </div><span class="result">{props.totalGas} eth</span>                  
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
export default TransactionConfig