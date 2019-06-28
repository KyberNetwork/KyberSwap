import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTranslate } from 'react-localize-redux';
import _ from "lodash";
import { LIMIT_ORDER_CONFIG } from "../../services/constants";
import * as limitOrderActions from "../../actions/limitOrderActions";

@connect((store, props) => {
  return {
    translate: getTranslate(store.locale),
    limitOrder: store.limitOrder
  }
})
export default class Pagination extends React.Component {
  listPage = () => {
    const { filterMode, ordersCount } = this.props.limitOrder;

    const totalPage = filterMode === "client" ? this.props.pages + 1 : Math.ceil(ordersCount / LIMIT_ORDER_CONFIG.pageSize) + 1;
    const activePage = filterMode === "client" ? this.props.page + 1 : this.props.limitOrder.pageIndex;

    const component = _.range(1, totalPage).map(item => {
      return <div className={`Pagination__page-item ${item == activePage ? "Pagination__page-item--selected" : ""}`}
        key={item} 
        onClick={(e) => this.validatePageIndex(item)}
      >
        {item}
      </div>
    });

    return component;
  }

  validatePageIndex = (page) => {
    const { filterMode, ordersCount, pageIndex } = this.props.limitOrder;

    if (filterMode === "client") {
      if (page < 1 || page > this.props.pages || page === this.props.page + 1) return;
      this.props.onPageChange(page - 1);
    } else {
      const totalPage = Math.ceil(ordersCount / LIMIT_ORDER_CONFIG.pageSize);
      if (page < 1 || page > totalPage || page === pageIndex) return;
      this.props.dispatch(limitOrderActions.getOrdersByFilter({
        pageIndex: page
      }));
    }
  }

  render() {
    const { totalCount } = this.props;
    const { filterMode, ordersCount } = this.props.limitOrder;

    let pageIndex = 1;
    if (filterMode === "client") {
      pageIndex = this.props.page + 1;
    } else {
      pageIndex = this.props.limitOrder.pageIndex;
    }

    return (
      <div className="Pagination__container">
        {/* Total count */}
        <span className="Pagination__count">{`Total ${filterMode === "client" ? totalCount : ordersCount} orders`}</span>
  
        {/* Previous button */}
        <div className="Pagination__button" onClick={(e) => this.validatePageIndex(pageIndex - 1)}>
          <img src={require("../../../assets/img/prev.svg")}/>
        </div>
        
  
        {/* Page selection */}
        <div className="Pagination__page-selection">
          {this.listPage()}
        </div>
  
        {/* Next button */}
        <div className="Pagination__button" onClick={(e) => this.validatePageIndex(pageIndex + 1)}>
          <img src={require("../../../assets/img/next.svg")}/>
        </div>
      </div>
    )
  }
}

Pagination.propTypes = {
  pages: PropTypes.number,
  page: PropTypes.number,
  onPageChange: PropTypes.func,
}