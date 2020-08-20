import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTranslate } from 'react-localize-redux';
import { LIMIT_ORDER_CONFIG } from "../../services/constants";
import * as limitOrderActions from "../../actions/limitOrderActions";

@connect((store, props) => {
  return {
    translate: getTranslate(store.locale),
    limitOrder: store.limitOrder
  }
})
export default class Pagination extends React.Component {
  range = (start, end) => {
    const arr = [];
    for (let i = start; i < end; i++) {
      arr.push(i)
    }
    return arr;
  }
  
  generatePageRange = (start, end, activePage) => {
    const component = this.range(start, end).map(item => {
      return <div className={`Pagination__page-item ${item == activePage ? "Pagination__page-item--selected theme__button-2" : ""}`}
        key={item} 
        onClick={(e) => this.validatePageIndex(item)}
      >
        {item}
      </div>
    });

    return component;
  }

  listPage = () => {
    const { filterMode, ordersCount } = this.props.limitOrder;

    const totalPage = filterMode === "client" ? this.props.pages : Math.ceil(ordersCount / LIMIT_ORDER_CONFIG.pageSize);
    const activePage = filterMode === "client" ? this.props.page + 1 : this.props.limitOrder.pageIndex;

    if (totalPage >= 10) {
      if (1 <= activePage && activePage <= 3) {
        const pageRange = this.generatePageRange(1, 4, activePage);

        return (
          <React.Fragment>
            {pageRange}
            <span>...</span>
            <div className={`Pagination__page-item ${activePage == totalPage ? "Pagination__page-item--selected theme__button-2" : ""}`}
              key={totalPage} 
              onClick={(e) => this.validatePageIndex(totalPage)}>
              {totalPage}
            </div>
          </React.Fragment>
        )
      } else if (totalPage - 2 <= activePage && activePage <= totalPage) {
        const pageRange = this.generatePageRange(totalPage - 2, totalPage + 1, activePage);

        return (
          <React.Fragment>
            <div className={`Pagination__page-item ${activePage == 1 ? "Pagination__page-item--selected theme__button-2" : ""}`}
              key={1} 
              onClick={(e) => this.validatePageIndex(1)}>
              {1}
            </div>
            <span>...</span>
            {pageRange}
          </React.Fragment>
        )
      } else {
        const pageRange = this.generatePageRange(activePage - 1, activePage + 2, activePage);
      
        return (
          <React.Fragment>
            <div className={`Pagination__page-item ${activePage == 1 ? "Pagination__page-item--selected theme__button-2" : ""}`}
              key={1} 
              onClick={(e) => this.validatePageIndex(1)}>
              {1}
            </div>
            <span>...</span>
              {pageRange}
            <span>...</span>
            <div className={`Pagination__page-item ${activePage == totalPage ? "Pagination__page-item--selected theme__button-2" : ""}`}
              key={totalPage} 
              onClick={(e) => this.validatePageIndex(totalPage)}>
              {totalPage}
            </div>
          </React.Fragment>
        )
      }
    } else {
      return this.generatePageRange(1, totalPage + 1, activePage);
    }
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
      <div className={`Pagination__container ${this.props.screen}`}>
        {/* Total count */}
        <span className="Pagination__count">{`Total ${filterMode === "client" ? totalCount : ordersCount} orders`}</span>
        {/* Previous button */}
        <div className={"Pagination__panel"}>
          <div className="Pagination__button" onClick={(e) => this.validatePageIndex(pageIndex - 1)}>
            <span className="Pagination__button--prev"/>
          </div>


          {/* Page selection */}
          <div className="Pagination__page-selection">
            {this.listPage()}
          </div>

          {/* Next button */}
          <div className="Pagination__button" onClick={(e) => this.validatePageIndex(pageIndex + 1)}>
            <span className="Pagination__button--next"/>
          </div>
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