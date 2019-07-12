import React from "react";
import { connect } from "react-redux"
import ReactTable from "react-table";
import { getTranslate } from 'react-localize-redux';
import _ from "lodash";
import Dropdown, { DropdownContent, DropdownTrigger } from "react-simple-dropdown";
import CancelOrderModal from "./LimitOrderModals/CancelOrderModal";

import * as limitOrderActions from "../../actions/limitOrderActions";
import * as common from "../../utils/common";

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
      currentOrder: null
    };
  }

  openCancelOrderModal = (order) => {
    this.props.global.analytics.callTrack("trackClickCancelOrder", order.id);
    const currentOrder = JSON.parse(JSON.stringify(order));
    this.setState({
      cancelOrderModalVisible: true,
      currentOrder
    });
  }

  closeCancelOrderModal = () => {
    this.setState({
      cancelOrderModalVisible: false
    });
  }

  // Handle filters
  onChangeTimeFilter = (item) => {
    const filter = {
      timeFilter: {
        interval: item.interval,
        unit: item.unit
      },
      pageIndex: 1
    };
    this.props.dispatch(limitOrderActions.getOrdersByFilter(filter));
    this.props.dispatch(limitOrderActions.getListFilter());
  }
  
  // Render time filter
  getTimeFilter = () => {
    const { timeFilter } = this.state;

    return timeFilter.map((item, index) => {
      // Translate date unit
      const convertedUnit = this.props.translate(`limit_order.${item.unit.toLowerCase()}`) || item.unit.charAt(0) + item.unit.slice(1);

      let className = "";
      if (item.unit === this.props.limitOrder.timeFilter.unit && item.interval === this.props.limitOrder.timeFilter.interval) {
        className = "filter--active";
      }

      return (
        <li key={index} onClick={(e) => this.onChangeTimeFilter(item)}>
          <a className={className}>{`${item.interval} ${convertedUnit}`}</a>
        </li>
      );
    })
  }

  render() {
    return (
      <div className={`limit-order-list ${this.props.limitOrder.listOrder.length === 0 ? "limit-order-list--empty" : ""}`}>
        <div>
          <div className="limit-order-list--title">
            <div>
              <div className="title">{this.props.translate("limit_order.order_list_title") || "Manage Your Orders"}</div>
              {<div className="limit-order-list--title-faq">
                <a href="/faq#I-submitted-the-limit-order-but-it-was-not-triggered-even-though-my-desired-price-was-hit" target="_blank">
                  {this.props.translate("limit_order.wonder_why_order_not_filled")}
                </a>
              </div>}
            </div>
            <a className="limit-order-list__leaderboard" href="/limit_order_leaderboard" target="_blank" rel="noreferrer noopener">
              Limit Order LeaderBoard
            </a>
            <div className="limit-order-list__filter-container">
              <ul className="filter">
                {this.getTimeFilter()}
              </ul>
            </div>
            
          </div>
          <div>
            <LimitOrderTable 
              data={this.props.limitOrder.listOrder}
              screen="desktop"
              openCancelOrderModal={this.openCancelOrderModal}
              srcInputElementRef={this.props.srcInputElementRef}
            />
            <CancelOrderModal order={this.state.currentOrder} 
              isOpen={this.state.cancelOrderModalVisible}
              closeModal={this.closeCancelOrderModal}
              screen="desktop"
            />
          </div>
        </div>
      </div>
    )
  }
}
