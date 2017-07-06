import React from "react";
import { connect } from "react-redux";

import { specifyMinRate } from "../../actions/exchangeFormActions";


@connect((store) => {
  return {
    minConversionRate: store.exchangeForm.minConversionRate,
  }
})
export default class TokenDest extends React.Component {

  specifyMinConversionRate(event) {
    this.props.dispatch(specifyMinRate(event.target.value));
  }

  render() {
    return (
    <label>
      Min exchange rate allowed:
      <div>
        <input type="number" min="0" step="any" value={this.props.minConversionRate} onChange={this.specifyMinConversionRate.bind(this)} />
      </div>
      Specified exchange rate: {this.props.minConversionRate}
    </label>)
  }
}
