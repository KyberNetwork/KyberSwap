import React from "react";
import * as converter from "../../utils/converter";

const MinConversionRate = (props) => {
  const percent = Math.round(parseFloat(converter.caculatorPercentageToRate(props.minConversionRate, props.offeredRate)));
  const displayMinRate = props.isSelectToken
    ? <img src={require('../../../assets/img/waiting.svg')} />
    : converter.roundingNumber(props.minConversionRate);
  const exchangeRate = converter.toT(props.offeredRate);
  const roundExchangeRate = converter.roundingNumber(exchangeRate);
  const slippageExchangeRate = converter.roundingNumber(exchangeRate * (percent / 100));

  return (
    <div className="advance-config__block">
      <div className="advance-config__title">
        Still proceed if {props.sourceTokenSymbol}-{props.destTokenSymbol} rate goes down by:
      </div>
      <div className="advance-config__option-container">
        <label className="advance-config__option">
          <span>3%</span>
          <input className="advance-config__radio" type="radio" name="slippageRate" value="97" defaultChecked onChange={props.onSlippageRateChanged}/>
          <span className="advance-config__checkmark"></span>
        </label>
        <label className="advance-config__option">
          <span>Any-rate</span>
          <input className="advance-config__radio" type="radio" name="slippageRate" value="0" onChange={props.onSlippageRateChanged}/>
          <span className="advance-config__checkmark"></span>
        </label>
        <label className="advance-config__option advance-config__option--with-input">
          <span>Custom</span>
          <input className="advance-config__radio" type="radio" name="slippageRate"/>
          <span className="advance-config__checkmark"></span>
          <input type="number" placeholder="%" className="advance-config__input" onChange={(e) => props.onSlippageRateChanged(e, true)}/>
        </label>
      </div>
      <div className={"advance-config__info"}>
        <div>
          Transaction will be reverted if rate of {props.sourceTokenSymbol}-{props.destTokenSymbol} is lower than {slippageExchangeRate} (Current rate {roundExchangeRate})
        </div>
        {/* <div>(Current rate <b>{roundExchangeRate}</b>)</div> */}
      </div>
    </div>
  )
}

export default MinConversionRate
