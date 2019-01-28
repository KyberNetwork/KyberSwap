import React from "react";
import * as converter from "../../utils/converter";
import { filterInputNumber } from "../../utils/validators";

export default class MinConversionRate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      customSlippageRate: ''
    }
  }

  onCustomSlippageRateChanged = (event) => {
    if (event.target.value > 100) event.target.value = 100;

    const isNumberValid = filterInputNumber(event, event.target.value, this.state.customSlippageRate);

    if (!isNumberValid) return;

    this.setState({customSlippageRate: event.target.value});

    this.props.onSlippageRateChanged(event, true);
  }

  render = () => {
    const percent = Math.round(parseFloat(converter.caculatorPercentageToRate(this.props.minConversionRate, this.props.offeredRate)));
    const displayMinRate = this.props.isSelectToken
      ? <img src={require('../../../assets/img/waiting.svg')} />
      : converter.roundingNumber(this.props.minConversionRate);
    const exchangeRate = converter.toT(this.props.offeredRate);
    const roundExchangeRate = converter.roundingNumber(exchangeRate);
    const slippageExchangeRate = converter.roundingNumber(exchangeRate * (percent / 100));

    return (
      <div className="advance-config__block">
        <div className="advance-config__title">
          Still proceed if {this.props.sourceTokenSymbol}-{this.props.destTokenSymbol} rate goes down by:
        </div>
        <div className="advance-config__option-container">
          <label className="advance-config__option">
            <span>3%</span>
            <input className="advance-config__radio" type="radio" name="slippageRate" value="97" defaultChecked onChange={this.props.onSlippageRateChanged}/>
            <span className="advance-config__checkmark"></span>
          </label>
          <label className="advance-config__option">
            <span>Any-rate</span>
            <input className="advance-config__radio" type="radio" name="slippageRate" value="0" onChange={this.props.onSlippageRateChanged}/>
            <span className="advance-config__checkmark"></span>
          </label>
          <label className="advance-config__option advance-config__option--with-input">
            <span>Custom</span>
            <input className="advance-config__radio" type="radio" name="slippageRate" value={this.state.customSlippageRate} onChange={(e) => this.props.onSlippageRateChanged(e, true)}/>
            <span className="advance-config__checkmark"></span>
            <input type="number" placeholder="%" className="advance-config__input" value={this.state.customSlippageRate} onChange={(e) => this.onCustomSlippageRateChanged(e)}/>
          </label>
        </div>
        <div className={"advance-config__info"}>
          <div>
            Transaction will be reverted if rate of {this.props.sourceTokenSymbol}-{this.props.destTokenSymbol} is lower than {slippageExchangeRate} (Current rate {roundExchangeRate})
          </div>
        </div>
      </div>
    )
  }
}
