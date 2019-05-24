import React, { Component } from 'react';
import { connect } from "react-redux"
import ReactTable from "react-table";
import { getTranslate } from 'react-localize-redux';
import Dropdown, { DropdownContent, DropdownTrigger } from "react-simple-dropdown";
import CancelOrderModal from "./LimitOrderModals/CancelOrderModal";
import * as common from "../../utils/common";
import * as converters from "../../utils/converter";

import PropTypes from "prop-types";


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
			statusFilter: [],
      pairFilter: [],
      dateSort: "desc",
      pairSort: "asc",
			prioritySort: "date",    // date or pair,
			currentOrder: null,
      cancelOrderModalVisible: false,
      expanded: {},
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
      accessor: item => item.status === "open" ? item.created_time : item.cancel_time,
      Cell: props => this.getDateCell(props),
      headerClassName: "cell-flex-start-header",
      className: "cell-flex-start",
      maxWidth: 120,
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
      Cell: props => this.getConditionCell(props),
      headerClassName: "cell-flex-start-header cell-condition-header",
      className: "cell-flex-start cell-condition",
    }, {
      id: "from",
      Header: this.getHeader("from"),
      accessor: item => ({ source: item.source, sourceAmount: item.src_amount }),
      Cell: props => this.getFromCell(props),
      headerClassName: "cell-flex-start-header",
      className: "cell-flex-start cell-from",
    }, {
      id: "to",
      Header: this.getHeader("to"),
      accessor: item => ({ dest: item.dest, minRate: item.min_rate, sourceAmount: item.src_amount, fee: item.fee }),
      Cell: props => this.getToCell(props),
      headerClassName: "cell-flex-start-header",
      className: "cell-flex-start cell-to",
    }, {
      id: "status",
      Header: this.getHeader("status"),
      accessor: item => item.status,
      Cell: props => this.getStatusCell(props),
      headerClassName: "cell-flex-start-header cell-status-header",
      className: "cell-flex-start",
      maxWidth: 90
    }, {
      id: "actions",
      Header: this.getHeader("actions"),
      accessor: item => item.status,
      Cell: props => this.getActionCell(props),
      maxWidth: 100
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
      Cell: props => this.getConditionCell(props),
      headerClassName: "cell-flex-start-header cell-condition-header",
      className: "cell-flex-start cell-condition",
    }, {
      id: "status",
      Header: this.getHeader("status"),
      accessor: item => item.status,
      Cell: props => this.getStatusCell(props),
      headerClassName: "cell-flex-end-header cell-status-header",
      className: "cell-flex-end",
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
  
  calcInterval = (selectedTimeFilter) => {
    let interval = selectedTimeFilter.interval;
    if (selectedTimeFilter.unit === "day") {
      interval = interval * 86400;
    } else if (selectedTimeFilter.unit === "week") {
      interval = interval * 604800;
    } else if (selectedTimeFilter.unit === "month") {
      interval = interval * 2629743;
    }
    return interval;
  }

	// --------------
	// Render cell
	// --------------
	getDateCell = (props) => {
    const datetime = common.getFormattedDate(props.value);
    return (
      <div>{datetime}</div>
    )
  }

  getPairCell = (props) => {
		const { source, dest, status, created_time, cancel_time, min_rate } = props.value;
    const { screen } = this.props;

    const datetime = status === "open" ? created_time : cancel_time;
    const rate = converters.roundingNumber(min_rate);
    
    if (screen === "mobile") {
      return (
        <div className="cell-pair__mobile">
          {this.getDateCell({ value: datetime })}
          <div>
            <span>{source.toUpperCase()}</span>
            <span>&rarr;</span>
            <span>{dest.toUpperCase()}</span>
          </div>
          <div className="cell-pair__mobile--rate">{`${source.toUpperCase()}/${dest.toUpperCase()} >= ${rate}`}</div>
        </div>
      )
    }
    return (
      <div>
        <span>{source.toUpperCase()}</span>
        <span>&rarr;</span>
        <span>{dest.toUpperCase()}</span>
      </div>
    )
  }

  getConditionCell = (props) => {
    const { source, dest, status, created_time, cancel_time, min_rate } = props.value;
    const { screen } = this.props;

    const datetime = status === "open" ? created_time : cancel_time;
    const rate = converters.roundingNumber(min_rate);

    if (screen === "mobile") {
      return (
        <div className="cell-pair__mobile">
          {this.getDateCell({ value: datetime })}
          <div>
            <span>{source.toUpperCase()}</span>
            <span>&rarr;</span>
            <span>{dest.toUpperCase()}</span>
          </div>
          <div className="cell-pair__mobile--rate">{`${source.toUpperCase()}/${dest.toUpperCase()} >= ${rate}`}</div>
        </div>
      )
    } 
    return (
      <div>{`${source.toUpperCase()}/${dest.toUpperCase()} >= ${rate}`}</div>
    )
  }

  getFromCell = (props) => {
    const { source, sourceAmount } = props.value;
    let amount = converters.roundingNumber(sourceAmount);
    return (
      <div>
        <span class="from-number-cell">{amount}</span>{' '}
        <span>{source.toUpperCase()}</span>
      </div>
    )
  }

  getToCell = (props) => {
    const { dest, minRate, fee, sourceAmount } = props.value;
    let destAmount = sourceAmount * (1 - fee / 100) * minRate;
    destAmount = converters.roundingNumber(destAmount);
    return (
      <div>
        <span className="to-number-cell">{destAmount}</span>{' '}
        <span>{dest.toUpperCase()}</span>
      </div>
    )
  }

  getStatusCell = (props) => {
		const status = props.value;
    return (
      <div className={`cell-status cell-status--${status}`}>{status.toUpperCase()}</div>
    )
  }

  getActionCell = (props) => {
    const status = props.value;
    return (
      <div className="cell-action">
        {status === "open" && <button className="btn-cancel-order" onClick={e =>this.props.openCancelOrderModal(props.original)}>{this.props.translate("limit_order.cancel") || "Cancel"}</button>}
        {status !== "open" && this.props.screen !== "mobile" && <div className="line-indicator"></div>}
      </div>
    )
  }

	handleSortDate = () => {
    if (this.state.dateSort === "desc") {
      this.setState({
        dateSort: "asc",
        prioritySort: "date"
      })
    } else {
      this.setState({
        dateSort: "desc",
        prioritySort: "date"
      })
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
    const { source, dest, min_rate, status, created_time, cancel_time, src_amount, fee } = row.original;

    const datetime = status === "open" ? created_time : cancel_time;
    const rate = converters.roundingNumber(min_rate);

    const sourceAmount = converters.roundingNumber(src_amount);
    let destAmount = src_amount * (1 - fee / 100) * min_rate;
    destAmount = converters.roundingNumber(destAmount);

    return (
      <div className="limit-order-modal__detail-order">
        <div>
          <div className="cell-pair__mobile">
            {this.getDateCell({ value: datetime })}
            <div className="cell-pair">
              <span>{source.toUpperCase()}</span>
              <span>&rarr;</span>
              <span>{dest.toUpperCase()}</span>
            </div>
            {this.getStatusCell({ value: status })}
          </div>
          <div className="limit-order-modal__detail-order__rate">
            <div>{`${source.toUpperCase()}/${dest.toUpperCase()} >= ${rate}`}</div>
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
          {this.getActionCell({ value: status, ...row })}
        </div>
      </div>
      
    )
  }

	// -------------------------------
	// Render pair filter dropdown
	// -------------------------------
	getPairFilter = () => {
    const { pairFilter, pairSort } = this.state;
    const { selectedTimeFilter } = this.props;
    let data = this.props.data;

    let interval = this.calcInterval(selectedTimeFilter);

    const currentTime = new Date().getTime() / 1000;
    data = data.filter(item => {
      if (item.status === "open") {
        return item.created_time >= currentTime - interval;
      } else {
        return item.cancel_time >= currentTime - interval; 
      }
    });

    const renderedPair = data.filter((item, index, self) => {
      return index === self.findIndex(t => t.source === item.source && t.dest === item.dest);
    }).map(item => {
      const key = `${item.source}-${item.dest}`;
      const checked = pairFilter.indexOf(key) !== -1;

      return (
        <label key={key} className="pair-filter-modal__option">
          <span>{item.source.toUpperCase()}</span>{' '}
          <span>&rarr;</span>{' '}
          <span>{item.dest.toUpperCase()}</span>
          <input type="checkbox" value={key}
            checked={checked}
            className="pair-filter-modal__checkbox" 
            onChange={e => this.handleFilterPair(e)}/>
          <span className="pair-filter-modal__checkmark--checkbox"></span>
        </label>
      )
    });

    return (
      <div className="pair-filter-modal">
        <div className="pair-filter-modal__basic">
          <label className="pair-filter-modal__option">
            <span>A &rarr; Z</span>
            <input type="radio" name="basicFilter" value={'asc'}
                    checked={pairSort === "asc"}
                    className="pair-filter-modal__radio" 
                    onChange={e => this.handleSortPair(e)}/>
            <div className="pair-filter-modal__checkmark--radio"></div>

          </label>
          <label className="pair-filter-modal__option">
            <span>Z &rarr; A</span>
            <input type="radio" name="basicFilter" value={'desc'} 
                    checked={pairSort === "desc"}
                    className="pair-filter-modal__radio" 
                    onChange={e => this.handleSortPair(e)}/>
            <div className="pair-filter-modal__checkmark--radio"></div>

          </label>
        </div>
        <div className="pair-filter-modal__advance">
          {renderedPair}
        </div>
      </div>
    )
	}

	handleFilterPair = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      this.setState({
        pairFilter: [...this.state.pairFilter, value]
      });
    } else {
      const results = [...this.state.pairFilter];
      const index = results.indexOf(value);
      if (index !== -1) {
        results.splice(index, 1);
        this.setState({
          pairFilter: results
        });
      }
    }
	}
	
	handleSortPair = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      this.setState({
        pairSort: value,
        prioritySort: "pair"
      });
    }
  }
	
	// ------------------------------
	// Render status filter dropdown
	// ------------------------------
	getStatusFilter = () => {
    const { statusFilter } = this.state;
    const status = ["open", "filled", "cancelled", "in_progress", "invalidated"];
    const renderedStatus = status.map((item) => {
      const checked = statusFilter.indexOf(item) !== -1;

      return (
        <label key={item} className="status-filter-modal__option">
          <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
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
      this.setState({
        statusFilter: [...this.state.statusFilter, value]
      });
    } else {
      const results = [...this.state.statusFilter];
      const index = results.indexOf(value);
      if (index !== -1) {
        results.splice(index, 1);
        this.setState({
          statusFilter: results
        });
      }
    }
  }

	// --------------
	// Render header
	// --------------
	getHeader = (title) => {
    if (title === "date") {
      return (
        <div>
          <span>{this.props.translate("limit_order.date") || "Date"}</span>
          {this.state.dateSort === "asc" && <img src={require("../../../assets/img/limit-order/sort-asc-icon.svg")} />}
          {this.state.dateSort === "desc" && <img src={require("../../../assets/img/limit-order/sort-desc-icon.svg")} />}
        </div>
      )
    } else if (title === "condition") {
      return (
        <Dropdown>
          <DropdownTrigger>
            <span>{this.props.translate("limit_order.condition") || "Condition"}</span>
            <div className="drop-down">
              <img src={require("../../../assets/img/v3/price_drop_down.svg")}/>
            </div>
          </DropdownTrigger>
          <DropdownContent>
            {this.getPairFilter()}
          </DropdownContent>
        </Dropdown>
      )
    } else if (title === "status") {
      return (
        <Dropdown>
          <DropdownTrigger>
            <span>{this.props.translate("limit_order.status") || "Status"}</span>
            <div className="drop-down">
              <img src={require("../../../assets/img/v3/price_drop_down.svg")}/>
            </div>
          </DropdownTrigger>
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
	
	// -------------
	// Render data
	// -------------
  renderData = (data) => {
		const { statusFilter, pairFilter, pairSort, dateSort, prioritySort } = this.state;
		const { selectedTimeFilter } = this.props;
    let results = JSON.parse(JSON.stringify(data));

    if (this.props.screen === "mobile") {
      // Add detail visible propety
      results = results.map(item => ({
        ...item,
        isDetailVisible: false
      }));
    }

    // Status filter
    if (statusFilter.length > 0) {
      results = results.filter(item => {
        const index = statusFilter.indexOf(item.status);
        return index !== -1;
      });
    }

    // Pair filter
    if (pairFilter.length > 0) {
      results = results.filter(item => {
        const key = `${item.source}-${item.dest}`;
        const index = pairFilter.indexOf(key);
        return index !== -1;
      });
    }

    // Time sort
    let interval = this.calcInterval(selectedTimeFilter);

    const currentTime = new Date().getTime() / 1000;
    results = results.filter(item => {
      if (item.status === "open") {
        return item.created_time >= currentTime - interval;
      } else {
        return item.cancel_time >= currentTime - interval; 
      }
    });
    

    // Date sort or pair sort
    if (prioritySort === "date" && dateSort) {
      results = _.orderBy(results, item => {
        if (item.status === "open") {
          return item.created_time;
        } else {
          return item.cancel_time;
        }
      }, [dateSort]);
    } else if (prioritySort === "pair" && pairSort) {
      results = _.orderBy(results, item => {
        return `${item.source}-${item.dest}`;
      }, [pairSort]);
    }
    
    return results;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedTimeFilter !== nextProps.selectedTimeFilter) {
      this.setState({
        statusFilter: [],
        pairFilter: [],
        pairSort: "asc",
        expanded: {}
      })
    }
  }

  render() {
		const columns = this.getColumns();
		const data = this.renderData(this.props.data);
    return (
			<div className="limit-order-list--table">
				<ReactTable 
					data={data}
					columns={columns}
					showPagination={false}
					resizable={false}
					sortable={false}
          minRows={1}
          expanded={this.props.screen === "mobile" ? this.state.expanded : undefined}
					PadRowComponent={() => (<div className="line-indicator"></div>)}
					NoDataComponent={() => null}
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
	selectedTimeFilter: PropTypes.object,
	openCancelOrderModal: PropTypes.func
}

LimitOrderTable.defaultProps = {
  selectedTimeFilter: { 
    interval: 1,
    unit: "month"
  }
}