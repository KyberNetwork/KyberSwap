import React, { Component } from "react";
import SlideDown, { SlideDownContent } from "../CommonElement/SlideDown";
import ReactTooltip from "react-tooltip";

export default class AdvanceConfigLayout extends Component {
  render() {
    const gasOptions = [
      { key: 'sf', text: this.props.translate("super_fast") || 'Super Fast', value: this.props.gasPriceSuggest.superFastGas },
      { key: 'f', text: this.props.translate("fast") || 'Fast', value: this.props.gasPriceSuggest.fastGas },
      { key: 's', text: this.props.translate("standard") || 'Standard', value: this.props.gasPriceSuggest.standardGas },
      { key: 'l', text: this.props.translate("low") || 'Slow', value: this.props.gasPriceSuggest.safeLowGas }
    ];

    return (
      <SlideDown active={this.props.isAdvanceActive}>
        <SlideDownContent>
          <div className="advance-config theme__text-4">
            <div className={`advance-config__gas ${this.props.type === 'transfer' ? 'advance-config__gas--no-border' : ''} theme__border-2`}>
              <div className="advance-config__title">
                {this.props.translate("transaction.gas_fee") || "GAS fee"} (Gwei)
                <span className="common__info-icon" data-tip={this.props.translate("info.gas_fee")} data-for="gas-fee-info">
                  <img src={require('../../../assets/img/common/blue-indicator.svg')} alt=""/>
                </span>
                <ReactTooltip place="top" id="gas-fee-info" type="light"/>
              </div>
              <div className="advance-config__option-container">
                {gasOptions.map((item, index) => {
                  return (
                    <label className="advance-config__option advance-config__option--gas" key={index}>
                      <div className="advance-config__gas-amount">{item.value}</div>
                      <div className="advance-config__gas-mode">{item.text}</div>
                      <input
                        className="advance-config__radio"
                        type="radio"
                        name="gasAmount"
                        value={item.key}
                        defaultChecked={this.props.selectedGas == item.key}
                        onChange={() => this.props.selectedGasHandler(item.value, item.key, item.text)}
                      />
                      <span className="advance-config__checkmark advance-config__checkmark--top theme__radio-button"/>
                    </label>
                  )
                })}
              </div>
            </div>
            {this.props.minConversionRate}
            {this.props.reserveRoutingEnabled !== null && (
              <label className="common__checkbox advance-config__checkbox theme__border-2 theme__checkbox">
                <div className="common__checkbox-text">
                  <span>{this.props.translate("info.reserve_routing")}</span>
                  <span className="common__info-icon" data-tip={this.props.translate("info.reserve_routing_explain")} data-for="reserve-routing-tooltip">
                    <img src={require('../../../assets/img/common/blue-indicator.svg')} alt=""/>
                  </span>
                  <ReactTooltip place="top" id="reserve-routing-tooltip" type="light"/>
                </div>
                <input
                  type="checkbox"
                  className="common__checkbox-input"
                  checked={this.props.reserveRoutingEnabled}
                  onChange={this.props.toggleReserveRouting}
                />
                <span className="common__checkbox-checkmark"/>
              </label>
            )}
          </div>
        </SlideDownContent>
      </SlideDown>
    )
  }
}
