import React from "react";


export default class TransactionConfig extends React.Component {
  specifyGas(event) {
    this.props.gasHandler(event)
  }

  specifyGasPrice(event) {
    this.props.gasPriceHandler(event)
  }
  render() {
    return (
      <div>
        <label>
          Gas:
          <input type="number" step="any" min="0" value={this.props.gas} onChange={this.specifyGas.bind(this)} value={this.props.gas} />
          Specified gas: {this.props.gas}
        </label>
        <label>
          Gas price:
          <input type="number" step="any" min="0" value={this.props.gasPrice} onChange={this.specifyGasPrice.bind(this)} value={this.props.gasPrice} />
          Specified gas price: {this.props.gasPrice}
        </label>
      </div>
    )
  }
}
