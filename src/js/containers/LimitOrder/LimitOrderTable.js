import React, { Component } from 'react';
import { connect } from "react-redux"
import ReactTable from "react-table";
import { getTranslate } from 'react-localize-redux';
import Dropdown, { DropdownContent } from "react-simple-dropdown";
import LimitOrderPagination from "./LimitOrderPagination";
import { getFormattedDate } from "../../utils/common";
import { roundingNumber } from "../../utils/converter";
import ReactTooltip from "react-tooltip";
import { LIMIT_ORDER_CONFIG } from "../../services/constants";
import PropTypes from "prop-types";
import * as limitOrderActions from "../../actions/limitOrderActions";
import { calcInterval, isArrayEqual } from "../../utils/common";
import { CopyToClipboard } from 'react-copy-to-clipboard'

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
      statusFilterVisible: false,
      conditionFilterVisible: false,
      addressFilterVisible: false,
      expanded: {},
      addressCopied: false,
    }
    
    this.btnCancelRef = null;
	}

	getColumns = () => {
    // ---------------
    // Desktop columns
    // ---------------
		const desktopColumns = [{
      id: "date",
      Header: this.getHeader("date"),
      accessor: item => item,
      Cell: props => this.getDateCell(props.value),
      headerClassName: "cell-flex-start-header cell-date-header",
      className: "cell-flex-start",
      maxWidth: 95,
      getHeaderProps: (state, rowInfo) => {
        return {
          onClick: (e) => {
            this.handleSortDate();
          }
        }
      }
    }, {
      id: "address",
      Header: this.getHeader("address"),
      accessor: item => item,
      Cell: props => this.getAddressCell(props.value),
      headerClassName: "cell-flex-start-header cell-condition-header",
      className: "cell-flex-start",
      width: 150,
    }, {
      id: "condition",
      Header: this.getHeader("condition"),
      accessor: item => item,
      Cell: props => this.getConditionCell(props.value),
      headerClassName: "cell-flex-start-header cell-condition-header",
      className: "cell-flex-start cell-condition",
      width: 185
    }, {
      id: "from",
      Header: this.getHeader("from"),
      accessor: item => ({ source: item.source, sourceAmount: item.src_amount }),
      Cell: props => this.getFromCell(props.value),
      headerClassName: "cell-flex-start-header",
      className: "cell-flex-start cell-from",
    }, {
      id: "to",
      Header: this.getHeader("to"),
      accessor: item => ({ dest: item.dest, minRate: item.min_rate, sourceAmount: item.src_amount, fee: item.fee }),
      Cell: props => this.getToCell(props.value),
      headerClassName: "cell-flex-start-header",
      className: "cell-flex-start cell-to",
    }, {
      id: "status",
      Header: this.getHeader("status"),
      accessor: item => item,
      Cell: props => this.getStatusCell(props.value),
      headerClassName: "cell-flex-center-header cell-status-header",
      className: "cell-flex-center",
      width: 130
    }, {
      id: "actions",
      Header: this.getHeader("actions"),
      accessor: item => item,
      Cell: props => this.getActionCell(props.value),
      maxWidth: 80
		}, {
      expander: true,
      show: false
    }];
    
    // --------------
    // Mobile columns
    // --------------
    const mobileColumns = [{
      id: "condition",
      Header: this.getHeader("condition"),
      accessor: item => item,
      Cell: props => this.getConditionCell(props.value),
      headerClassName: "cell-flex-start-header cell-condition-header",
      className: "cell-flex-start cell-condition",
    }, {
      id: "status",
      Header: this.getHeader("status"),
      accessor: item => item,
      Cell: props => this.getStatusCell(props.value),
      headerClassName: "cell-flex-end-header cell-status-header",
      className: "cell-flex-end",
      maxWidth: 130 
    }, {
      expander: true,
      show: false
    }];

		if (this.props.screen === "mobile") {
      return mobileColumns;
		} else {
			// Default render desktop version table
			return desktopColumns;
		}
  }

	// --------------
	// Render cell
	// --------------
	getDateCell = (props) => {
    const { updated_at, status } = props;
    const timestamp = updated_at;
    const datetime = getFormattedDate(timestamp);
    return (
      <div>{datetime}</div>
    )
  }

  setCopiedState = (copied) => {
    this.setState({ addressCopied: copied })
  }

  getCopyTooltipContent = () => {
    return this.state.addressCopied ? (this.props.translate("transaction.copied") || "Copied") : '';
  }

  getAddressCell = (props) => {
    const { user_address, id } = props;
    return (
      <div key={this.state.addressCopied}>
        <CopyToClipboard text={user_address}>
          <div className={"clickable"} data-for={`copy-address-${id}`} data-tip="" onClick={() => this.setCopiedState(true)}>{`${user_address.slice(0, 8)} ... ${user_address.slice(-6)}`}</div>
        </CopyToClipboard>

        <ReactTooltip
          getContent={() => this.getCopyTooltipContent()}
          afterHide={() => this.setCopiedState(false)}
          place="top"
          id={`copy-address-${id}`}
          type="dark"
        />
      </div>
    )
  }

  getConditionCell = (props) => {
    const { source, dest, status, updated_at, min_rate } = props;
    const { screen } = this.props;

    const datetime = updated_at;
    const rate = roundingNumber(min_rate);

    if (screen === "mobile") {
      return (
        <div className="cell-pair__mobile">
          {this.getDateCell(props)}
          {/* <div>
            <span>{source.toUpperCase()}</span>
            <span>&rarr;</span>
            <span>{dest.toUpperCase()}</span>
          </div> */}
          <div className="cell-pair__mobile--rate">{`${source.toUpperCase()}/${dest.toUpperCase()} >= ${rate}`}</div>
          {this.getAddressCell(props)}
        </div>
      )
    } 
    return (
      <div>{`${source.toUpperCase()}/${dest.toUpperCase()} >= ${rate}`}</div>
    )
  }

  getFromCell = (props) => {
    const { source, sourceAmount } = props;
    let amount = roundingNumber(sourceAmount);
    return (
      <div>
        <span class="from-number-cell">{amount}</span>{' '}
        <span>{source.toUpperCase()}</span>
      </div>
    )
  }

  getToCell = (props) => {
    const { dest, minRate, fee, sourceAmount } = props;
    let destAmount = sourceAmount * (1 - fee) * minRate;  // fee already in percentage format
    destAmount = roundingNumber(destAmount);
    return (
      <div>
        <span className="to-number-cell">{destAmount}</span>{' '}
        <span>{dest.toUpperCase()}</span>
      </div>
    )
  }

  getStatusCell = (props) => {
    const { status, msg, id } = props;

    const getMsg = (msg) => {
      // return msg.reduce((result, item) => {
      //   return result += `<div>${item}</div>`;
      // }, "");
      return `<div>${msg}</div>`
    }

    return (
      <div className="cell-status__container">
        <div className={`cell-status cell-status--${status} ${this.props.screen === "mobile" ? "cell-status__mobile" : ""}`}>{status.toUpperCase()}</div>
        {msg && msg.length > 0 && 
        <React.Fragment>
          <div data-tip data-for={`order-status-info-${id}`} data-scroll-hide={true} className={`status-info-icon ${this.props.screen === "mobile" ? "status-info-icon__mobile" : ""}`}>
            <img src={require("../../../assets/img/warning-triangle.svg")}/>
          </div>
          <ReactTooltip globalEventOff="click"
            effect="solid"
            event="click mouseenter mouseleave"
            html={true} 
            place="bottom" 
            type="dark" 
            id={`order-status-info-${id}`} 
            className="order-status-info">
            {getMsg(msg)}
          </ReactTooltip>
        </React.Fragment>}
      </div>
    )
  }

  getActionCell = (props) => {
    const { status } = props;
    return (
      <div className="cell-action">
        {status === LIMIT_ORDER_CONFIG.status.OPEN && <button className="btn-cancel-order" onClick={e =>this.props.openCancelOrderModal(props)}>{this.props.translate("limit_order.cancel") || "Cancel"}</button>}
        {status !== LIMIT_ORDER_CONFIG.status.OPEN && this.props.screen !== "mobile" && <div className="line-indicator"></div>}
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

  // -----------------------------------
  // On mobile only: Toggle detail order
  // -----------------------------------
  toggleDetailOrder = (row) => {
    const expanded = {...this.state.expanded};

    if (expanded[row.index]) {
      expanded[row.index] = !expanded[row.index];
    } else {
      expanded[row.index] = true;
    }

    this.setState({
      expanded
    });
  }

  getOrderDetail = (row) => {
    const { source, dest, min_rate, status, updated_at, src_amount, fee } = row.original;

    const rate = roundingNumber(min_rate);

    const sourceAmount = roundingNumber(src_amount);
    let destAmount = src_amount * (1 - fee / 100) * min_rate;
    destAmount = roundingNumber(destAmount);

    return (
      <div className="limit-order-modal__detail-order">
        <div>
          <div className="cell-pair__mobile">
            {this.getDateCell(row.original)}
            {/* <div className="cell-pair">
              <span>{source.toUpperCase()}</span>
              <span>&rarr;</span>
              <span>{dest.toUpperCase()}</span>
            </div> */}
            <div>{`${source.toUpperCase()}/${dest.toUpperCase()} >= ${rate}`}</div>
            {this.getAddressCell(row.original)}
          </div>
          <div className="limit-order-modal__detail-order__rate">
            {this.getStatusCell(row.original)}
          </div>
        </div>
        {/* Amount */}
        <div>
          <div className="limit-order-modal__detail-order__amount limit-order-modal__detail-order__amount--from">
            <div>{this.props.translate("limit_order.from") || "From"}</div>
            <div className="cell-from">
              <span class="from-number-cell">{sourceAmount}</span>{' '}
              <span>{source.toUpperCase()}</span>
            </div>
          </div>
          <div className="limit-order-modal__detail-order__amount">
            <div>{this.props.translate("limit_order.to") || "To"}</div>
            <div className="cell-to">
              <span class="to-number-cell">{destAmount}</span>{' '}
              <span>{dest.toUpperCase()}</span>
            </div>
          </div>
        </div>
        {/* Button */}
        <div>
          {this.getActionCell(row.original)}
        </div>
      </div>
      
    )
  }

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
          <input type="checkbox" value={item}
            checked={checked}
            className="pair-filter-modal__checkbox" 
            onChange={e => this.handleFilterPair(e)}/>
          <span className="pair-filter-modal__checkmark--checkbox"></span>
        </label>
      )
    });

    return (
      <div className="pair-filter-modal">
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
    const { statusFilter } = this.props.limitOrder;
    const status = Object.keys(LIMIT_ORDER_CONFIG.status).map(key => LIMIT_ORDER_CONFIG.status[key]);

    const getTitle = (status) => {
      if (status === LIMIT_ORDER_CONFIG.status.IN_PROGRESS) {
        return "In Progress";
      } else {
        return status.charAt(0).toUpperCase() + status.slice(1);
      }
    }

    const renderedStatus = status.map((item) => {
      const checked = statusFilter.indexOf(item) !== -1;

      return (
        <label key={item} className="status-filter-modal__option">
          <span>{getTitle(item)}</span>
          <input type="checkbox" value={item} name={item} 
                checked={checked}
                className="status-filter-modal__checkbox"
                onChange={e => this.handleFilterStatus(e)}/>
          <span className="status-filter-modal__checkmark--checkbox"></span>
        </label>
      )
    });

    return (
      <div className="status-filter-modal" >
        {renderedStatus}
      </div>
    )
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
  // Render address filter dropdown
  // --------------------------------
  getAddressFilter = () => {
    const { addressFilter, orderAddresses } = this.props.limitOrder;
    
    const renderedComp = orderAddresses.map(item => {
      const checked = addressFilter.indexOf(item) !== -1;

      return (
        <label key={item} className="status-filter-modal__option">
          <span>{`${item.slice(0, 8)} ... ${item.slice(-6)}`}</span>
          <input type="checkbox" value={item} name={item} 
                checked={checked}
                className="status-filter-modal__checkbox"
                onChange={e => this.handleFilterAddress(e)}/>
          <span className="status-filter-modal__checkmark--checkbox"></span>
        </label>
      )
    });

    return (
      <div className="address-filter-modal">
        {renderedComp}
      </div>
    )
  }

  handleFilterAddress = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      const addressFilter = [...this.props.limitOrder.addressFilter, value];
      this.props.dispatch(limitOrderActions.getOrdersByFilter({
        pageIndex: 1,
        addressFilter
      }));
    } else {
      const addressFilter = [...this.props.limitOrder.addressFilter];
      const index = addressFilter.indexOf(value);
      if (index !== -1) {
        addressFilter.splice(index, 1);
        this.props.dispatch(limitOrderActions.getOrdersByFilter({
          pageIndex: 1,
          addressFilter
        }));
      }
    }
  }

  // --------------------------------
  // Toggling status filter dropdown
  // --------------------------------
  togglingStatusFilter = () => {
    this.setState({
      conditionFilterVisible: this.state.conditionFilterVisible ? false : this.state.conditionFilterVisible,
      addressFilterVisible: this.state.addressFilterVisible ? false: this.state.addressFilterVisible,
      statusFilterVisible: !this.state.statusFilterVisible
    });
  }

  togglingConditionFilter = () => {
    if (this.props.limitOrder.orderPairs.length === 0) return;
    this.setState({
      statusFilterVisible: this.state.statusFilterVisible ? false : this.state.statusFilterVisible,
      addressFilterVisible: this.state.addressFilterVisible ? false : this.state.addressFilterVisible,
      conditionFilterVisible: !this.state.conditionFilterVisible
    })
  }

  togglingAddressFilter = () => {
    if (this.props.limitOrder.orderAddresses.length === 0) return;
    this.setState({
      conditionFilterVisible: this.state.conditionFilterVisible ? false : this.state.conditionFilterVisible,
      statusFilterVisible: this.state.statusFilterVisible ? false : this.state.statusFilterVisible,
      addressFilterVisible: !this.state.addressFilterVisible
    });
  }

	// --------------
	// Render header
	// --------------
	getHeader = (title) => {
    if (title === "date") {
      return (
        <div>
          <span>{this.props.translate("limit_order.date") || "Date"}</span>
          {this.props.limitOrder.dateSort === "asc" && <img src={require("../../../assets/img/limit-order/sort-asc-icon.svg")} />}
          {this.props.limitOrder.dateSort === "desc" && <img src={require("../../../assets/img/limit-order/sort-desc-icon.svg")} />}
        </div>
      )
    } else if (title === "address") {
      return (
        <Dropdown active={this.state.addressFilterVisible} onHide={e => this.togglingAddressFilter()}>
          <div>
            <span>{this.props.translate("address.address") || "Address"}</span>
            <div className="drop-down">
              <img src={require("../../../assets/img/v3/price_drop_down.svg")}/>
            </div>
          </div>
          <DropdownContent>
            {this.getAddressFilter()}
          </DropdownContent>
        </Dropdown>
      )
    } else if (title === "condition") {
      return (
        <Dropdown active={this.state.conditionFilterVisible} onHide={e => this.togglingConditionFilter()}>
          <div>
            <span>{this.props.translate("limit_order.condition") || "Condition"}</span>
            <div className="drop-down">
              <img src={require("../../../assets/img/v3/price_drop_down.svg")}/>
            </div>
          </div>
          <DropdownContent>
            {this.getPairFilter()}
          </DropdownContent>
        </Dropdown>
      )
    } else if (title === "status") {
      return (
        <Dropdown active={this.state.statusFilterVisible} onHide={e => this.togglingStatusFilter()}>
          <div>
            <span>{this.props.translate("limit_order.status") || "Status"}</span>
            <div className="drop-down">
              <img src={require("../../../assets/img/v3/price_drop_down.svg")}/>
            </div>
          </div>
          <DropdownContent>
            {this.getStatusFilter()}
          </DropdownContent>
        </Dropdown>
      )
    } else {
      return (
        <div>{this.props.translate(`limit_order.${title}`) || title.charAt(0).toUpperCase() + title.slice(1)}</div>
      )
    }
  }
  
  clientSideFilter = (orders) => {
    const { addressFilter, pairFilter, timeFilter, statusFilter } = this.props.limitOrder;
    let results = JSON.parse(JSON.stringify(orders));

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

    // Time filter
    if (timeFilter) {
      const interval = calcInterval(timeFilter);
      const currentTime = new Date().getTime() / 1000;

      results = results.filter(item => {
        return item.updated_at >= currentTime - interval;
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
      results = _.orderBy(results, item => {
        return getFormattedDate(item.updated_at, true);
      }, [dateSort]);
    }
    

    // // Status sort after all: Priority is In Progress
    // results = _.sortBy(results, item => {
    //   if (item.status === LIMIT_ORDER_CONFIG.status.IN_PROGRESS) {
    //     return 0;
    //   } else if (item.status === LIMIT_ORDER_CONFIG.status.OPEN) {
    //     return 1;
    //   } else {
    //     return 2;
    //   }
    // }, ["asc"]);
    
    return results;
  }

  focusSourceInput = () => {
    if (this.props.screen === "mobile" && this.props.toggleLimitOrderListModal) {
      this.props.toggleLimitOrderListModal();
    }
    this.props.srcInputElementRef.focus();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.limitOrder.timeFilter !== nextProps.limitOrder.timeFilter) {
      this.setState({
        // statusFilter: [LIMIT_ORDER_CONFIG.status.OPEN, LIMIT_ORDER_CONFIG.status.IN_PROGRESS],
        statusFilterVisible: false,
        addressFilterVisible: false,
        conditionFilterVisible: false,
        expanded: {}
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
      <LimitOrderPagination totalCount={data.length}
        {...props}
      />
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
          expanded={this.props.screen === "mobile" ? this.state.expanded : undefined}
          className={data.length === 0 ? `ReactTable--empty` : ""}
          // noDataText={this.props.translate("limit_order.empty_order") || "There is no order here yet. You can place one here."} 
					// PadRowComponent={() => (<div className="line-indicator"></div>)}
          // NoDataComponent={() => null}
          NoDataComponent={(props) => {
            return (
              <div className="empty-order__message">
                {this.props.translate("limit_order.empty_order") || "There is no order here yet. You can place one"}{' '}
                <span className="place-order-trigger" onClick={e => this.focusSourceInput()}>{this.props.translate("info.here") || "here"}</span>
              </div>
            )
          }}
					getTheadProps={(state, rowInfo) => {
						return {
							style: { overflow: "visible"}
						}
          }}
          getTrGroupProps={(state, rowInfo) => {
            if (this.props.screen === "mobile" && rowInfo) {
              return {
                onClick: (e) => {
                  this.toggleDetailOrder(rowInfo);
                },
                className: this.state.expanded[rowInfo.index] ? "expanded-row" : "",
              }
            }
            return {};
          }}
          getTrProps={(state, rowInfo) => {
            if (this.props.screen === "mobile" && rowInfo) {
              return {
                style: this.state.expanded[rowInfo.index] ? {
                  display: "none",
                } : {},
              }
            }
            return {};
          }}
          getTheadThProps={(state, rowInfo, column) => {
            if (this.props.data.length === 0) {
              // return {
              //   style: {
              //     pointerEvents: "none"
              //   }
              // }
            }
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
            }
            return {};
          }}
          SubComponent={(rowInfo) => {
            return this.getOrderDetail(rowInfo);
          }}
				/>
			</div>
    )
  }
}

LimitOrderTable.propTypes = {
	data: PropTypes.array,
	screen: PropTypes.string,
	openCancelOrderModal: PropTypes.func
}
