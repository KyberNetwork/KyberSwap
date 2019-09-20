import React, { Component } from "react";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import CancelOrderModal from "./LimitOrderModals/CancelOrderModal";
import LimitOrderTable from "./LimitOrderTable";
import * as limitOrderActions from "../../actions/limitOrderActions";

@connect((store, props) => {
  const account = store.account.account;
  const translate = getTranslate(store.locale);
  const tokens = store.tokens.tokens;
  const limitOrder = store.limitOrder;
  const ethereum = store.connection.ethereum;
  const global = store.global;

  return {
    translate,
    limitOrder,
    tokens,
    account,
    ethereum,
    global
  };
})
export default class LimitOrderListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeFilter: [
        { interval: 1, unit: "day" },
        { interval: 1, unit: "week" },
        { interval: 1, unit: "month" },
        { interval: 3, unit: "month" }
      ],
      cancelOrderModalVisible: false,
      currentOrder: null,
    };
  }

  openCancelOrderModal = (order) => {
    this.props.global.analytics.callTrack("trackClickCancelOrder", order.id);
    if (order) {
      this.setState({
        cancelOrderModalVisible: true,
        currentOrder: order
      });
    }
  }

  closeCancelOrderModal = () => {
    this.setState({
      cancelOrderModalVisible: false
    });
  }

  onChangeOrderTab = (activeOrderTab) => {
    this.props.dispatch(limitOrderActions.changeOrderTab(activeOrderTab));
  }

  getOrderTabs = () => {
    const { activeOrderTab } = this.props.limitOrder;
    const tab = ["open", "history"];

    return tab.map((item, index) => {
      let className = item === activeOrderTab ? "limit-order-list__tab--active" : "";

      return (
        <div key={item} className={`limit-order-list__tab ${className}`} onClick={e => this.onChangeOrderTab(item)}>
          {item === "open" &&
          (this.props.translate("limit_order.open_orders") || "Open Orders")}
          {item === "history" &&
          (this.props.translate("limit_order.order_history") || "Order History")}
        </div>
      )
    });
  }

  render() {
    return (
      <div className="limit-order-table theme__background-2">
        <div className="limit-order-modal__title">Limit Order</div>
        <div className="limit-order-list__tab-container">
          {this.getOrderTabs()}
        </div>
        <div className="limit-order-modal__content">
          <div className="limit-order-list--table-mobile">
            <LimitOrderTable
              data={this.props.limitOrder.listOrder}
              screen="mobile"
              openCancelOrderModal={this.openCancelOrderModal}
              srcInputElementRef={this.props.srcInputElementRef}
            />
            <CancelOrderModal
              order={this.state.currentOrder}
              isOpen={this.state.cancelOrderModalVisible}
              closeModal={this.closeCancelOrderModal}
              screen="mobile"
            />
          </div>
        </div>
      </div>
    );
  }
}
