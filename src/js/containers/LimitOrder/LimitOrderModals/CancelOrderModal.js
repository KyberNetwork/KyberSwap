import React, { Component } from "react";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import ReactTable from "react-table";

import { Modal } from "../../../components/CommonElement";
import * as limitOrderActions from "../../../actions/limitOrderActions";
import * as common from "../../../utils/common";
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
				id: "pair",
				Header: this.getHeader("pair"),
				Cell: props => this.getPairCell(props),
				accessor: item => ({ source: item.source, dest: item.dest }),
				headerClassName: "cell-flex-start-header cell-pair-header",
				className: "cell-flex-start cell-pair",
				width: 120
			},
			{
				id: "condition",
				Header: this.getHeader("condition"),
				accessor: item => ({
					source: item.source,
					dest: item.dest,
					minRate: item.min_rate
				}),
				Cell: props => this.getConditionCell(props),
				headerClassName: "cell-flex-start-header",
				className: "cell-flex-start",
				width: 160
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
				width: 140
			}
		];
		return columns;
	};

	getDateCell = props => {
		const datetime = common.getFormattedDate(props.value);
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
		const { source, dest, minRate } = props.value;
		let rate = common.formatFractionalValue(minRate, 3);
		return (
			<div>{`${source.toUpperCase()}/${dest.toUpperCase()} >= ${rate}`}</div>
		);
	};

	getFromCell = props => {
		const { source, sourceAmount } = props.value;
		let amount = common.formatFractionalValue(sourceAmount, 6);
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
		destAmount = common.formatFractionalValue(destAmount, 6);
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
				const results = await limitOrderServices.cancelOrder(this.props.order);
				if (results) {
					this.props.dispatch(limitOrderActions.updateOrder(results));
					this.props.closeModal();
				}
			} catch (err) {
				console.log(err);
			}
		}
	}

	contentModal = () => {
		return (
			<div className="limit-order-modal">
				<div className="limit-order-modal__body">
					<div className="limit-order-modal__title">
						{this.props.translate("modal.cancel_order") ||
							"Cancel Order"}
					</div>
					<a className="x" onClick={e => this.props.closeModal()}>
						&times;
					</a>
					<div className="limit-order-modal__content">
						<div className="limit-order-modal__message">
							{this.props.translate(
								"limit_order.canceling_order_message" ||
									"You are canceling this order"
							)}
						</div>
						<div className="limit-order-modal__table">
							<ReactTable
								data={[this.props.order]}
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
