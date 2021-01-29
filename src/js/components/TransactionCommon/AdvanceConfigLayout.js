import React, { Component } from "react";
import SlideDown, { SlideDownContent } from "../CommonElement/SlideDown";
import ReactTooltip from "react-tooltip";
import { Modal } from "../CommonElement";
import { setGasWarningThreshold } from "../../actions/globalActions";
import { connect } from "react-redux";
import { filterInputNumber } from "../../utils/validators";

@connect((store) => {
  const gasWarningThreshold = store.global.gasWarningThreshold;

  return { gasWarningThreshold }
})
export default class AdvanceConfigLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gasWarningModal: false,
      warningValue: null,
      warningValueInput: '',
      isInputError: false
    }
  }

  componentDidMount() {
    if (!([500, 200, 100].includes(this.props.gasWarningThreshold))) {
      this.setState({ warningValueInput: this.props.gasWarningThreshold })
    } else {
      this.setState({ warningValue: this.props.gasWarningThreshold })
    }
  }

  openWarningModal = () => {
    this.setState({ gasWarningModal: true });
  }

  closeWarningModal = () => {
    this.setState({ gasWarningModal: false });
  }

  onChangeGasWarningThreshold = (value) => {
    this.setState({ warningValue: value, isInputError: false });
  }

  setWarningValueInput = (e) => {
    const isNumberValid = filterInputNumber(e, e.target.value, this.state.warningValueInput);

    if (!isNumberValid) return;

    this.setState({ warningValue: 0, warningValueInput: e.target.value, isInputError: false })
  }

  saveGasWarningValue = () => {
    let value = +this.state.warningValue;
    if (!value) value = +this.state.warningValueInput;
    if (!value) {
      this.setState({ isInputError: true });
      return;
    }
    this.props.dispatch(setGasWarningThreshold(value));
    this.closeWarningModal();
  }

  render() {
    const gasOptions = [
      { key: 'sf', text: this.props.translate("super_fast") || 'Super Fast', value: this.props.gasPriceSuggest.superFastGas },
      { key: 'f', text: this.props.translate("fast") || 'Fast', value: this.props.gasPriceSuggest.fastGas },
      { key: 's', text: this.props.translate("standard") || 'Standard', value: this.props.gasPriceSuggest.standardGas },
      { key: 'l', text: this.props.translate("low") || 'Slow', value: this.props.gasPriceSuggest.safeLowGas }
    ];

    const gasWarningOptions = [
      { type: 'option', text: '> 500 Gwei', value: 500 },
      { type: 'option', text: '> 200 Gwei', value: 200 },
      { type: 'option', text: '> 100 Gwei', value: 100 },
      { type: 'text', text: 'Enter your own', value: 0 }
    ];
    const isCustomGasPriceWarning = !([500, 200, 100].includes(this.state.warningValue));

    return (
      <SlideDown active={this.props.isAdvanceActive}>
        <SlideDownContent>
          <div className="advance-config theme__text-4">
            <div className={`advance-config__gas ${this.props.type === 'transfer' ? 'advance-config__gas--no-border' : ''} theme__border-2`}>
              <div className="advance-config__title">
                <div>
                  {this.props.translate("transaction.gas_fee") || "GAS fee"} (Gwei)
                  <span className="common__info-icon" data-tip={this.props.translate("info.gas_fee")} data-for="gas-fee-info">
                    <img src={require('../../../assets/img/common/blue-indicator.svg')} alt=""/>
                  </span>
                  <ReactTooltip className="common__tooltip" place="top" id="gas-fee-info" type="light"/>
                </div>
                <div>
                  <div className='advance-config__gas-icon theme__background-4' onClick={this.openWarningModal}>
                    <img src={require('../../../assets/img/icons/gas.svg')} alt="Gas Icon"/>
                  </div>
                  <Modal
                    className={{
                      base: 'reveal tiny confirm-modal',
                      afterOpen: 'reveal tiny confirm-modal'
                    }}
                    isOpen={this.state.gasWarningModal}
                    onRequestClose={this.closeWarningModal}
                    contentLabel="Gas Warning"
                    content={(
                      <div className='advance-config__gas-warning'>
                        <div className="x" onClick={this.closeWarningModal}>&times;</div>
                        <div className="advance-config__gas-warning-title">Gas Warning</div>
                        <div className="content">
                          <div className='common__mb-15'>Save gas fees. Get an extra warning on trade confirmation screen when gas price is high. Simply set up your alert below.</div>
                          <div className='common__mb-20'>Show me a warning if gas price is:</div>
                          <div className="">
                            {gasWarningOptions.map((item, index) => {
                              return (
                                <label className="advance-config__option advance-config__option--gas" key={index}>
                                  <div className="advance-config__gas-amount">{item.text}</div>
                                  <input
                                    className="advance-config__radio"
                                    type="radio"
                                    name="gasWarningAmount"
                                    value={item.value}
                                    checked={this.state.warningValue === item.value || (isCustomGasPriceWarning && item.type === 'text')}
                                    onChange={() => this.onChangeGasWarningThreshold(item.value)}
                                  />
                                  <span className={`advance-config__checkmark advance-config__checkmark--top theme__radio-button ${item.type}`}/>
                                  {item.type === 'text' && (
                                    <input
                                      type='text'
                                      value={this.state.warningValueInput}
                                      onChange={this.setWarningValueInput}
                                      className={`advance-config__input theme__background-5 theme__border theme__text-4`}
                                    />
                                  )}
                                </label>
                              )
                            })}
                          </div>
                        </div>
                        {this.state.isInputError && (
                          <div className="modal-content__text-warning theme__background-red">
                            Please enter a valid input amount for Gas Price
                          </div>
                        )}
                        <div className="overlap theme__background-2">
                          <div className="input-confirm grid-x">
                            <div className={"button process-submit cancel-process"} onClick={this.closeWarningModal}>
                              {this.props.translate("modal.cancel" || "Cancel")}
                            </div>
                            <div className={"button process-submit"} onClick={this.saveGasWarningValue}>
                              {this.props.translate("modal.confirm") || "Confirm"}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
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
                  <ReactTooltip className="common__tooltip" place="top" id="reserve-routing-tooltip" type="light"/>
                </div>
                <input
                  type="checkbox"
                  className="common__checkbox-input"
                  checked={this.props.reserveRoutingChecked}
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
