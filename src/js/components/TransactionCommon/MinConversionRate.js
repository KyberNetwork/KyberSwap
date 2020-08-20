import React from "react";
import * as converter from "../../utils/converter";
import { filterInputNumber } from "../../utils/validators";
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux';
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
  onCustomSlippageRateChanged = (event) => {
    if (event.target.value > 100) event.target.value = 100;

    const isNumberValid = filterInputNumber(event, event.target.value, this.props.customRateInput.value);

    if (!isNumberValid) return;

    this.props.onSlippageRateChanged(event, true);
  }

  onChangeRateOption = (event, isInput) => {
    this.props.onSlippageRateChanged(event, isInput);
  };

  showRateInputError = () => {
    setTimeout(() => {
      ReactTooltip.show(document.getElementById("rate-input-error-trigger"));
    }, 300);
  };

  render = () => {
    const percent = Math.round(parseFloat(converter.caculatorPercentageToRate(this.props.minConversionRate, this.props.expectedRate)));
    const exchangeRate = converter.toT(this.props.expectedRate);
    const roundExchangeRate = converter.roundingRateNumber(exchangeRate);
    const slippageExchangeRate = converter.roundingRateNumber(exchangeRate * (percent / 100));
    const isError = this.props.customRateInput.isError;

    if (isError) {
      this.showRateInputError();
    }

    return (
      <div className="advance-config__block">
        <div className="advance-config__title">
          {this.props.translate("transaction.still_proceed_if_rate_goes_down", {pair: `${this.props.sourceTokenSymbol}-${this.props.destTokenSymbol}`})}:
        </div>
        <div className="advance-config__option-container advance-config__option-container--rate">
          <label className="advance-config__option">
            <span className={"advance-config__option-percent"}>3%</span>
            <input
              className="advance-config__radio"
              type="radio"
              name="slippageRate"
              value="97"
              checked={this.props.customRateInput.isSelected === false}
              onChange={e => this.onChangeRateOption(e, false)}
            />
            <span className="advance-config__checkmark theme__radio-button"/>
          </label>
          <label className="advance-config__option advance-config__option--with-input">
            <span>{this.props.translate("transaction.custom") || "Custom"}: </span>
            <input
              className="advance-config__radio"
              type="radio"
              name="slippageRate"
              value={this.props.customRateInput.value}
              checked={this.props.customRateInput.isSelected === true}
              onChange={e => this.onChangeRateOption(e, true)}
            />
            <span className="advance-config__checkmark theme__radio-button"/>
            <input
              type="number"
              className={`advance-config__input theme__background-5 theme__border theme__text-4 ${isError ? "advance-config__input-error" : ""}`}
              value={this.props.customRateInput.value}
              onChange={this.onCustomSlippageRateChanged}
            />

            <div id="rate-input-error-trigger" className="advance-config__rate-input-error-trigger" data-tip data-event='click focus' data-for="rate-input-error" data-scroll-hide="false"/>
            {isError &&
              <ReactTooltip globalEventOff="click" html={true} place="bottom" type="light" id="rate-input-error">
                {this.props.translate("error.required_field") || "This field is required"}
              </ReactTooltip>
            }
          </label>
        </div>
        <div className={"advance-config__info"}>
            {this.props.translate("transaction.advance_notice",
              {srcSymbol: this.props.sourceTokenSymbol, destSymbol: this.props.destTokenSymbol, slippageRate: slippageExchangeRate, roundRate: roundExchangeRate})
            || `Transaction will be reverted if rate of ${this.props.sourceTokenSymbol}-${this.props.destTokenSymbol} is lower than ${slippageExchangeRate} (Current rate ${roundExchangeRate})`}
        </div>
      </div>
    )
  }
}
