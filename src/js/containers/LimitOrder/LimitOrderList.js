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
      selectedTimeFilter: {
        interval: 1, unit: 'month'
      },
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
    this.setState({
      selectedTimeFilter: {
        interval: item.interval,
        unit: item.unit
      }
    });
  }
  
  // Render time filter
  getTimeFilter = () => {
    const { timeFilter, selectedTimeFilter } = this.state;

    return timeFilter.map((item, index) => {
      // Translate date unit
      const convertedUnit = this.props.translate(`limit_order.${item.unit.toLowerCase()}`) || item.unit.charAt(0) + item.unit.slice(1);

      let className = "";
      if (item.unit === selectedTimeFilter.unit && item.interval === selectedTimeFilter.interval) {
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
            <div className="title">{this.props.translate("limit_order.order_list_title") || "Manage Your Orders"}</div>
            <div className="limit-order-list__filter-container">
              <ul className="filter">
                {this.getTimeFilter()}
              </ul>
            </div>
            
          </div>
          <div className="limit-order-list--table">
            <LimitOrderTable 
              data={this.props.limitOrder.listOrder}
              screen="desktop"
              selectedTimeFilter={this.state.selectedTimeFilter}
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
