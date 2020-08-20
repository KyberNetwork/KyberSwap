import React, { Component } from "react";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import { Modal } from "../../../components/CommonElement";
import * as limitOrderActions from "../../../actions/limitOrderActions";
import limitOrderServices from "../../../services/limit_order";
import { OrderTableInfo } from "../../../components/CommonElement";
import OrderDetails from "../MobileElements/OrderDetails";

@connect((store, props) => {
  const translate = getTranslate(store.locale);
  const limitOrder = store.limitOrder;
  const global = store.global;
  const account = store.account.account;

  return { translate, limitOrder, global, account };
})
export default class CancelOrderModal extends Component {
  constructor() {
    super();
    this.state = {
      isConfirming: false,
      isFinish: false,
      err: ""
    }
  }

  async confirmCancel() {
    this.props.global.analytics.callTrack("trackClickConfirmCancelOrder", this.props.order ? this.props.order.id : null);
    this.setState({
      isConfirming: true,
      err: ""
    });
    if (this.props.order) {
      try {
        const results = await limitOrderServices.cancelOrder(
          this.props.order
        );
        if (results) {
          if (this.props.limitOrder.filterMode === "client") {
            this.props.dispatch(limitOrderActions.updateOpenOrderStatus());
          } else {
            this.props.dispatch(limitOrderActions.getOrdersByFilter({}));

            if (this.props.account) {
              this.props.dispatch(limitOrderActions.getPendingBalances(this.props.account.address));
            }
          }
          this.props.dispatch(limitOrderActions.getListFilter());

          this.setState({
            isConfirming: false,
            isFinish: true
          });
        }
      } catch (err) {
        console.log(err);
        this.setState({
          isConfirming: false,
          isFinish: false,
          err: err.toString()
        });
      }
    }
  }

  closeModal = () => {
    if (this.state.isConfirming) return;
    this.setState({
      isConfirming: false,
      isFinish: false
    });
    this.props.closeModal();
  };

  contentModal = () => {
    const order = this.props.order;

    if (!order) return;

    const baseTokenSymbol = order.side_trade === "buy" ? order.dest : order.source;

    return (
      <div className={`limit-order-modal ${this.props.global.isOnMobile ? 'limit-order-modal--mobile' : ''}`}>
        <div className="limit-order-modal__body theme__text">
          <div className="limit-order-modal__title">
            {this.props.translate("modal.cancel_order", { sideTrade: order.side_trade, symbol: baseTokenSymbol }) ||
            `Cancel ${order.side_trade} ${baseTokenSymbol} Order`}
          </div>
          <div className="limit-order-modal__close" onClick={this.closeModal}>
            <div className="limit-order-modal__close-wrapper"/>
          </div>
          <div className="limit-order-modal__content">
            <div className="limit-order-modal__message">
              {this.props.translate("limit_order.canceling_order_message" || "You are canceling this order")}
            </div>

            {!this.props.global.isOnMobile && (
              <OrderTableInfo
                listOrder = {[order]}
                translate={this.props.translate}
              />
            )}

            {this.props.global.isOnMobile && (
              <OrderDetails
                order = {order}
                isModal = {true}
                translate={this.props.translate}
              />
            )}

          </div>
        </div>

        {(!this.state.isFinish && !this.state.err) &&
          <div className="limit-order-modal__footer theme__background-2">
            <button
              className={`btn-cancel ${this.state.isConfirming ? "btn-disabled" : ""}`}
              onClick={this.closeModal}
            >
              {this.props.translate("modal.no") || "No"}
            </button>
            <button
              className={`btn-confirm ${this.state.isConfirming ? "btn-disabled" : ""}`}
              onClick={e => this.confirmCancel()}
            >
              {this.props.translate("modal.yes") || "Yes"}
            </button>
          </div>
        }

        {this.state.isFinish && (
          <div className="limit-order-modal__msg limit-order-modal__msg--success theme__background-8">
            <div className={"limit-order-modal__text"}>
              <div className={"limit-order-modal__text--success"}>
                <img src={require("../../../../assets/img/limit-order/checkmark_green.svg")}/>
                <span>{this.props.translate("modal.success") || "Success"}</span>
              </div>
              <div className={"limit-order-modal__button limit-order-modal__button--success"} onClick={this.closeModal}>
                {this.props.translate("done") || "Done"}
              </div>
            </div>
          </div>
        )}

        {this.state.err &&
          <div className="limit-order-modal__msg limit-order-modal__msg--failed theme__background-9">
            <div className={"limit-order-modal__text limit-order-modal__text--failed"}>
              <div className={"limit-order-modal__left-content"}>
                <img src={require("../../../../assets/img/limit-order/error.svg")}/>
                <div>
                  <div>{this.props.translate("error_text") || "Error"}</div>
                  <div>{this.state.err}</div>
                </div>
              </div>
              <div className={"limit-order-modal__button limit-order-modal__button--failed"} onClick={this.closeModal}>
                {this.props.translate("ok") || "OK"}
              </div>
            </div>
          </div>
        }
      </div>
    );
  };

  render() {
    return (
      <Modal
        className={{
          base: "reveal medium confirm-modal",
          afterOpen: "reveal medium confirm-modal confirm-modal__cancel-order"
        }}
        isOpen={this.props.isOpen}
        onRequestClose={this.closeModal}
        contentLabel="Cancel Order Modal"
        content={this.contentModal()}
        size="medium"
      />
    );
  }
}
