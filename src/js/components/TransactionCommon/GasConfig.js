
import React from "react"
import ReactTooltip from 'react-tooltip'
import { filterInputNumber } from "../../utils/validators";
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';

const GasConfig = (props) => {

  function specifyGasPrice(e, value, level) {
    props.selectedGasHandler(value, level)
  }
  function handleChangeGasPrice(e) {
    filterInputNumber(e, e.target.value)
    props.inputGasPriceHandler(e.target.value)
  }

  function tooltipGasSuggest(time) {
    return props.translate("transaction.transaction_time", { time: time })
  }
 
  var caption = props.maxGasPrice ?
    props.translate("transaction.transaction_gasprice_50") || "Higher gas price, faster transaction. Max gas price: 50 Gwei" :
    props.translate("transaction.transaction_gasprice") || "Higher gas price, faster transaction"
  var gasPriceSuggest = props.gasPriceSuggest
  return (
    <div className="gas-config">
      <div>
        <span className="sub_title">GAS PRICE (inclusive in the rate)</span>
      </div>
      <div className={!props.gasPriceError ? "" : "error"}>
        <div className="row">
          <div className="column small-9">
            <input type="text" min="0" max="99" className="gas-price-input" step="0.1" value={props.gasPrice} onChange={handleChangeGasPrice} maxLength="20" autoComplete="off" />
          </div>
          <div className="column small-3">
          <Dropdown>
            <DropdownTrigger className="gas-config-toggle">
                  <div>
                    {props.selectedGas === "f"&&<label for="f-option">{props.translate("fast") || 'Fast'}</label>}
                    {props.selectedGas === "l"&&<label for="s-option">{props.translate("low") || 'Slow'}</label>}
                    {props.selectedGas === "s"&&<label for="t-option">{props.translate("standard") || 'Standard'}</label>}
                    <img src={require("../../../assets/img/dropdow-keyboard.svg")}/>
                  </div>
            </DropdownTrigger>
              <DropdownContent>
                <div className ="custom-radio">
                    <ul>
                    {props.selectedGas !== "f"&&<li onClick= {(e) => specifyGasPrice(e, gasPriceSuggest.fastGas, "f")}>
                        <label for="f-option">{props.translate("fast") || 'Fast'}</label>
                      </li>
                    }
                    {props.selectedGas !== "l"&&
                      <li onClick= {(e) => specifyGasPrice(e, gasPriceSuggest.safeLowGas, "l")}>
                        <label for="s-option">{props.translate("low") || 'Slow'}</label>
                      </li>
                    }
                    {props.selectedGas !== "s"&&
                      <li onClick= {(e) => specifyGasPrice(e, gasPriceSuggest.standardGas, "s")}>
                        <label for="t-option">{props.translate("standard") || 'Standard'}</label>
                      </li>
                    }
                    </ul>
                </div>
              </DropdownContent>
          </Dropdown>
          </div>
        </div>
        {props.gasPriceError && <div class="error-text mb-1">{props.translate(props.gasPriceError, { maxGas: props.maxGasPrice })}</div>}
        <div className="des-down">Higher gas price, faster transaction. Max gas price: 50 Gwei</div>
      </div>
      
      <div className="transaction-fee">
        <div className="title-fee">Transaction fee</div>
        <div className="font-w-b">{props.totalGas} ETH</div>
      </div>
    </div>
  )
}
export default GasConfig