
import React from "react"
import { connect } from "react-redux"
import * as converter from "../../utils/converter"
import * as actions from "../../actions/exchangeActions"
import { getTranslate } from 'react-localize-redux'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

@connect((store) => {
  return { 
    exchange: store.exchange,
    translate: getTranslate(store.locale)
  }
})

export default class MinRate extends React.Component {
  constructor(props) {
    super(props);
    const {minConversionRate,offeredRate}  = this.props.exchange
    let disable = false
    if(converter.caculatorPercentageToRate(minConversionRate,offeredRate)==0){
      disable = true
    }
    this.state = {
      value: converter.caculatorPercentageToRate(minConversionRate,offeredRate),
      disable:disable
    };
  }
  onSliderChange = (value) => {
    this.setState({
      value,
    });
  }
  onAfterChange = (value) => {
    const {offeredRate}  = this.props.exchange
    this.props.dispatch(actions.setMinRate(converter.caculatorRateToPercentage(value,offeredRate)))
  }
  render = () => {
    const {minConversionRate,slippageRate,offeredRate}  = this.props.exchange
    const {disable,value} = this.state
    return (
      <div className="min-rate">
        <div className="des-up">
          A higher percentage will lead to a higher success rate during market volatility
        </div>
        <div className = {!this.props.exchange.errors.rateError? "":"error"}>
          <span  className="sub_title">PERCENTAGE RATE</span>
          <Slider value={value} 
                  defaultValue={parseInt(converter.caculatorPercentageToRate(slippageRate,offeredRate))} 
                  min={0} max={100}
                  onChange={this.onSliderChange} 
                  onAfterChange={this.onAfterChange}
                  trackStyle={{ backgroundColor: '#666666', height: 4 }}
                  disabled={disable}
                  handleStyle={{
                    border:'none',
                    borderRadius:0,
                    background: `url(${require("../../../assets/img/precent-rate.svg")})`,
                    backgroundRepeat: "repeat",
                    width: 23,
                    height: 15,
                  }}
          />
          <div className="row small-12">
          <div className="column small-1"><label className="des-down">0%</label></div>
          <div className="column small-9 min-convention-rate"><span>{minConversionRate}</span></div>
          <div className="column small-1"><label className="des-down">{value}%</label></div>
          </div>
          {this.props.exchange.errors.rateError && <div className="error-text">{this.props.exchange.errors.rateError}</div>}
          <div className="des-down">Lower rate typically results in better success rate when the market is volatle</div>
        </div>
      </div>
    )
  }
}