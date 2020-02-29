import React from "react";
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux';
import OrderDetailsModal from "./LimitOrderModals/OrderDetailsModal";
import * as limitOrderActions from "../../actions/limitOrderActions";
import LimitOrderTable from "./LimitOrderTable";

@connect((store, props) => {
  return {
    translate: getTranslate(store.locale),
    limitOrder: store.limitOrder,
    global: store.global
  }
})
export default class LimitOrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeFilter: [
        { interval: 1, unit: 'day' },
        { interval: 1, unit: 'week' },
        { interval: 1, unit: 'month' },
        { interval: 3, unit: 'month'}
      ],
      cancelOrderModalVisible: false,
      currentOrder: null,
      orderDetailsModalVisible: false
    };
  }

  openOrderDetailsModal = (order) => {
    const currentOrder = JSON.parse(JSON.stringify(order));

    this.setState({
      orderDetailsModalVisible: true,
      currentOrder
    });
  };

  closeOrderDetailsModal = () => {
    this.setState({
      orderDetailsModalVisible: false
    });
  };

  onChangeOrderTab = (activeOrderTab) => {
    this.props.dispatch(limitOrderActions.changeOrderTab(activeOrderTab));
  };

  getOrderTabs = () => {
    const { activeOrderTab } = this.props.limitOrder;
    const tab = ["open", "history"];

    return tab.map((item, index) => {
      let className = item === activeOrderTab ? "limit-order-list__tab--active theme__sort active" : "theme__sort";

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
      <div className={`limit-order-list theme__background-2 ${this.props.limitOrder.listOrder.length === 0 ? "limit-order-list--empty" : ""}`}>
        <div>
          <div className="limit-order-list--title">
            <div>
              <div className="title">{this.props.translate("limit_order.order_list_title") || "Your Limit Orders"}</div>
              <div className={"limit-order-list--title-faq"}>
                <a href="/faq#I-submitted-the-limit-order-but-it-was-not-triggered-even-though-my-desired-price-was-hit" target="_blank" rel="noreferrer noopener">
                  {this.props.translate("limit_order.wonder_why_order_not_filled")}
                </a>
              </div>
            </div>
            {/*<a className="limit-order-list__leaderboard" href="/promo/rlc#ranking" target="_blank"
               rel="noreferrer noopener">RLC LeaderBoard</a>*/}
            <div className="limit-order-list__tab-container">
              {this.getOrderTabs()}
            </div>
          </div>
          <div>
            <LimitOrderTable
              data={this.props.limitOrder.listOrder}
              openOrderDetailsModal={this.openOrderDetailsModal}
              srcInputElementRef={this.props.srcInputElementRef}
            />
            <OrderDetailsModal
              order={this.state.currentOrder}
              isOpen={this.state.orderDetailsModalVisible}
              closeModal={this.closeOrderDetailsModal}
            />
          </div>
        </div>
      </div>
    )
  }
}
