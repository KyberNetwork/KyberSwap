import React, { Component } from "react";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import ReactTable from "react-table";

import { Modal } from "../../../components/CommonElement";
import * as limitOrderActions from "../../../actions/limitOrderActions";
import { getFormattedDate } from "../../../utils/common";
import { roundingNumber } from "../../../utils/converter";
import * as limitOrderServices from "../../../services/limit_order";

@connect((store, props) => {
	const translate = getTranslate(store.locale);
	const limitOrder = store.limitOrder;

	return {
		translate,
		limitOrder
	};
})
export default class CancelOrderModal extends Component {
	constructor() {
		super();
	}

	getColumns = () => {
		const columns = [
			{
				id: "date",
				Header: this.getHeader("date"),
				accessor: item =>
					item.status === "active"
						? item.created_time
						: item.cancel_time,
				Cell: props => this.getDateCell(props),
				headerClassName: "cell-flex-start-header",
				className: "cell-flex-start",
				maxWidth: 120
			},
			{
				id: "condition",
				Header: this.getHeader("condition"),
				accessor: item => item,
				Cell: props => this.getConditionCell(props),
				headerClassName: "cell-flex-start-header cell-condition-header",
				className: "cell-flex-start cell-condition",
			},
			{
				id: "from",
				Header: this.getHeader("from"),
				accessor: item => ({
					source: item.source,
					sourceAmount: item.src_amount
				}),
				Cell: props => this.getFromCell(props),
				headerClassName: "cell-flex-start-header",
				className: "cell-flex-start cell-from"
			},
			{
				id: "to",
				Header: this.getHeader("to"),
				accessor: item => ({
					dest: item.dest,
					minRate: item.min_rate,
					sourceAmount: item.src_amount,
					fee: item.fee
				}),
				Cell: props => this.getToCell(props),
				headerClassName: "cell-flex-start-header",
				className: "cell-flex-start cell-to",
			}
		];
		return columns;
	};

	getDateCell = props => {
		const datetime = getFormattedDate(props.value);
		return <div>{datetime}</div>;
	};

	getPairCell = props => {
		const { source, dest } = props.value;
		return (
			<div>
				<span>{source.toUpperCase()}</span>
				<span>&rarr;</span>
				<span>{dest.toUpperCase()}</span>
			</div>
		);
	};

	getConditionCell = props => {
		const { source, dest, min_rate } = props.value;
		let rate = roundingNumber(min_rate);
		return (
			<div>{`${source.toUpperCase()}/${dest.toUpperCase()} >= ${rate}`}</div>
		);
	};

	getStatusCell = (props) => {
		const status = props.value;
		return (
			<div className={`cell-status cell-status--${status}`}>{status.toUpperCase()}</div>
		)
	}

	getFromCell = props => {
		const { source, sourceAmount } = props.value;
		let amount = roundingNumber(sourceAmount);
		return (
			<div>
				<span class="from-number-cell">{amount}</span>{" "}
				<span>{source.toUpperCase()}</span>
			</div>
		);
	};

	getToCell = props => {
		const { dest, minRate, fee, sourceAmount } = props.value;
		let destAmount = sourceAmount * (1 - fee / 100) * minRate;
		destAmount = roundingNumber(destAmount);
		return (
			<div>
				<span className="to-number-cell">{destAmount}</span>{" "}
				<span>{dest.toUpperCase()}</span>
			</div>
		);
	};

	// Render header
	getHeader = title => {
		return (
			<div>{this.props.translate(`limit_order.${title}`) || title}</div>
		);
	};

	async confirmCancel() {
		if (this.props.order) {
			try {
				const results = await limitOrderServices.cancelOrder(
					this.props.order
				);
				if (results) {
					this.props.dispatch(limitOrderActions.updateOrder(results));
					this.props.closeModal();
				}
			} catch (err) {
				console.log(err);
			}
		}
	}

	contentModalMobile = () => {
		if (!this.props.order) {
			return null
		}
		const { source, dest, min_rate, status, created_time, cancel_time, src_amount, fee } = this.props.order;

		const datetime = status === "active" ? created_time : cancel_time;
		const rate = roundingNumber(min_rate);

		const sourceAmount = roundingNumber(src_amount);
		let destAmount = src_amount * (1 - fee / 100) * min_rate;
		destAmount = roundingNumber(destAmount);
	
		return (
			<div className="limit-order-list--table-mobile">
				<div className="limit-order-modal__detail-order--cancel">
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
					</div>
				</div>
			</div>
		);
	};

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
						onClick={e => this.props.closeModal()}
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
					</div>
				</div>
				<div className="limit-order-modal__footer">
					<button
						className="btn-cancel"
						onClick={e => this.props.closeModal()}
					>
						{this.props.translate("modal.cancel") || "Cancel"}
					</button>
					<button
						className="btn-confirm"
						onClick={e => this.confirmCancel()}
					>
						{this.props.translate("modal.confirm") || "Confirm"}
					</button>
				</div>
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
				onRequestClose={this.props.closeModal}
				contentLabel="Cancel Order Modal"
				content={this.contentModal()}
				size="medium"
			/>
		);
	}
}
