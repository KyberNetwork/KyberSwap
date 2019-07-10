import React, { Component } from "react";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import ReactTable from "react-table";

import { Modal } from "../../../components/CommonElement";
import * as limitOrderActions from "../../../actions/limitOrderActions";
import { getFormattedDate } from "../../../utils/common";
import { roundingNumber, multiplyOfTwoNumber, formatNumber } from "../../../utils/converter";
import limitOrderServices from "../../../services/limit_order";
import { LIMIT_ORDER_CONFIG } from "../../../services/constants";

@connect((store, props) => {
	const translate = getTranslate(store.locale);
	const limitOrder = store.limitOrder;
	const global = store.global;
	const account = store.account.account;

	return {
		translate,
		limitOrder,
		global,
		account
	};
})
export default class CancelOrderModal extends Component {
	constructor() {
		super();
		this.state = {
			isConfirming: false,
			isFinish: false,
			err: ""
		}
	}

	getColumns = () => {
		const columns = [
			{
				id: "date",
				Header: this.getHeader("date"),
				accessor: item => item,
				Cell: props => this.getDateCell(props.value),
				headerClassName: "cell-flex-start-header",
				className: "cell-flex-start",
				width: 90
			},
			{
				id: "condition",
				Header: this.getHeader("condition"),
				accessor: item => item,
				Cell: props => this.getConditionCell(props.value),
				headerClassName: "cell-flex-start-header cell-condition-header",
				className: "cell-flex-start cell-condition",
				width: 170
			},
			{
				id: "from",
				Header: this.getHeader("from"),
				accessor: item => item,
				Cell: props => this.getFromCell(props.value),
				headerClassName: "cell-flex-start-header",
				className: "cell-flex-start cell-from"
			},
			{
				id: "to",
				Header: this.getHeader("to"),
				accessor: item => item,
				Cell: props => this.getToCell(props.value),
				headerClassName: "cell-flex-start-header",
				className: "cell-flex-start cell-to",
			}, {
				id: "fee",
				Header: this.getHeader("fee"),
				accessor: item => item,
				Cell: props => this.getFeeCell(props.value),
				headerClassName: "cell-flex-start-header",
				className: "cell-flex-start cell-to"
			}
		];
		return columns;
	};

	getDateCell = props => {
		const { updated_at, status } = props;
		const timestamp = updated_at;
		const datetime = getFormattedDate(timestamp);
		return <div>{datetime}</div>;
	};

	getConditionCell = props => {
		const { source, dest, min_rate } = props;
		let rate = roundingNumber(min_rate);
		return (
			<div>{`${source.toUpperCase()}/${dest.toUpperCase()} >= ${rate}`}</div>
		);
	};

	getStatusCell = (props) => {
		const { status } = props;
		return (
			<div className={`cell-status cell-status--${status}`}>{status.toUpperCase()}</div>
		)
	}

	getFromCell = props => {
		const { source, src_amount } = props;
		let amount = roundingNumber(src_amount);
		return (
			<div>
				<span class="from-number-cell">{amount}</span>{" "}
				<span>{source.toUpperCase()}</span>
			</div>
		);
	};

	getToCell = props => {
		const { dest, min_rate, fee, src_amount } = props;
		let destAmount = src_amount * (1 - fee) * min_rate;
		destAmount = roundingNumber(destAmount);
		return (
			<div>
				<span className="to-number-cell">{destAmount}</span>{" "}
				<span>{dest.toUpperCase()}</span>
			</div>
		);
	};

	getFeeCell = (props) => {
    const { fee, source, src_amount } = props;
    const calcFee = multiplyOfTwoNumber(fee, src_amount);
    const formatedFee = formatNumber(calcFee, 5, '');
    return (
      <div>
        <span className="to-number-cell">{formatedFee}</span>{' '}
        <span>{source.toUpperCase()}</span>
      </div>
    )
  }

	// Render header
	getHeader = title => {
		return (
			<div>{this.props.translate(`limit_order.${title}`) || title}</div>
		);
	};

	async confirmCancel() {
		this.props.global.analytics.callTrack("trackClickConfirmCancelOrder", this.props.order ? this.props.order.id : null);
		this.setState({
			isConfirming: true,
			err: ""
		});
		if (this.props.order) {
			try {
				const results = await limitOrderServices.cancelOrder(
					this.props.order
				);
				if (results) {
					if (this.props.limitOrder.filterMode === "client") {
						this.props.dispatch(limitOrderActions.updateOpenOrderStatus());
					} else {
						this.props.dispatch(limitOrderActions.getOrdersByFilter({}));
						
						if (this.props.account) {
							this.props.dispatch(limitOrderActions.getPendingBalances(this.props.account.address));
						}
					}
					this.props.dispatch(limitOrderActions.getListFilter());
					
					this.setState({
						isConfirming: false,
						isFinish: true
					});
				}
			} catch (err) {
				console.log(err);
				this.setState({
					isConfirming: false,
					isFinish: false,
					err: err.toString()
				});
			}
		}
	}

	contentModalMobile = () => {
		if (!this.props.order) {
			return null
		}
		const { source, dest, min_rate, status, updated_at, src_amount, fee } = this.props.order;

		const rate = roundingNumber(min_rate);
		const calcFee = multiplyOfTwoNumber(fee, src_amount);
    const formatedFee = formatNumber(calcFee, 5, '');

		const sourceAmount = roundingNumber(src_amount);
		let destAmount = src_amount * (1 - fee) * min_rate;
		destAmount = roundingNumber(destAmount);
	
		return (
			<div className="limit-order-list--table-mobile">
				<div className="limit-order-modal__detail-order--cancel">
					<div>
						<div className="cell-pair__mobile">
							{this.getDateCell(this.props.order)}
							<div className="cell-pair">
								<span>{source.toUpperCase()}</span>
								<span>&rarr;</span>
								<span>{dest.toUpperCase()}</span>
							</div>
							{this.getStatusCell(this.props.order)}
						</div>
						<div className="limit-order-modal__detail-order__rate">
							<div>{`${source.toUpperCase()}/${dest.toUpperCase()} >= ${rate}`}</div>
						</div>
					</div>
					{/* Amount */}
					<div>
						<div className="limit-order-modal__detail-order__amount limit-order-modal__detail-order__amount--from">
							<div>
								{this.props.translate("limit_order.from") || "From"}
							</div>
							<div className="cell-from">
								<span class="from-number-cell">{sourceAmount}</span>{" "}
								<span>{source.toUpperCase()}</span>
							</div>
						</div>
						<div className="limit-order-modal__detail-order__amount">
							<div>
								{this.props.translate("limit_order.to") || "To"}
							</div>
							<div className="cell-to">
								<span class="to-number-cell">{destAmount}</span>{" "}
								<span>{dest.toUpperCase()}</span>
							</div>
						</div>
						<div className="limit-order-modal__detail-order__amount">
							<div>
								{this.props.translate("limit_order.fee") || "Fee"}
							</div>
							<div className="cell-to">
								<span class="to-number-cell">{calcFee}</span>{" "}
								<span>{source.toUpperCase()}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	closeModal = () => {
		if (this.state.isConfirming) return;
		this.setState({
			isConfirming: false,
			isFinish: false
		});
		this.props.closeModal();
	}

	contentModal = () => {
		return (
			<div className="limit-order-modal">
				<div className="limit-order-modal__body">
					<div className="limit-order-modal__title">
						{this.props.translate("modal.cancel_order") ||
							"Cancel Order"}
					</div>
					<div
						className="limit-order-modal__close"
						onClick={e => this.closeModal()}
					>
						<div className="limit-order-modal__close-wrapper" />
					</div>
					<div className="limit-order-modal__content">
						<div className="limit-order-modal__message">
							{this.props.translate(
								"limit_order.canceling_order_message" ||
									"You are canceling this order"
							)}
						</div>
						{/* Desktop */}
						{this.props.screen !== "mobile" && (
							<div className="limit-order-modal__table">
								<ReactTable
									data={this.props.order ? [this.props.order] : []}
									columns={this.getColumns()}
									showPagination={false}
									resizable={false}
									sortable={false}
									minRows={1}
									noDataText={
										this.props.translate(
											"limit_order.no_data_text"
										) || "You have no orders yet."
									}
								/>
							</div>
						)}
						{/* Mobile */}
						{this.props.screen === "mobile" && this.contentModalMobile()}

						{this.state.err && <div className="limit-order-modal__result--error">
							{this.state.err}
						</div>}
					</div>
				</div>
				{!this.state.isFinish && (
					<div className="limit-order-modal__footer">
						<button
							className={`btn-cancel ${this.state.isConfirming ? "btn-disabled" : ""}`}
							onClick={e => this.closeModal()}
						>
							{this.props.translate("no_thank") || "No, Thanks"}
						</button>
						<button
							className={`btn-confirm ${this.state.isConfirming ? "btn-disabled" : ""}`}
							onClick={e => this.confirmCancel()}
						>
							{this.props.translate("yes_please") || "Yes, Please"}
						</button>	
					</div>
				)}
				
				{this.state.isFinish && (
					<div className="limit-order-modal__success-msg">
						<img src={require("../../../../assets/img/limit-order/checkmark_green.svg")}/>
						<span>{this.props.translate("modal.success") || "Success"}</span>
					</div>
				)}
			</div>
		);
	};

	render() {
		return (
			<Modal
				className={{
					base: "reveal medium confirm-modal",
					afterOpen:
						"reveal medium confirm-modal confirm-modal__cancel-order"
				}}
				isOpen={this.props.isOpen}
				onRequestClose={this.closeModal}
				contentLabel="Cancel Orxder Modal"
				content={this.contentModal()}
				size="medium"
			/>
		);
	}
}
