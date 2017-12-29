import React from "react"

const TransactionConfig = (props) => {
  function specifyGas(event) {
    props.gasHandler(event)
  }

  function specifyGasPrice(event) {
    props.gasPriceHandler(event)
  }

  return (
    <div class="column small-12 medium-6 transaction-fee">
      <label class="title">Gas Price<span class="help has-tip top" data-tooltip title="Higher gas price, faster transaction"></span></label>
      <div className ={props.gasPriceError !==""? "gas-price error":"gas-price"}>
        <input type="number" min="0" max="99" className="gas-price-input" step="0.1" onKeyPress={props.onGasPricePress} value={props.gasPrice} onChange={specifyGasPrice.bind(this)} />
        {props.gasPriceError !=="" && <span class="error-text">{props.gasPriceError}</span>}
        <p class="result">Transaction Fee: <a>{props.totalGas} eth</a></p>
      </div>
    </div>
  )

}
export default TransactionConfig