import React, { Component } from "react";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import { Modal, OrderTableInfo } from "../../../components/CommonElement";
import * as limitOrderActions from "../../../actions/limitOrderActions";
import OrderDetails from "../MobileElements/OrderDetails";

@connect((store, props) => {
  const account = store.account.account;
  const translate = getTranslate(store.locale);
  const limitOrder = store.limitOrder;
  const global = store.global;

  return { translate, limitOrder, account, global };
})
export default class ForceCancelOrderModal extends Component {

  closeModal = () => {
    const { isAgreeForceSubmit } = this.props.limitOrder;

    if (!isAgreeForceSubmit) {
      this.props.dispatch(limitOrderActions.setIsDisableSubmit(false));
    }

    this.props.dispatch(limitOrderActions.throwError("rateWarning", ""));
  };

  agreeForceCancel = () => {
    this.props.dispatch(limitOrderActions.throwError("rateWarning", ""))
    this.props.toggleAgreeSubmit()
  };

  getCancelOrderModal = () => {
    const base = this.props.limitOrder.sideTrade === "buy" ? this.props.limitOrder.destTokenSymbol : this.props.limitOrder.sourceTokenSymbol;

    return (
      <div className={`limit-order-modal ${this.props.global.isOnMobile ? 'limit-order-modal--mobile' : ''}`} id="cancel-order">
        <div className="limit-order-modal__body">
          <div className="limit-order-modal__title">
            {this.props.translate("modal.cancel_order", {sideTrade: this.props.limitOrder.sideTrade, symbol: base}) ||
            `Cancel ${sideTrade} ${base} Order`}
          </div>

          <div className="limit-order-modal__close" onClick={this.closeModal}>
            <div className="limit-order-modal__close-wrapper"/>
          </div>

          <div className="limit-order-modal__content">
            <div className="limit-order-modal__message">{"By submitting this order, you also CANCEL the following orders"}:</div>

            <a className={"question"} href={`/faq#can-I-submit-multiple-limit-orders-for-same-token-pair`} target="_blank">
              {this.props.translate("why") || "Why?"}
            </a>

            {!this.props.global.isOnMobile && (
              <OrderTableInfo
                listOrder={this.props.getListWarningOrdersComp()}
                translate={this.props.translate}
              />
            )}

            {this.props.global.isOnMobile && (
              this.props.getListWarningOrdersComp().map(order => {
                return (
                  <OrderDetails
                    order = {order}
                    isModal = {true}
                    translate = {this.props.translate}
                  />
                )
              })
            )}
          </div>
        </div>

        <div className="cancel-order__footer">
          <label className="cancel-order__confirm">
            <span className="cancel-order__confirm--text">
              {this.props.translate("i_understand") || "I understand"}
            </span>
            <input
              type="checkbox"
              checked={this.props.limitOrder.isAgreeForceSubmit}
              className="cancel-order__confirm--checkbox"
              onChange={e => this.agreeForceCancel()}
            />
            <span className="cancel-order__confirm--checkmark"/>
          </label>
        </div>
      </div>
    )
  };

  render() {
    return (
      <Modal
        className={{
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
