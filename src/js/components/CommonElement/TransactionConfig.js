import React from "react"
import ReactTooltip from 'react-tooltip'

const TransactionConfig = (props) => {
  function specifyGas(event) {
    props.gasHandler(event)
  }

  function specifyGasPrice(event) {
    props.gasPriceHandler(event)
  }  
  var gasError = ""
  if (props.gasError && props.gasError != "") {
    gasError = (<div class="error">
      <i class="k-icon k-icon-error"></i>
      Specified gas limit is {props.gasError}
    </div>)
  }
  var gasPriceError = ""
  if (props.gasPriceError && props.gasPriceError != "") {
    gasPriceError = (<div class="error">
      <i class="k-icon k-icon-error"></i>
      Specified gas limit is {props.gasPriceError}
    </div>)
  }
  return (
    <div class="transaction-fee">
      <label class="title">Transaction Fee<span class="help has-tip top" data-tooltip title="Change gas limit or gas price affect the time to proccess transaction"></span></label>
      <div class="gas-limit">
        <input type="number" min="0" max="3000000" step="100" onKeyPress={props.onGasPress} value={props.gas} onChange={specifyGas.bind(this)}/>
      </div>
      <div class="symbol">×</div>
      <div class="gas-price">
        <input type="number" min="0" max="99" step="0.1" onKeyPress={props.onGasPricePress} value={props.gasPrice} onChange={specifyGasPrice.bind(this)}/>
      </div><span class="result">{props.gas * props.gasPrice} gwei</span>
    </div>



    // <ul>
    //   <li>
    //     <label for="gas_limit">Gas limit
    //     </label>
    //     <input onKeyPress={props.onGasPress} name="gas_limit" id="gas_limit" type="number" step="any" min="0" value={props.gas} onChange={specifyGas.bind(this)} />
    //     {gasError}
    //   </li>
    //   <li>
    //     <label for="gas_price">Gas price
    //       <span data-tip data-for='gas-price-tooltip'>
    //         <i class="k-icon k-icon-question"></i>
    //       </span>
    //     </label>
    //     <ReactTooltip id='gas-price-tooltip' effect="solid" place="right" offset={{'left': -15}} className="k-tooltip">
    //       <span>Gas price</span>
    //       <ul>
    //         <li>Higher gas price increases your transaction fee and makes your transaction confirmed faster.</li>
    //         <li>Lower gas price saves transaction fees but may take longer to confirm your transaction.</li>
    //       </ul>
    //     </ReactTooltip>
    //     <input onKeyPress={props.onGasPricePress} name="gas_price" id="gas_price" type="number" step="any" min="0" value={props.gasPrice} onChange={specifyGasPrice.bind(this)}/>
    //     <span class="helper">
    //       gwei
    //     </span>
    //     {gasPriceError}
    //   </li>
    // </ul>
  )
  
}
export default TransactionConfig