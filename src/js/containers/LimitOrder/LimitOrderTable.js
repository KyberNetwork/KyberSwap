import React, { Component } from 'react';
import { connect } from "react-redux"
import ReactTable from "react-table";
import { getTranslate } from 'react-localize-redux';
import Dropdown, { DropdownContent } from "react-simple-dropdown";
import LimitOrderPagination from "./LimitOrderPagination";
import { getFormattedDate } from "../../utils/common";
import {
  roundingRateNumber,
  multiplyOfTwoNumber,
  formatNumber,
  displayNumberWithDot,
  divOfTwoNumber
} from "../../utils/converter";
import ReactTooltip from "react-tooltip";
import { LIMIT_ORDER_CONFIG } from "../../services/constants";
import PropTypes from "prop-types";
import * as limitOrderActions from "../../actions/limitOrderActions";
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { sortBy } from "underscore";
import OrderDetails from "./MobileElements/OrderDetails";

@connect((store, props) => {
  return {
    translate: getTranslate(store.locale),
    limitOrder: store.limitOrder
  }
})
export default class LimitOrderTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentOrder: null,
      cancelOrderModalVisible: false,
      typeFilterVisible: false,
      statusFilterVisible: false,
      conditionFilterVisible: false,
      addressFilterVisible: false,
      addressCopied: false,
      currentTooltipId: '',
    }
  }

  getColumns = () => {
    // ---------------
    // Desktop columns
    // ---------------
    let desktopColumns = [{
      id: "date",
      Header: this.getHeader("date"),
      accessor: item => item,
      Cell: props => this.getDateCell(props.value),
      headerClassName: "cell-flex-start-header cell-date-header",
      className: "cell-flex-start cell-text-small cell-date theme__text-4",
      lineHeight: 35,
      getHeaderProps: (state, rowInfo) => {
        return {
          onClick: (e) => {
            this.handleSortDate();
          }
        }
      }
    }, {
      id: "condition",
      Header: this.getHeader("condition"),
      accessor: item => item,
      Cell: props => this.getConditionCell(props.value),
      headerClassName: "cell-flex-start-header cell-condition-header",
      className: "cell-flex-start cell-condition theme__text-4",
    }, {
      id: "type",
      Header: this.getHeader("type"),
      accessor: item => item,
      Cell: props => this.getTypeCell(props.value),
      headerClassName: "cell-flex-start-header cell-condition-header",
      className: "cell-flex-start cell-condition theme__text-4",
    }, {
      id: "price",
      Header: this.getHeader("price"),
      accessor: item => item,
      Cell: props => this.getPriceCell(props.value),
      headerClassName: "cell-flex-end-header",
      className: "cell-flex-end theme__text-4",
    }, {
      id: "amount",
      Header: this.getHeader("amount"),
      accessor: item => item,
      Cell: props => this.getAmountCell(props.value),
      headerClassName: "cell-flex-end-header",
      className: "cell-flex-end cell-from theme__text-4",
    }, {
      id: "total",
      Header: this.getHeader("total"),
      accessor: item => item,
      Cell: props => this.getTotalCell(props.value),
      headerClassName: "cell-flex-end-header",
      className: "cell-flex-end cell-to theme__text-4",
    }, {
      id: "status",
      Header: this.getHeader("status"),
      accessor: item => item,
      Cell: props => this.getStatusCell(props.value),
      headerClassName: "cell-flex-end-header cell-status-header",
      className: "cell-flex-end cell-state theme__text-4",
    }, {
      expander: true,
      show: false
    }];

    const {activeOrderTab} = this.props.limitOrder;
    let columnWidths = [100, 110, 40, 120, 140, 140, 120];

    if (activeOrderTab === "history") {
      desktopColumns.splice(desktopColumns.length-2, 0, {
        id: "receive",
        Header: this.getHeader("received"),
        accessor: item => item,
        Cell: props => this.getReceiveCell(props.value),
        headerClassName: "cell-flex-end-header theme__background",
        className: "cell-flex-end theme__text-4",
        maxWidth: 80
      });
  
      columnWidths = [90, 90, 40, 90, 120, 120, 110, 120];
    }
    
    if (this.props.screen === "mobile") {
      return [
        {
          id: "mobile-order",
          Header: this.getHeader("mobile-order"),
          accessor: item => item,
          Cell: props => this.getOrderMobileTableCell(props.value),
        }
      ];
    } else {
      for (let i = 0; i < desktopColumns.length ; i++) {
        desktopColumns[i]["width"] = columnWidths[i]
      }
      
      return desktopColumns;
    }
  };

  // --------------
  // Render cell
  // --------------
  getDateCell = (props) => {
    const { updated_at, status } = props;
    const datetime = getFormattedDate(updated_at);
    return (
      <div>{datetime}</div>
    )
  }

  setCopiedState = (copied, currentTooltipId = '') => {
    this.setState({
      addressCopied: copied,
      currentTooltipId
    })
  }

  getCopyTooltipContent = () => {
    return this.state.addressCopied ? (this.props.translate("transaction.copied") || "Copied") : '';
  }

  getAddressCell = (props) => {
    const { user_address, id } = props;
    return (
      <div key={this.state.addressCopied}>
        <CopyToClipboard text={user_address}>
          <div className={"clickable"} data-for={`copy-address-${id}`} data-tip="" onClick={() => this.setCopiedState(true, `copy-address-${id}`)}>{`${user_address.slice(0, 6)} ... ${user_address.slice(-4)}`}</div>
        </CopyToClipboard>
      </div>
    )
  }

  getConditionCell = (props) => {
    let { source, dest, side_trade } = props;
    source = source ? source : '--';
    dest = dest ? dest : '--';
    const pair = side_trade === "buy" ? `${dest}/${source}` : `${source}/${dest}`;

    if (this.props.screen === "mobile") {
      return (
        <div className="cell-pair__mobile">
          {this.getDateCell(props)}
          <div className="cell-pair__mobile--rate">{pair}</div>
          {this.getAddressCell(props)}
        </div>
      )
    }

    return <div>{pair}</div>
  };

  getTypeCell = (props) => {
    return (
      <div className={"common__uppercase"}>{props.side_trade ? props.side_trade : '---'}</div>
    )
  };

  getPriceCell = (props) => {
    let { min_rate, side_trade } = props;
    const { screen } = this.props;
    let rate = displayNumberWithDot(min_rate, 9);

    if (side_trade === 'buy') {
      const fullRate = divOfTwoNumber(1, min_rate);
      rate = roundingRateNumber(fullRate);
      min_rate = `~${fullRate}`;
    }

    if (screen === "mobile") {
      return (
        <div className="cell-pair__mobile">
          {this.getDateCell(props)}
          <div className="cell-pair__mobile--rate">{`${rate}`}</div>
          {this.getAddressCell(props)}
        </div>
      )
    }

    return (
      <div><span title={min_rate}>{rate}</span></div>
    )
  };

  getAmountCell = (props) => {
    const { source, dest, min_rate, src_amount, side_trade } = props;
    const amount = side_trade === "buy" ? formatNumber(multiplyOfTwoNumber(src_amount, min_rate), 5) : formatNumber(src_amount, 5)
    const unit = side_trade === "buy" ? dest : source
    return (
      <div>
        <span className="to-number-cell">{amount}</span>{' '}
        <span>{unit}</span>
      </div>
    )
  };

  getTotalCell = (props) => {
    const { source, dest, min_rate, src_amount, side_trade } = props;
    const amount = side_trade === "buy" ? formatNumber(src_amount, 5) : formatNumber(multiplyOfTwoNumber(src_amount, min_rate), 5)
    const unit = side_trade === "buy" ? source : dest;
    return (
      <div>
        <span className="to-number-cell">{amount}</span>{' '}
        <span>{unit ? unit : '--'}</span>
      </div>
    )
  }

  getReceiveCell = (props) => {
    const { receive, dest, status} = props;
    return (
      <div>
        <span className="to-number-cell">{status === LIMIT_ORDER_CONFIG.status.FILLED ? `${formatNumber(receive, 5)} ${dest}` : "-"}</span>
      </div>
    )
  };

  getStatusCell = (props) => {
    const { status, msg, id } = props;

    return (
      <div className="cell-status__container">
        <div className={`cell-status cell-status--${status} ${this.props.screen === "mobile" ? "cell-status__mobile" : ""}`}>{status.toUpperCase()}</div>
        {msg && msg.length > 0 &&
          <React.Fragment>
            <div data-tip data-for={`order-status-info-${id}`} data-scroll-hide={true} className={`status-info-icon ${this.props.screen === "mobile" ? "status-info-icon__mobile" : ""}`}>
              <img src={require("../../../assets/img/warning-triangle.svg")}/>
            </div>
            <ReactTooltip
              globalEventOff="click"
              effect="solid"
              event="click mouseenter mouseleave"
              html={true}
              place="bottom"
              type="dark"
              id={`order-status-info-${id}`}
              className="order-status-info"
              getContent={() => msg}
            />
          </React.Fragment>
        }
      </div>
    )
  }

  handleSortDate = () => {
    if (this.props.limitOrder.dateSort === "desc") {
      this.props.dispatch(limitOrderActions.getOrdersByFilter({
        dateSort: "asc"
      }));
    } else {
      this.props.dispatch(limitOrderActions.getOrdersByFilter({
        dateSort: "desc"
      }));
    }
  }

  getOrderMobileTableCell = (row) => {
    return (
      <OrderDetails
        order={row}
        openCancelOrderModal={this.props.openCancelOrderModal}
        translate={this.props.translate}
      />
    )
  };

  // -------------------------------
  // Render pair filter dropdown
  // -------------------------------
  getPairFilter = () => {
    const { pairFilter, orderPairs } = this.props.limitOrder;

    const renderedPair = orderPairs.map(item => {
      const checked = pairFilter.indexOf(item) !== -1;

      return (
        <label key={item} className="pair-filter-modal__option">
          <span>{item.split("-")[0]}</span>{' '}
          <span>&rarr;</span>{' '}
          <span>{item.split("-")[1]}</span>
          <input
            type="checkbox"
            value={item}
            checked={checked}
            className="pair-filter-modal__checkbox"
            onChange={e => this.handleFilterPair(e)}
          />
          <span className="pair-filter-modal__checkmark--checkbox"></span>
        </label>
      )
    });

    return (
      <div className="pair-filter-modal theme__background theme__text-3">
        <div className="pair-filter-modal__advance">
          {renderedPair}
        </div>
      </div>
    )
  }

  handleFilterPair = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      const pairFilter = [...this.props.limitOrder.pairFilter, value];
      this.props.dispatch(limitOrderActions.getOrdersByFilter({
        pageIndex: 1,
        pairFilter
      }));
    } else {
      const pairFilter = [...this.props.limitOrder.pairFilter];
      const index = pairFilter.indexOf(value);
      if (index !== -1) {
        pairFilter.splice(index, 1);
        this.props.dispatch(limitOrderActions.getOrdersByFilter({
          pageIndex: 1,
          pairFilter
        }));
      }
    }
  }

  // ------------------------------
  // Render status filter dropdown
  // ------------------------------
  getStatusFilter = () => {
    const { statusFilter, activeOrderTab } = this.props.limitOrder;
    const filteredStatus = activeOrderTab === "open" ?
      [LIMIT_ORDER_CONFIG.status.OPEN, LIMIT_ORDER_CONFIG.status.IN_PROGRESS]
      : [LIMIT_ORDER_CONFIG.status.FILLED, LIMIT_ORDER_CONFIG.status.CANCELLED, LIMIT_ORDER_CONFIG.status.INVALIDATED];

    const getTitle = (status) => {
      if (status === LIMIT_ORDER_CONFIG.status.IN_PROGRESS) {
        return "In Progress";
      } else {
        return status.charAt(0).toUpperCase() + status.slice(1);
      }
    }

    const renderedStatus = filteredStatus.map((item) => {
      const checked = statusFilter.indexOf(item) !== -1;

      return (
        <label key={item} className="status-filter-modal__option theme__text">
          <span>{getTitle(item)}</span>
          <input
            type="checkbox"
            value={item}
            name={item}
            checked={checked}
            className="status-filter-modal__checkbox"
            onChange={e => this.handleFilterStatus(e)}
          />
          <span className="status-filter-modal__checkmark--checkbox"></span>
        </label>
      )
    });

    return (
      <div className="status-filter-modal theme__background theme__text-3" >
        {renderedStatus}
      </div>
    )
  };

  getTypeFilter = () => {
    const { typeFilter } = this.props.limitOrder;
    return <div className="status-filter-modal theme__background theme__text-3" >
      {["buy", "sell"].map((item) => {
        const checked = typeFilter.indexOf(item) !== -1;
        return (
            <label key={item} className="status-filter-modal__option theme__text">
              <span className={"common__uppercase"}>{item}</span>
              <input
                  type="checkbox"
                  value={item}
                  name={item}
                  checked={checked}
                  className="status-filter-modal__checkbox"
                  onChange={e => this.handleFilterType(e)}
              />
              <span className="status-filter-modal__checkmark--checkbox"></span>
            </label>
        )
      })}
    </div>
  };

  handleFilterType = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      const typeFilter = [...this.props.limitOrder.typeFilter, value];
      this.props.dispatch(limitOrderActions.getOrdersByFilter({
        pageIndex: 1,
        typeFilter
      }));
    } else {
      const typeFilter = [...this.props.limitOrder.typeFilter];
      const index = typeFilter.indexOf(value);
      if (index !== -1) {
        typeFilter.splice(index, 1);

        this.props.dispatch(limitOrderActions.getOrdersByFilter({
          pageIndex: 1,
          typeFilter
        }));
      }
    }
  }

  handleFilterStatus = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      const statusFilter = [...this.props.limitOrder.statusFilter, value];
      this.props.dispatch(limitOrderActions.getOrdersByFilter({
        pageIndex: 1,
        statusFilter
      }));
    } else {
      const statusFilter = [...this.props.limitOrder.statusFilter];
      const index = statusFilter.indexOf(value);
      if (index !== -1) {
        statusFilter.splice(index, 1);

        this.props.dispatch(limitOrderActions.getOrdersByFilter({
          pageIndex: 1,
          statusFilter
        }));
      }
    }
  }

  // --------------------------------
  // Toggling status filter dropdown
  // --------------------------------
  togglingTypeFilter = () => {
    this.setState({
      conditionFilterVisible: this.state.conditionFilterVisible ? false : this.state.conditionFilterVisible,
      addressFilterVisible: this.state.addressFilterVisible ? false: this.state.addressFilterVisible,
      statusFilterVisible: this.state.statusFilterVisible ? false: this.state.statusFilterVisible,
      typeFilterVisible: !this.state.typeFilterVisible
    });
  }

  togglingStatusFilter = () => {
    this.setState({
      conditionFilterVisible: this.state.conditionFilterVisible ? false : this.state.conditionFilterVisible,
      addressFilterVisible: this.state.addressFilterVisible ? false: this.state.addressFilterVisible,
      typeFilterVisible: this.state.typeFilterVisible ? false: this.state.typeFilterVisible,
      statusFilterVisible: !this.state.statusFilterVisible
    });
  }

  togglingConditionFilter = () => {
    if (this.props.limitOrder.orderPairs.length === 0) return;
    this.setState({
      statusFilterVisible: this.state.statusFilterVisible ? false : this.state.statusFilterVisible,
      addressFilterVisible: this.state.addressFilterVisible ? false : this.state.addressFilterVisible,
      typeFilterVisible: this.state.typeFilterVisible ? false : this.state.typeFilterVisible,
      conditionFilterVisible: !this.state.conditionFilterVisible
    })
  }

  togglingAddressFilter = () => {
    if (this.props.limitOrder.orderAddresses.length === 0) return;
    this.setState({
      conditionFilterVisible: this.state.conditionFilterVisible ? false : this.state.conditionFilterVisible,
      statusFilterVisible: this.state.statusFilterVisible ? false : this.state.statusFilterVisible,
      typeFilterVisible: this.state.typeFilterVisible ? false : this.state.typeFilterVisible,
      addressFilterVisible: !this.state.addressFilterVisible
    });
  }

  // --------------
  // Render header
  // --------------
  getHeader = (title) => {
    const pairFilter = (
      <Dropdown active={this.state.conditionFilterVisible} onHide={this.togglingConditionFilter}>
        <div className={"limit-order-table__dropdown"}>
          <span>{(this.props.translate("limit_order.pair") || "Pair").toUpperCase()}</span>
          <div className={`common__triangle theme__border-top ${this.state.conditionFilterVisible ? 'up' : ''}`}/>
        </div>
        <DropdownContent>
          {this.getPairFilter()}
        </DropdownContent>
      </Dropdown>
    );

    const statusFilter = (
      <Dropdown active={this.state.statusFilterVisible} onHide={this.togglingStatusFilter}>
        <div className={"limit-order-table__dropdown"}>
          <span>{(this.props.translate("limit_order.status") || "Status").toUpperCase()}</span>
          <div className={`common__triangle theme__border-top ${this.state.statusFilterVisible ? 'up' : ''}`}/>
        </div>
        <DropdownContent>
          {this.getStatusFilter()}
        </DropdownContent>
      </Dropdown>
    );

    if (title === "date") {
      return (
        <div>
          <span>{(this.props.translate("limit_order.date") || "Date").toUpperCase()}</span>
          {this.props.limitOrder.dateSort === "asc" && <img className="limit-order-table__sort-icon" src={require("../../../assets/img/limit-order/sort-asc-icon.svg")} />}
          {this.props.limitOrder.dateSort === "desc" && <img className="limit-order-table__sort-icon" src={require("../../../assets/img/limit-order/sort-desc-icon.svg")} />}
        </div>
      )
    } else if (title === "condition") {
      return pairFilter;
    } else if (title === "status") {
      return statusFilter
    } else if (title === "type") {
      return (
          <Dropdown active={this.state.typeFilterVisible} onHide={e => this.togglingTypeFilter()}>
            <div className={"limit-order-table__dropdown"}>
              <span>{(this.props.translate("limit_order.type") || "Type").toUpperCase()}</span>
              <div className={`common__triangle theme__border-top ${this.state.typeFilterVisible ? 'up' : ''}`}/>
            </div>
            <DropdownContent>
              {this.getTypeFilter()}
            </DropdownContent>
          </Dropdown>
      )
    } else if (title === 'mobile-order') {
      return (
        <div className={'limit-order-table__header'}>
          <div onClick={this.togglingConditionFilter}>{pairFilter}</div>
          <div onClick={this.togglingStatusFilter}>{statusFilter}</div>
        </div>
      )
    } else {
      return (
        <div>{(this.props.translate(`limit_order.${title}`) || title).toUpperCase()}</div>
      )
    }
  }

  clientSideFilter = (orders) => {
    const { addressFilter, pairFilter, timeFilter, typeFilter, statusFilter, activeOrderTab } = this.props.limitOrder;
    let results = JSON.parse(JSON.stringify(orders));

    if (activeOrderTab === "open") {
      results = results.filter(item => {
        const index = [LIMIT_ORDER_CONFIG.status.OPEN, LIMIT_ORDER_CONFIG.status.IN_PROGRESS].indexOf(item.status);
        return index !== -1;
      });
    } else {
      results = results.filter(item => {
        const index = [LIMIT_ORDER_CONFIG.status.CANCELLED, LIMIT_ORDER_CONFIG.status.FILLED, LIMIT_ORDER_CONFIG.status.INVALIDATED].indexOf(item.status);
        return index !== -1;
      });
    }

    // Address filter
    if (addressFilter && addressFilter.length > 0) {
      results = results.filter(item => {
        return addressFilter.indexOf(item.user_address) !== -1;
      });
    }

    // Pair filter
    if (pairFilter && pairFilter.length > 0) {
      results = results.filter(item => {
        const key = `${item.source}-${item.dest}`;
        const index = pairFilter.indexOf(key);
        return index !== -1;
      });
    }

    // Status filter
    if (statusFilter && statusFilter.length > 0) {
      results = results.filter(item => {
        const index = statusFilter.indexOf(item.status);
        return index !== -1;
      });
    }

    // Type filter
    if (typeFilter && typeFilter.length > 0) {
      results = results.filter(item => {
        const index = typeFilter.indexOf(item.side_trade);
        return index !== -1;
      });
    }

    return results;
  }

  // -------------
  // Render data
  // -------------
  renderData = (data) => {
    const { dateSort } = this.props.limitOrder;
    let results = JSON.parse(JSON.stringify(data));

    if (this.props.screen === "mobile") {
      // Add detail visible propety
      results = results.map(item => ({
        ...item,
        isDetailVisible: false
      }));
    }

    if (this.props.limitOrder.filterMode === "client") {
      results = this.clientSideFilter(results);
    }

    if (dateSort) {
      results = sortBy(results, item => {
        // return getFormattedDate(item.updated_at, true);
        return item.updated_at;
      });

      if (dateSort === "desc") {
        results.reverse();
      }
    }

    return results;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.limitOrder.activeOrderTab !== nextProps.limitOrder.activeOrderTab) {
      this.setState({
        statusFilterVisible: false,
        addressFilterVisible: false,
        conditionFilterVisible: false,
      })
    }
  }

  isShowPagination = (data) => {
    if (this.props.limitOrder.filterMode === "client") {
      return data.length > LIMIT_ORDER_CONFIG.pageSize ? true : false;
    } else {
      return this.props.limitOrder.ordersCount > LIMIT_ORDER_CONFIG.pageSize ? true : false;
    }
  }

  render() {
    const columns = this.getColumns();
    const data = this.renderData(this.props.data);

    const PaginationComponent = (props) => (
      <LimitOrderPagination totalCount={data.length} {...props} screen={this.props.screen}/>
    );

    return (
      <div className="limit-order-list--table">
        <ReactTable
          data={data}
          columns={columns}
          showPagination={this.isShowPagination(data)}
          resizable={false}
          sortable={false}
          minRows={0}
          defaultPageSize={LIMIT_ORDER_CONFIG.pageSize}
          pageSizeOptions={[LIMIT_ORDER_CONFIG.pageSize]}
          PaginationComponent={PaginationComponent}
          className={data.length === 0 ? `ReactTable--empty` : ""}
          NoDataComponent={(props) => {
            return (
              <div className="empty-order__message">
                {this.props.translate("limit_order.empty_order") || "There is no order here yet."}
              </div>
            )
          }}
          getTheadProps={(state, rowInfo) => {
            if (this.props.screen === "mobile") {
              return {
                style: { overflow: "visible", height: '25px' },
                className: "theme__text"
              }
            }

            return {
              style: { overflow: "visible" },
              className: "theme__background theme__text"
            }
          }}
          getTheadThProps={(state, rowInfo, column) => {
            if (column.id === "status") {
              return {
                onClick: (e) => {
                  e.stopPropagation();
                  this.togglingStatusFilter();
                }
              }
            } else if (column.id === "condition") {
              return {
                onClick: (e) => {
                  e.stopPropagation();
                  this.togglingConditionFilter();
                }
              }
            } else if (column.id === "address") {
              return {
                onClick: (e) => {
                  e.stopPropagation();
                  this.togglingAddressFilter();
                }
              }
            } else if (column.id === "type") {
              return {
                onClick: (e) => {
                  e.stopPropagation();
                  this.togglingTypeFilter();
                }
              }
            }

            return {};
          }}
          getTrProps={(state, rowInfo) => {
            if (this.props.screen === "mobile") return {};

            return {
              onClick: (e) => {
                e.stopPropagation();
                this.props.openOrderDetailsModal(rowInfo.original)
              }
            }
          }}
        />
        {this.state.addressCopied && (
          <ReactTooltip
            getContent={() => this.getCopyTooltipContent()}
            afterHide={() => this.setCopiedState(false)}
            place="top"
            id={this.state.currentTooltipId}
            type="dark"
          />
        )}
      </div>
    )
  }
}

LimitOrderTable.propTypes = {
  data: PropTypes.array,
  screen: PropTypes.string,
  openCancelOrderModal: PropTypes.func,
  openOrderDetailsModal: PropTypes.func
}
