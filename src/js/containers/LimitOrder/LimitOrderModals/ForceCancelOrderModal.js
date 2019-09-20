import React, { Component } from "react";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";

import { Modal, OrderTableInfo } from "../../../components/CommonElement";
import * as limitOrderActions from "../../../actions/limitOrderActions";


@connect((store, props) => {
	const account = store.account.account;
  const translate = getTranslate(store.locale);  
  const limitOrder = store.limitOrder;

	return {
		translate,
		limitOrder,
		account
	};
})

export default class ForceCancelOrderModal extends Component {
  
  closeModal = () => {
    const { isAgreeForceSubmit } = this.props.limitOrder;

    if (!isAgreeForceSubmit) {
      this.props.dispatch(limitOrderActions.setIsDisableSubmit(false));
    }

    this.props.dispatch(limitOrderActions.throwError("rateWarning", ""));
  }

  agreeForceCancel = () => {
    this.props.dispatch(limitOrderActions.throwError("rateWarning", ""))
    this.props.toggleAgreeSubmit()
  }

  getCancelOrderModal = () => {
    var base = this.props.limitOrder.sideTrade == "buy" ? this.props.limitOrder.destTokenSymbol : this.props.limitOrder.sourceTokenSymbol
    return (
      <div className="cancel-order" id="cancel-order">
        <a className="x" onClick={this.closeModal}>
          <img src={require("../../../../assets/img/v3/Close-3.svg")} />
        </a>
        <h1 className="cancel-order__title">
          {this.props.translate("modal.cancel_order", {sideTrade: this.props.limitOrder.sideTrade, symbol: base}) ||
						`Cancel ${sideTrade} ${base} Order`}
          </h1>
        <div className="cancel-order__content">
          <p>{"By submitting this order, you also CANCEL the following orders"}:</p>
          <a className={"question"} href={`/faq#can-I-submit-multiple-limit-orders-for-same-token-pair`} target="_blank">
            {this.props.translate("why") || "Why?"}
          </a>
          <OrderTableInfo 
            listOrder={this.props.getListWarningOrdersComp()}
          />
        </div>
        <div className="cancel-order__footer">
          <label className="cancel-order__confirm">
            <span className="cancel-order__confirm--text">
              {this.props.translate("i_understand") || "I understand"}
            </span>
            <input type="checkbox" 
              checked={this.props.limitOrder.isAgreeForceSubmit}
              className="cancel-order__confirm--checkbox"
              onChange={e => this.agreeForceCancel()}/>
            <span className="cancel-order__confirm--checkmark"/>
          </label>
        </div>
      </div>
    )
  }
  
  render() {
    return (
      <Modal className={{
        base: 'reveal medium cancel-order-modal',
        afterOpen: 'reveal medium'
        }}
        overlayClassName={"cancel-modal"}
        isOpen={this.props.limitOrder.errors.rateWarning !== ""}
        onRequestClose={this.closeModal}
        contentLabel="Cancel Order"
        content={this.getCancelOrderModal()}
        size="medium"
      />
    )
  }
}