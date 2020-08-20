import React, { Component } from "react";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import { Modal, OrderTableInfo } from "../../../components/CommonElement";
import OrderDetails from "../MobileElements/OrderDetails";

@connect((store) => {
  const translate = getTranslate(store.locale);
  const isOnMobile = store.global.isOnMobile;
  const isAgreeForceSubmit = store.limitOrder.isAgreeForceSubmit;

  return { translate, isAgreeForceSubmit, isOnMobile };
})
export default class ForceCancelOrderModal extends Component {
  closeModal = () => {
    this.props.toggleCancelOrderModal(false);
  };

  getCancelOrderModal = () => {
    return (
      <div className={`limit-order-modal ${this.props.isOnMobile ? 'limit-order-modal--mobile' : ''}`} id="cancel-order">
        <div className="limit-order-modal__body theme__text">
          <div className="limit-order-modal__title">
            {this.props.translate("modal.cancel_order", { sideTrade: this.props.formType, symbol: this.props.baseSymbol }) || `Cancel ${this.props.formType} ${this.props.baseSymbol} Order`}
          </div>

          <div className="limit-order-modal__close" onClick={this.closeModal}>
            <div className="limit-order-modal__close-wrapper"/>
          </div>

          <div className="limit-order-modal__content">
            <div className="limit-order-modal__message">{"By submitting this order, you also CANCEL the following orders"}:</div>

            <a className={"question"} href={`/faq#can-I-submit-multiple-limit-orders-for-same-token-pair`} target="_blank">
              {this.props.translate("why") || "Why?"}
            </a>

            {!this.props.isOnMobile && (
              <OrderTableInfo
                listOrder={this.props.orders}
                translate={this.props.translate}
                cancelModal
              />
            )}

            {this.props.isOnMobile && (
              this.props.orders.map(order => {
                return <OrderDetails order={order} translate={this.props.translate} isModal/>
              })
            )}
          </div>
        </div>

        <div className="cancel-order__footer theme__background-2">
          <label className="cancel-order__confirm">
            <span className="cancel-order__confirm--text">
              {this.props.translate("i_understand") || "I understand"}
            </span>
            <input
              type="checkbox"
              checked={this.props.isAgreeForceSubmit}
              className="cancel-order__confirm--checkbox"
              onChange={this.props.toggleAgreeSubmit}
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
          base: 'reveal x-medium cancel-order-modal',
          afterOpen: 'reveal medium'
        }}
        overlayClassName={"cancel-modal"}
        isOpen={this.props.cancelOrderModal}
        onRequestClose={this.closeModal}
        contentLabel="Cancel Order"
        content={this.getCancelOrderModal()}
        size="medium"
      />
    )
  }
}
