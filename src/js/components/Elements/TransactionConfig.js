import React from "react";


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
          <label>Gas limit</label>
          <input onKeyPress={this.props.onGasPress} name="gas_limit" type="number" step="any" min="0" value={this.props.gas} onChange={this.specifyGas.bind(this)} />
          {gasError}
        </li>
        <li>
          <label>Gas price</label>
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
