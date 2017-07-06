import React from "react";
import { connect } from "react-redux";

import { specifyGasLimit, specifyGasPrice } from "../../actions/exchangeFormActions";

@connect((store) => {
  return {
    gasPrice: store.exchangeForm.gasPrice,
    gas: store.exchangeForm.gas,
  }
})
export default class TransactionConfig extends React.Component {
  specifyGas(event) {
    this.props.dispatch(specifyGasLimit(event.target.value));
  }

  specifyGasPrice(event) {
    this.props.dispatch(specifyGasPrice(event.target.value));
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
