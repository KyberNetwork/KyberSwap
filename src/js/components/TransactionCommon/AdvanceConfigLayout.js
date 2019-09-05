import React from "react";
import SlideDown, { SlideDownContent } from "../CommonElement/SlideDown";

export default class AdvanceConfigLayout extends React.Component {
  render() {
    const gasOptions = [
      {key: 'sf', text: this.props.translate("super_fast") || 'Super Fast', value: this.props.gasPriceSuggest.superFastGas},
      {key: 'f', text: this.props.translate("fast") || 'Fast', value: this.props.gasPriceSuggest.fastGas},
      {key: 's', text: this.props.translate("standard") || 'Standard', value: this.props.gasPriceSuggest.standardGas},
      {key: 'l', text: this.props.translate("low") || 'Slow', value: this.props.gasPriceSuggest.safeLowGas}
    ];

    return (
      <SlideDown active={this.props.isAdvanceActive}>
        <SlideDownContent>
          <div className="advance-config theme__text-4">
            <div className={"advance-config__gas theme__border-2"}>
              <div className="advance-config__title">{this.props.translate("transaction.gas_fee") || "GAS fee"} (Gwei)</div>
              <div className="advance-config__option-container">
                {gasOptions.map((item, index) => {
                  return (
                    <label className="advance-config__option advance-config__option--gas" key={index}>
                      {/*<span className="advance-config__gas-amount">{item.value} </span>*/}
                      <span className="advance-config__gas-mode">{item.text}</span>
                      <input
                        className="advance-config__radio"
                        type="radio"
                        name="gasAmount"
                        value={item.key}
                        defaultChecked={this.props.selectedGas == item.key}
                        onChange={() => this.props.selectedGasHandler(item.value, item.key, item.text)}
                      />
                      <span className="advance-config__checkmark"/>
                    </label>
                  )
                })}
              </div>
            </div>
            {this.props.minConversionRate}
          </div>
        </SlideDownContent>
      </SlideDown>
    )
  }
}
