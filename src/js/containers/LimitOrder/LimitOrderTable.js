import React, { Component } from 'react';
import { connect } from "react-redux"
import ReactTable from "react-table";
import { getTranslate } from 'react-localize-redux';
import Dropdown, { DropdownContent } from "react-simple-dropdown";
import LimitOrderPagination from "./LimitOrderPagination";
import { getAssetUrl, getFormattedDate } from "../../utils/common";
import {
  roundingRateNumber,
  multiplyOfTwoNumber,
  formatNumber,
  displayNumberWithDot,
  convertBuyRate,
  toT
} from "../../utils/converter";
import ReactTooltip from "react-tooltip";
import { LIMIT_ORDER_CONFIG } from "../../services/constants";
import PropTypes from "prop-types";
import * as limitOrderActions from "../../actions/limitOrderActions";
import { CopyToClipboard } from 'react-copy-to-clipboard'
import BLOCKCHAIN_INFO from "../../../../env"
import { sortBy } from "underscore";

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
      headerClassName: "cell-flex-start-header cell-date-header theme__text-3",
      className: "cell-flex-start cell-text-small theme__text-4",
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
      headerClassName: "cell-flex-start-header cell-condition-header",
      className: "cell-flex-start cell-condition theme__text-4",
    }, {
      id: "amount",
      Header: this.getHeader("amount"),
      accessor: item => item,
      Cell: props => this.getAmountCell(props.value),
      headerClassName: "cell-flex-start-header",
      className: "cell-flex-start cell-from theme__text-4",
    }, {
      id: "total",
      Header: this.getHeader("total"),
      accessor: item => item,
      Cell: props => this.getTotalCell(props.value),
      headerClassName: "cell-flex-start-header",
      className: "cell-flex-start cell-to theme__text-4",
    }, {
      id: "status",
      Header: this.getHeader("status"),
      accessor: item => item,
      Cell: props => this.getStatusCell(props.value),
      headerClassName: "cell-flex-center-header cell-status-header",
      className: "cell-flex-center theme__text-4",
    }, {
      expander: true,
      show: false
    }
    // , {
    //   id: "actions",
    //   Header: this.getHeader("actions"),
    //   accessor: item => item,
    //   Cell: props => this.getActionCell(props.value),
    //   headerClassName: "theme__background theme__text-3",
    //   maxWidth: 80
    // }
    // , {
    //   id: "fee",
    //   Header: this.getHeader("fee"),
    //   accessor: item => item,
    //   Cell: props => this.getFeeCell(props.value),
    //   headerClassName: "cell-flex-start-header theme__background theme__text-3",
    //   className: "cell-flex-start cell-to cell-text-small theme__text-4",
    //   width: 125
    // }, {
    //   id: "address",
    //   Header: this.getHeader("address"),
    //   accessor: item => item,
    //   Cell: props => this.getAddressCell(props.value),
    //   headerClassName: "cell-flex-start-header cell-condition-header theme__background theme__text-3",
    //   className: "cell-flex-start cell-text-small theme__text-4",
    //   width: 85,
    // }
    ];
    const {activeOrderTab} = this.props.limitOrder;
    let widths = [130, 130, 130, 130, 150, 150, 120]

    if (activeOrderTab === "history"){
      desktopColumns.splice(desktopColumns.length-2, 0, {
        id: "receive",
        Header: this.getHeader("receive"),
        accessor: item => item,
        Cell: props => this.getReceiveCell(props.value),
        headerClassName: "theme__background theme__text-3",
        maxWidth: 80
      })
      widths = [120, 120, 100, 120, 140, 140, 80, 120]
    }
    for (let i = 0; i < desktopColumns.length ; i++){
      desktopColumns[i]["width"] = widths[i]
    }
    // --------------
    // Mobile columns
    // --------------
    const mobileColumns = [
      {
        id: "order-detail",
        accessor: item => item,
        Cell: props => this.getOrderDetailCell(props.value),
      }
    ];

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
    const { source, dest, side_trade } = props;
    const { screen } = this.props;
    const pair = side_trade == "buy" ? `${dest.toUpperCase()}/${source.toUpperCase()}` : `${source.toUpperCase()}/${dest.toUpperCase()}`

    if (screen === "mobile") {
      return (
        <div className="cell-pair__mobile">
          {this.getDateCell(props)}
          <div className="cell-pair__mobile--rate">{pair}</div>
          {this.getAddressCell(props)}
        </div>
      )
    }

    return (
      <div>{pair}</div>
    )
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
      const fullRate = toT(convertBuyRate(min_rate));
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
    const amount = side_trade == "buy" ? formatNumber(multiplyOfTwoNumber(src_amount, min_rate), 5) : formatNumber(src_amount, 5)
    const unit = side_trade == "buy" ? dest.toUpperCase() : source.toUpperCase()
    return (
      <div>
        <span className="to-number-cell">{amount}</span>{' '}
        <span>{unit}</span>
      </div>
    )
  };

  getTotalCell = (props) => {
    const { source, dest, min_rate, src_amount, side_trade } = props;
    const amount = side_trade == "buy" ? formatNumber(src_amount, 5) : formatNumber(multiplyOfTwoNumber(src_amount, min_rate), 5)
    const unit = side_trade == "buy" ? source.toUpperCase() : dest.toUpperCase()
    return (
        <div>
          <span className="to-number-cell">{amount}</span>{' '}
          <span>{unit}</span>
        </div>
    )
  }

  getReceiveCell = (props) => {
    const { receive, dest, status} = props;
    return (
        <div>
          <span className="to-number-cell">{status == "filled" ? `${receive} ${dest.toUpperCase()}` : "-"}</span>
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
          >
            <div>${msg}</div>
          </ReactTooltip>
        </React.Fragment>}
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

  getOrderDetailCell = (row) => {
    const { source, dest, min_rate, src_amount, fee, side_trade, updated_at, tx_hash } = row;
    const calcFee = multiplyOfTwoNumber(fee, src_amount);
    const formattedFee = formatNumber(calcFee, 5, '');
    const sourceAmount = formatNumber(src_amount, 5);
    let destAmount = src_amount * (1 - fee) * min_rate;
    destAmount = formatNumber(destAmount, 5);
    const datetime = getFormattedDate(updated_at);
    const isFilledOrder = row.status === LIMIT_ORDER_CONFIG.status.FILLED;

    const base = side_trade == "buy" ? dest : source
    const quote = side_trade == "buy" ? source : dest
    const rate = side_trade === 'buy' ? roundingRateNumber(toT(convertBuyRate(min_rate))) : displayNumberWithDot(min_rate, 9)
    return (
      <div className="order-item">
        <div className={"order-item__date theme__background-3"}>{datetime}</div>
        <div className={"order-item__row"}>
          <div className={"order-item__column order-item__pair theme__text"}><span className={"common__capitalize"}>{side_trade}</span> {base}</div>
          <div className={"order-item__column"}/>
          <div className={"order-item__column"}>
            {row.status === LIMIT_ORDER_CONFIG.status.OPEN && (
                <div className={"order-item__cancel"} onClick={() => this.props.openCancelOrderModal(row)}>×</div>
            )}
            {row.status === LIMIT_ORDER_CONFIG.status.FILLED && (
                <a href={BLOCKCHAIN_INFO.ethScanUrl + 'eth/transaction/' + txHash} target="_blank" >
                  <img  src={getAssetUrl(`utils/etherscan_explorer.svg`)}/>
                </a>
            )}

            {row.status === LIMIT_ORDER_CONFIG.status.FILLED && (
              <a href={`${BLOCKCHAIN_INFO.ethScanUrl}tx/${tx_hash}`} target="_blank" rel="noopener noreferrer" className={"order-item__view-tx"}/>
            )}
          </div>
        </div>
        <div className={"order-item__row"}>
          <div className={"order-item__column theme__text-3"}>{this.getAddressCell(row)}</div>
          <div className={"order-item__column"}>
            <span className={"theme__text-3 order-item__title common__mr-5"}>{this.props.translate('limit_order.price') || 'Price'}</span>
            <span className={"theme__text order-item__value"}>{rate}</span>
          </div>
          <div className={"order-item__column"}>{this.getStatusCell(row)}</div>
        </div>
        <div className={"order-item__row"}>
          <div className={"order-item__column"}>
            {(!isFilledOrder || side_trade === 'buy') &&
              <div className={"theme__text-3 order-item__title"}>{this.props.translate('limit_order.total') || 'Total'}</div>
            }

            {side_trade === 'sell' && isFilledOrder &&
              <div className={"theme__text-3 order-item__title"}>{this.props.translate('limit_order.amount') || 'Amount'}</div>
            }

            <div className={"theme__text order-item__value"}>{destAmount} {dest}</div>
          </div>
          <div className={"order-item__column"}>
            {isFilledOrder &&
              <div className={"theme__text-3 order-item__title"}>{this.props.translate('received') || 'Received'}</div>
            }

            {!isFilledOrder &&
              <div className={"theme__text-3 order-item__title"}>{this.props.translate('limit_order.amount') || 'Amount'}</div>
            }

            <div className={"theme__text order-item__value"}>{sourceAmount} {source}</div>
          </div>
          <div className={"order-item__column"}>
            <div className={"theme__text-3 order-item__title"}>{this.props.translate('limit_order.fee') || 'Fee'}</div>
            <div className={"theme__text order-item__value"}>{formattedFee} {source}</div>
          </div>
        </div>
      </div>
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
        <label key={item} className="status-filter-modal__option">
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
  }
  getTypeFilter = () => {
    const { typeFilter } = this.props.limitOrder;
    return <div className="status-filter-modal theme__background theme__text-3" >
      {["buy", "sell"].map((item) => {
        const checked = typeFilter.indexOf(item) !== -1;
        return (
            <label key={item} className="status-filter-modal__option">
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
  }
  handleFilterType = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      const typeFilter = [...this.props.limitOrder.typeFilter, value];
      this.props.dispatch(limitOrderActions.getOrdersByFilter({
        pageIndex: 1,
        typeFilter
      }));
    }
    else {
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
  // Render address filter dropdown
  // --------------------------------
  getAddressFilter = () => {
    const { addressFilter, orderAddresses } = this.props.limitOrder;

    const renderedComp = orderAddresses.map(item => {
      const checked = addressFilter.indexOf(item) !== -1;

      return (
        <label key={item} className="status-filter-modal__option">
          <span>{`${item.slice(0, 8)} ... ${item.slice(-6)}`}</span>
          <input
            type="checkbox"
            value={item}
            name={item}
            checked={checked}
            className="status-filter-modal__checkbox"
            onChange={e => this.handleFilterAddress(e)}
          />
          <span className="status-filter-modal__checkmark--checkbox"></span>
        </label>
      )
    });

    return (
      <div className="address-filter-modal theme__background theme__text-3">
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
    if (title === "date") {
      return (
        <div>
          <span>{(this.props.translate("limit_order.date") || "Date").toUpperCase()}</span>
          {this.props.limitOrder.dateSort === "asc" && <img src={require("../../../assets/img/limit-order/sort-asc-icon.svg")} />}
          {this.props.limitOrder.dateSort === "desc" && <img src={require("../../../assets/img/limit-order/sort-desc-icon.svg")} />}
        </div>
      )
    } else if (title === "address") {
      return (
        <Dropdown active={this.state.addressFilterVisible} onHide={e => this.togglingAddressFilter()}>
          <div>
            <span>{(this.props.translate("address.address") || "Address").toUpperCase()}</span>
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
            <span>{(this.props.translate("limit_order.pair") || "Pair").toUpperCase()}</span>
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
              <span>{(this.props.translate("limit_order.status") || "Status").toUpperCase()}</span>
              <div className="drop-down">
                <img src={require("../../../assets/img/v3/price_drop_down.svg")}/>
              </div>
            </div>
            <DropdownContent>
              {this.getStatusFilter()}
            </DropdownContent>
          </Dropdown>
      )
    } else if (title === "type") {
      return (
          <Dropdown active={this.state.typeFilterVisible} onHide={e => this.togglingTypeFilter()}>
            <div>
              <span>{(this.props.translate("limit_order.type") || "Type").toUpperCase()}</span>
              <div className="drop-down">
                <img src={require("../../../assets/img/v3/price_drop_down.svg")}/>
              </div>
            </div>
            <DropdownContent>
              {this.getTypeFilter()}
            </DropdownContent>
          </Dropdown>
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
      <LimitOrderPagination totalCount={data.length} {...props}/>
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
                style: { display: "none" }
              }
            }

            return {
              style: { overflow: "visible" },
              className: "theme__background theme__text-3"
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
