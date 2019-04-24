import React from "react";
import * as converter from "../../utils/converter";
import { filterInputNumber } from "../../utils/validators";
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'

@connect((store, props) => {
  const translate = getTranslate(store.locale)
  return {
    translate: translate
  }
})

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
          {this.props.translate("transaction.still_proceed_if_rate_goes_down", {pair: `${this.props.sourceTokenSymbol}-${this.props.destTokenSymbol}`})}:
          {/* Still proceed if {this.props.sourceTokenSymbol}-{this.props.destTokenSymbol} rate goes down by: */}
        </div>
        <div className="advance-config__option-container">
          <label className="advance-config__option">
            <span>3%</span>
            <input className="advance-config__radio" type="radio" name="slippageRate" value="97" defaultChecked onChange={this.props.onSlippageRateChanged}/>
            <span className="advance-config__checkmark"></span>
          </label>
          {/* <label className="advance-config__option">
            <span>{this.props.translate("transaction.any_rate") || "Any-rate"}</span>
            <input className="advance-config__radio" type="radio" name="slippageRate" value="0" onChange={this.props.onSlippageRateChanged}/>
            <span className="advance-config__checkmark"></span>
          </label> */}
          <label className="advance-config__option advance-config__option--with-input">
            <span>{this.props.translate("transaction.custom") || "Custom"}: </span>
            <input className="advance-config__radio" type="radio" name="slippageRate" value={this.state.customSlippageRate} onChange={(e) => this.props.onSlippageRateChanged(e, true)}/>
            <span className="advance-config__checkmark"></span>
            <input type="number" className="advance-config__input" value={this.state.customSlippageRate} min={0} max={100} onChange={(e) => this.onCustomSlippageRateChanged(e)}/>
            <span className="advance-config__input--suffix">%</span>
          </label>
        </div>
        <div className={"advance-config__info"}>
          <div>
            {this.props.translate("transaction.advance_notice", 
              {srcSymbol: this.props.sourceTokenSymbol, destSymbol: this.props.destTokenSymbol, slippageRate: slippageExchangeRate, roundRate: roundExchangeRate})
              || `Transaction will be reverted if rate of ${this.props.sourceTokenSymbol}-${this.props.destTokenSymbol} is lower than ${slippageExchangeRate} (Current rate ${roundExchangeRate})`}
          </div>
        </div>
      </div>
    )
  }
}
