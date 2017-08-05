import React from "react"
import ReactTooltip from 'react-tooltip'


export default class TransactionConfig extends React.Component {
  specifyGas(event) {
    this.props.gasHandler(event)
  }

  specifyGasPrice(event) {
    this.props.gasPriceHandler(event)
  }
  render() {
    var gasError = ""
    if (this.props.gasError && this.props.gasError != "") {
      gasError = (<div class="error">
        <i class="k-icon k-icon-error"></i>
        Specified gas limit is {this.props.gasError}
      </div>)
    }
    var gasPriceError = ""
    if (this.props.gasPriceError && this.props.gasPriceError != "") {
      gasPriceError = (<div class="error">
        <i class="k-icon k-icon-error"></i>
        Specified gas limit is {this.props.gasPriceError}
      </div>)
    }
    return (
      <ul>
        <li>
          <label>Gas limit
          </label>
          <input onKeyPress={this.props.onGasPress} name="gas_limit" type="number" step="any" min="0" value={this.props.gas} onChange={this.specifyGas.bind(this)} />
          {gasError}
        </li>
        <li>
          <label>Gas price
            <span data-tip data-for='gas-price-tooltip'>
              <i class="k-icon k-icon-question"></i>
            </span>
          </label>
          <ReactTooltip id='gas-price-tooltip' effect="solid" place="right" offset={{'left': -15}} className="k-tooltip">
            <span>Gas price</span>
            <ul>
              <li>Higher gas price increases your transaction fee and makes your transaction confirmed faster.</li>
              <li>Lower gas price saves transaction fees but may take longer to confirm your transaction.</li>
            </ul>
          </ReactTooltip>
          <input onKeyPress={this.props.onGasPricePress} name="gas_price" type="number" step="any" min="0" value={this.props.gasPrice} onChange={this.specifyGasPrice.bind(this)} value={this.props.gasPrice} />
          <span class="helper">
            wei
          </span>
          {gasPriceError}
        </li>
      </ul>
    )
  }
}
