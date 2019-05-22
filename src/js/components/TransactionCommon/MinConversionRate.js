import React from "react";
import * as converter from "../../utils/converter";
import { filterInputNumber } from "../../utils/validators";
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import ReactTooltip from 'react-tooltip';

@connect((store, props) => {
  const translate = getTranslate(store.locale)
  return {
    translate: translate,
    customRateInput: store.exchange.customRateInput,
    global: store.global
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

    this.setState({
      customSlippageRate: event.target.value
    });

    this.props.onSlippageRateChanged(event, true);
  }

  onChangeRateOption = (event, isInput) => {
    this.props.onSlippageRateChanged(event, isInput);
  }

  showRateInputError = () => {
    setTimeout(() => {
      ReactTooltip.show(document.getElementById("rate-input-error-trigger"));
    }, 300);
  }

  render = () => {
    const percent = Math.round(parseFloat(converter.caculatorPercentageToRate(this.props.minConversionRate, this.props.expectedRate)));
    const displayMinRate = this.props.isSelectToken
      ? <img src={require('../../../assets/img/waiting.svg')} />
      : converter.roundingNumber(this.props.minConversionRate);
    const exchangeRate = converter.toT(this.props.expectedRate);
    const roundExchangeRate = converter.roundingNumber(exchangeRate);
    const slippageExchangeRate = converter.roundingNumber(exchangeRate * (percent / 100));

    const isError = this.props.customRateInput.isError;
    if (isError) {
      this.showRateInputError();
    }

    return (
      <div className="advance-config__block">
        <div className="advance-config__title">
          {this.props.translate("transaction.still_proceed_if_rate_goes_down", {pair: `${this.props.sourceTokenSymbol}-${this.props.destTokenSymbol}`})}:
          {/* Still proceed if {this.props.sourceTokenSymbol}-{this.props.destTokenSymbol} rate goes down by: */}
        </div>
        <div className="advance-config__option-container">
          <label className="advance-config__option">
            <span>3%</span>
            <input className="advance-config__radio" type="radio" name="slippageRate" value="97" 
              defaultChecked
              // checked={this.props.customRateInput.isDirty === false} 
              onChange={e => this.onChangeRateOption(e, false)}/>
            <span className="advance-config__checkmark"></span>
          </label>
          {/* <label className="advance-config__option">
            <span>{this.props.translate("transaction.any_rate") || "Any-rate"}</span>
            <input className="advance-config__radio" type="radio" name="slippageRate" value="0" onChange={this.props.onSlippageRateChanged}/>
            <span className="advance-config__checkmark"></span>
          </label> */}
            <label className="advance-config__option advance-config__option--with-input">
              <span>{this.props.translate("transaction.custom") || "Custom"}: </span>
              <input className="advance-config__radio" type="radio" name="slippageRate" value={this.state.customSlippageRate} 
                // checked={this.props.customRateInput.isDirty}
                onChange={e => this.onChangeRateOption(e, true)}/>
              <span className="advance-config__checkmark"></span>
              <input type="number" className={`advance-config__input ${isError ? "advance-config__input-error" : ""}`} value={this.state.customSlippageRate} min={0} max={100} onChange={this.onCustomSlippageRateChanged}/>
              <span className="advance-config__input--suffix">%</span>
              
              <div id="rate-input-error-trigger" className="advance-config__rate-input-error-trigger" data-tip data-event='click focus' data-for="rate-input-error" data-scroll-hide="false"></div>
              {isError && 
                  <ReactTooltip globalEventOff="click" html={true} place="bottom" type="light" id="rate-input-error">
                    {`<div>
                      ${this.props.translate("error.required_field") || "This field is required"}
                    </div>`}
                  </ReactTooltip>
                }
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
