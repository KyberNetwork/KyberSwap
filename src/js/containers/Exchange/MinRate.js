
import React from "react"
import { connect } from "react-redux"
import * as converter from "../../utils/converter"
import * as actions from "../../actions/exchangeActions"
import { getTranslate } from 'react-localize-redux'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import * as analytics from "../../utils/analytics"

@connect((store) => {
  return { 
    exchange: store.exchange,
    translate: getTranslate(store.locale)
  }
})

export default class MinRate extends React.Component {
  // constructor(props) {
  //   super(props);
  //   const {minConversionRate,offeredRate}  = this.props.exchange
  //   let disable = false
  //   if(converter.caculatorPercentageToRate(minConversionRate,offeredRate)==0){
  //     disable = true
  //   }
  //   this.state = {
  //     value: parseInt(converter.caculatorPercentageToRate(minConversionRate,offeredRate)),
  //     disable:disable
  //   };
  // }
  onSliderChange = (value) => {
    var rateValue = value <= 10 ? 10 : value
    const {offeredRate}  = this.props.exchange
    var minRate = converter.caculatorRateToPercentage(rateValue,offeredRate)
    this.props.dispatch(actions.setMinRate(minRate.toString()))
    // this.setState({
    //   value,
    // });
  }
  // onAfterChange = (value) => {
  //   // const {offeredRate}  = this.props.exchange
  //   // this.props.dispatch(actions.setMinRate(converter.caculatorRateToPercentage(value,offeredRate)))
  // }

  onAfterChange = (value) => {
    analytics.trackSetNewMinrate(value)
  }

  suggestRate = (slippageRate, desToken) => {
    return converter.roundingNumber(slippageRate) + " " + desToken
  }

  render = () => {
    const {minConversionRate,slippageRate,offeredRate}  = this.props.exchange
    var desToken = this.props.exchange.destTokenSymbol
    // const {disable,value} = this.state
    

    var displayMinRate = this.props.exchange.isSelectToken ? <img src={require('../../../assets/img/waiting.svg')} /> : converter.roundingNumber(minConversionRate)
   // var displaySlippageRate = this.props.exchange.isSelectToken ? (<img src={require('../../../assets/img/waiting-white.svg')} /> + " " + desToken): converter.roundingNumber(slippageRate) + " " + desToken
  
   var src = require('../../../assets/img/waiting.svg')

   var displaySlippageRate
    if (this.props.exchange.isSelectToken){
      displaySlippageRate = `<span><strong> <img src=${require('../../../assets/img/waiting.svg')} />${desToken}</strong></span>`
    }else{
      displaySlippageRate = `<span><strong>${converter.roundingNumber(slippageRate) + " " + desToken}</strong></span>`
    }

    //console.log(displaySlippageRate)

    var disable = false
    if((converter.caculatorPercentageToRate(slippageRate,offeredRate)===0) || (this.props.exchange.isSelectToken)){
      disable = true
    }


    var percent = converter.caculatorPercentageToRate(minConversionRate,offeredRate)
    percent = Math.round(parseFloat(percent))
    if (isNaN(percent)) percent = 0
    return (
      <div className="min-rate">
        <div className="des-up">
          {this.props.translate("transaction.higher_min_acceptable_rate", {displaySlippageRate: displaySlippageRate}) 
            || `Guard yourself during volatile times by setting the lowest conversion rate you would accept for this transaction. Setting a high value may result in a failed transaction and you would be charged gas fees. Our recommended Min Acceptable Rate is ${displaySlippageRate}`}
        </div>
        <div className = {!this.props.exchange.errors.rateError? "":"error"}>
          <span  className="sub_title">{this.props.translate("transaction.min_acceptable_rate") || "MIN ACCEPTABLE RATE"}</span>
          <Slider value={percent} 
                  defaultValue={percent}
                  min={0} max={100}
                  onChange={this.onSliderChange}
                  onAfterChange={this.onAfterChange}
                  trackStyle={{ backgroundColor: '#666666', height: 2 }}
                  disabled={disable}
                  handleStyle={{
                    border:'none',
                    borderRadius:0,
                    background: `url(${require("../../../assets/img/precent-rate.svg")})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "100%",
                    height: 30,
                    width: 30
                  }}
          />
          <div className="row small-12">
          <div className="column small-1"><label className="des-down">0%</label></div>
          <div className="column small-9 min-convention-rate"><span>{displayMinRate} {" " + desToken}</span></div>
          <div className="column small-1"><label className="des-down">{percent}%</label></div>
          </div>
          {this.props.exchange.errors.rateError && <div className="error-text">{this.props.exchange.errors.rateError}</div>}
        </div>
      </div>
    )
  }
}