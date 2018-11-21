import React from "react";
import * as converter from "../../utils/converter";
import SlideDown, { SlideDownTrigger, SlideDownContent } from "../CommonElement/SlideDown";

export default class AdvanceConfigLayout extends React.Component {
  render() {
    const gasOptions = [
      {key: 'f', text: this.props.translate("fast") || 'Fast', value: this.props.gasPriceSuggest.fastGas},
      {key: 's', text: this.props.translate("standard") || 'Standard', value: this.props.gasPriceSuggest.standardGas},
      {key: 'l', text: this.props.translate("low") || 'Slow', value: this.props.gasPriceSuggest.safeLowGas}
    ];
    const percent = Math.round(parseFloat(converter.caculatorPercentageToRate(this.props.minConversionRate, this.props.offeredRate)));
    const displayMinRate = this.props.isSelectToken
      ? <img src={require('../../../assets/img/waiting.svg')} />
      : converter.roundingNumber(this.props.minConversionRate);
    const exchangeRate = converter.toT(this.props.offeredRate);
    const roundExchangeRate = converter.roundingNumber(exchangeRate);
    const slippageExchangeRate = converter.roundingNumber(exchangeRate * (percent / 100));

    return (
      <SlideDown active={this.props.isBalanceActive}>
        <SlideDownTrigger onToggleContent={() => this.props.toggleBalanceContent()}>
          <div className="slide-down__trigger-container slide-down__trigger-container--align-right">
            <div>
              <span className="slide-down__trigger-bold">Advance - </span>
              <span className="slide-down__trigger-light">Optional</span>
            </div>
            <div className="slide-arrow-container">
              <div className="slide-arrow"></div>
            </div>
          </div>
        </SlideDownTrigger>

        <SlideDownContent>
          <div className="advance-config">
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
                  <input className="advance-config__radio" type="radio" name="slippageRate"/>
                  <span className="advance-config__checkmark"></span>
                  <input type="number" className="advance-config__input" onChange={(e) => this.props.onSlippageRateChanged(e, true)}/>
                </label>
              </div>
              <div className={"advance-config__info"}>
                <div>
                  Tx will fail if {this.props.sourceTokenSymbol}-{this.props.destTokenSymbol} is lower than {slippageExchangeRate}
                </div>
                <div>(Current rate <b>{roundExchangeRate}</b>)</div>
              </div>
            </div>

            <div>
              <div className="advance-config__title">GAS fee (Gwei):</div>
              <div className="advance-config__option-container">
                {gasOptions.map((item, index) => {
                  return (
                    <label className="advance-config__option" key={index}>
                      <span className="advance-config__gas-amount">{item.value} </span>
                      <span className="advance-config__gas-mode">{item.text}</span>
                      <input
                        className="advance-config__radio"
                        type="radio"
                        name="gasAmount"
                        value={item.key}
                        defaultChecked={this.props.selectedGas == item.key}
                        onChange={() => this.props.selectedGasHandler(item.value, item.key)}
                      />
                      <span className="advance-config__checkmark"></span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        </SlideDownContent>
      </SlideDown>
    )
  }
}
