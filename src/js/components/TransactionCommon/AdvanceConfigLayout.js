import React from "react";
import * as converter from "../../utils/converter";
import SlideDown, { SlideDownTrigger, SlideDownContent } from "../CommonElement/SlideDown";
import ReactTooltip from 'react-tooltip'


export default class AdvanceConfigLayout extends React.Component {
  render() {
    const gasOptions = [
      {key: 'f', text: this.props.translate("fast") || 'Fast', value: this.props.gasPriceSuggest.fastGas},
      {key: 's', text: this.props.translate("standard") || 'Standard', value: this.props.gasPriceSuggest.standardGas},
      {key: 'l', text: this.props.translate("low") || 'Slow', value: this.props.gasPriceSuggest.safeLowGas}
    ];

    return (
      <SlideDown active={this.props.isAdvanceActive}>
        <SlideDownTrigger onToggleContent={() => this.props.toggleAdvanceContent()}>
          <div className="slide-down__trigger-container slide-down__trigger-container--align-right">
            <div>
              <span className="slide-down__trigger-bold">
                {this.props.translate("transaction.advanced") || "Advance"}
              </span> - 
              <span className="slide-down__trigger-light">
              {this.props.translate("transaction.optional") || "Optional"}
              </span>
            </div>
            <div className="slide-arrow-container">
              <div className="slide-arrow"></div>
            </div>
          </div>
        </SlideDownTrigger>

        <SlideDownContent>
          <div className="advance-config">
            {this.props.minConversionRate}

            <div>
              <div className="advance-config__title">
                <span>{this.props.translate("transaction.gas_fee") || "GAS fee"}} (Gwei)</span>
                {this.props.type==="exchange" && (
                  <span className="advance-config__title-info">
                    <span data-tip={`Higher gas price, faster transaction. Max gas price: ${this.props.maxGasPrice} Gwei`} data-html={true} data-for="gas-info">
                      <img src={require("../../../assets/img/v3/info_blue.svg")} />
                    </span>
                    <ReactTooltip html={true}  place="right" className="advance-config__gas-tooltip" id="gas-info" type="dark"/>
                  </span>  
                )}

                {this.props.type==="transfer" && (
                  <span className="advance-config__title-info">
                    <span data-tip={`Higher gas price, faster transaction`} data-html={true} data-for="gas-info">
                      <img src={require("../../../assets/img/v3/info_blue.svg")} />
                    </span>
                    <ReactTooltip html={true}  place="right" className="advance-config__gas-tooltip" id="gas-info" type="dark"/>
                  </span>  
                )}
                
              </div>
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
