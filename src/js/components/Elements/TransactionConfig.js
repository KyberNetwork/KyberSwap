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
      <div>
        <div class="intro">
          <label class="title"><strong>You may opt to change our suggested gas limit.</strong></label>
        </div>
        <div class="input-space">
          <input type="number" step="any" min="0" value={this.props.gas} onChange={this.specifyGas.bind(this)} />
        </div>
        {gasError}
        <div class="intro intro-bottom">
          <label class="title"><strong>You may opt to change our suggested gas price.</strong></label>
        </div>
        <div class="input-space">
          <input type="number" step="any" min="0" value={this.props.gasPrice} onChange={this.specifyGasPrice.bind(this)} value={this.props.gasPrice} />
          <span class="uint">Wei</span>
        </div>
        {gasPriceError}
      </div>
    )
  }
}
