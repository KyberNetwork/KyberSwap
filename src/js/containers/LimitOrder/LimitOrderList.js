import React from "react";
import { connect } from "react-redux"
import ReactTable from "react-table";
import { getTranslate } from 'react-localize-redux';
import _ from "lodash";

import CancelOrderModal from "./LimitOrderModals/CancelOrderModal";

import * as limitOrderActions from "../../actions/limitOrderActions";
import * as common from "../../utils/common";

@connect((store, props) => {
  return {
    translate: getTranslate(store.locale),
    limitOrder: store.limitOrder
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
      pairFilterVisible: false,
      statusFilterVisible: false,
      cancelOrderModalVisible: false,
      statusFilter: [],
      pairFilter: [],
      dateSort: "desc",
      pairSort: "asc",
      prioritySort: "date",    // date or pair,
      currentOrder: null
    };

    // this.handleMouseDown = this.handleMouseDown.bind(this);
    this.statusFilterDropdownRef = null;
    this.setStatusFilterDropdownRef = el => {
      this.statusFilterDropdownRef = el;
    }
  }

  getColumns = () => {
    const columns = [{
      id: "date",
      Header: this.getHeader("date"),
      accessor: item => item.status === "active" ? item.created_time : item.cancel_time,
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
      id: "pair",
      Header: this.getHeader("pair"),
      accessor: item => ({ source: item.source, dest: item.dest }),
      Cell: props => this.getPairCell(props),
      headerClassName: "cell-flex-start-header cell-pair-header",
      className: "cell-flex-start cell-pair",
      width: 120,
      getHeaderProps: (state, rowInfo) => {
        return {
          onClick: (e) => {
            this.togglePairFilter();
          }
        }
      }
    }, {
      id: "condition",
      Header: this.getHeader("condition"),
      accessor: item => ({ source: item.source, dest: item.dest, minRate: item.min_rate }),
      Cell: props => this.getConditionCell(props),
      headerClassName: "cell-flex-start-header",
      className: "cell-flex-start",
      width: 160
    }, {
      id: "from",
      Header: this.getHeader("from"),
      accessor: item => ({ source: item.source, sourceAmount: item.src_amount }),
      Cell: props => this.getFromCell(props),
      headerClassName: "cell-flex-start-header",
      className: "cell-flex-start cell-from"
    }, {
      id: "to",
      Header: this.getHeader("to"),
      accessor: item => ({ dest: item.dest, minRate: item.min_rate, sourceAmount: item.src_amount, fee: item.fee }),
      Cell: props => this.getToCell(props),
      headerClassName: "cell-flex-start-header",
      className: "cell-flex-start cell-to",
      width: 160
    }, {
      id: "status",
      Header: this.getHeader("status"),
      accessor: item => item.status,
      Cell: props => this.getStatusCell(props),
      headerClassName: "cell-flex-start-header cell-status-header",
      className: "cell-flex-start",
      maxWidth: 90,
      getHeaderProps: (state, rowInfo) => {
        return {
          onClick: (e) => {
            this.toggleStatusFilter();
          }
        }
      }
    }, {
      id: "actions",
      Header: this.getHeader("actions"),
      accessor: item => item.status,
      Cell: props => this.getActionCell(props),
      maxWidth: 100
    }]; 
    return columns;
  }

  getDateCell = (props) => {
    const datetime = common.getFormattedDate(props.value);
    return (
      <div>{datetime}</div>
    )
  }

  getPairCell = (props) => {
    const { source, dest } = props.value;
    return (
      <div>
        <span>{source.toUpperCase()}</span>
        <span>&rarr;</span>
        <span>{dest.toUpperCase()}</span>
      </div>
    )
  }

  getConditionCell = (props) => {
    const { source, dest, minRate } = props.value;
    let rate = common.formatFractionalValue(minRate, 3);
    return (
      <div>{`${source.toUpperCase()}/${dest.toUpperCase()} >= ${rate}`}</div>
    )
  }

  getFromCell = (props) => {
    const { source, sourceAmount } = props.value;
    let amount = common.formatFractionalValue(sourceAmount, 6);
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
    destAmount = common.formatFractionalValue(destAmount, 6);
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
        {status === "active" && <button className="btn-cancel-order" onClick={e =>this.openCancelOrderModal(props.original)}>{this.props.translate("limit_order.cancel") || "Cancel"}</button>}
        {status !== "active" && <div className="line-indicator"></div>}
        
      </div>
    )
  }

  // Render header
  getHeader = (title) => {
    if (title === "date") {
      return (
        <div>
          <span>{this.props.translate("limit_order.date") || "Date"}</span>
          {this.state.dateSort === "asc" && <img src={require("../../../assets/img/limit-order/sort-asc-icon.svg")} />}
          {this.state.dateSort === "desc" && <img src={require("../../../assets/img/limit-order/sort-desc-icon.svg")} />}
        </div>
      )
    } else if (title === "pair") {
      return (
        <div>
          <span>{this.props.translate("limit_order.pair") || "Pair"}</span>
          
          <div className="drop-down">
            <img src={require("../../../assets/img/v3/price_drop_down.svg")}/>
          </div>
        </div>
      )
    } else if (title === "status") {
      return (
        <div>
          <span>{this.props.translate("limit_order.status") || "Status"}</span>
          <div className="drop-down">
            <img src={require("../../../assets/img/v3/price_drop_down.svg")}/>
          </div>
        </div>
      )
    } else {
      return (
        <div>{this.props.translate(`limit_order.${title}`) || title}</div>
      )
    }
  }

  openCancelOrderModal = (order) => {
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

  togglePairFilter = () => {
    this.setState({
      pairFilterVisible: !this.state.pairFilterVisible
    })
  }

  toggleStatusFilter = () => {
    this.setState({
      statusFilterVisible: !this.state.statusFilterVisible
    })
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

  // Render pair filter dropdown
  getPairFilter = (data) => {
    const { pairFilter, pairSort } = this.state;

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
            <span className="pair-filter-modal__checkmark--radio"></span>

          </label>
          <label className="pair-filter-modal__option">
            <span>Z &rarr; A</span>
            <input type="radio" name="basicFilter" value={'desc'} 
                    checked={pairSort === "desc"}
                    className="pair-filter-modal__radio" 
                    onChange={e => this.handleSortPair(e)}/>
            <span className="pair-filter-modal__checkmark--radio"></span>

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

  // Render status filter dropdown
  getStatusFilter = () => {
    const { statusFilter } = this.state;
    const status = ["active", "filled", "cancel"];
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
      <div className="status-filter-modal" ref={this.setStatusFilterDropdownRef}>
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

  // Render data
  renderData = (data) => {
    const { statusFilter, pairFilter, pairSort, dateSort, prioritySort, selectedTimeFilter } = this.state;
    let results = JSON.parse(JSON.stringify(data));

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
    let interval = selectedTimeFilter.interval;
    if (selectedTimeFilter.unit === "day") {
      interval = interval * 86400;
    } else if (selectedTimeFilter.unit === "week") {
      interval = interval * 604800;
    } else if (selectedTimeFilter.unit === "month") {
      interval = interval * 2629743;
    }

    const currentTime = new Date().getTime() / 1000;
    results = results.filter(item => {
      if (item.status === "active") {
        return item.created_time >= currentTime - interval;
      } else {
        return item.cancel_time >= currentTime - interval; 
      }
    });
    

    // Date sort or pair sort
    if (prioritySort === "date" && dateSort) {
      results = _.orderBy(results, item => {
        if (item.status === "active") {
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

  // handleMouseDown(e) {
  //   if (this.statusFilterDropdownRef && !this.statusFilterDropdownRef.contains(e.target)) {
  //     this.setState({
  //       statusFilterVisible: false
  //     })
  //   }
  // }

  // componentDidMount() {
  //   document.addEventListener("mousedown", this.handleMouseDown, false);
  // }

  // componentWillUnmount() {
  //   document.removeEventListener("mousedown", this.handleMouseDown, false);
  // }

  render() {
    const columns = this.getColumns();
    const data = this.renderData(this.props.limitOrder.listOrder);
    return (
      <div className={"limit-order-list"}>
        <div>
          <div className="limit-order-list--title">
            <div className="title">{this.props.translate("limit_order.order_list_title") || "Manage Your Orders"}</div>
            <div className="filter-container">
              <ul className="filter">
                {this.getTimeFilter()}
              </ul>
              <div className="setting">
                <img src={require("../../../assets/img/limit-order/setting-grey-icon.svg")}/>
              </div>
            </div>
            
          </div>
          <div className="limit-order-list--table">
            <ReactTable 
              data={data}
              columns={columns}
              showPagination={false}
              resizable={false}
              sortable={false}
              minRows={1}
              noDataText={this.props.translate("limit_order.no_data_text") || "You have no orders yet."}
            />
            {this.state.pairFilterVisible && this.getPairFilter(data)}
            {this.state.statusFilterVisible && this.getStatusFilter()}
            <CancelOrderModal order={this.state.currentOrder} 
              isOpen={this.state.cancelOrderModalVisible}
              closeModal={this.closeCancelOrderModal}
            />
          </div>
        </div>
      </div>
    )
  }
}
