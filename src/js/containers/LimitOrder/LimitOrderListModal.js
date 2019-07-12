import React, { Component } from "react";
import { Modal } from "../../components/CommonElement";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import CancelOrderModal from "./LimitOrderModals/CancelOrderModal";
import LimitOrderTable from "./LimitOrderTable";
import * as limitOrderActions from "../../actions/limitOrderActions";

@connect((store, props) => {
	const account = store.account.account;
	const translate = getTranslate(store.locale);
	const tokens = store.tokens.tokens;
	const limitOrder = store.limitOrder;
	const ethereum = store.connection.ethereum;
	const global = store.global;

	return {
		translate,
		limitOrder,
		tokens,
		account,
		ethereum,
		global
	};
})
export default class LimitOrderListModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			timeFilter: [
				{ interval: 1, unit: "day" },
				{ interval: 1, unit: "week" },
				{ interval: 1, unit: "month" },
				{ interval: 3, unit: "month" }
			],
			limitOrderModalVisible: false,
			cancelOrderModalVisible: false,
			currentOrder: null,
		};
	}

	onChangeTimeFilter = (item) => {
		const filter = {
			timeFilter: {
				interval: item.interval,
				unit: item.unit
			},
			pageIndex: 1
		};
		this.props.dispatch(limitOrderActions.getOrdersByFilter(filter));
		this.props.dispatch(limitOrderActions.getListFilter());
	}

	// Render time filter
  getTimeFilter = () => {
    const { timeFilter } = this.state;

    return timeFilter.map((item, index) => {
      // Translate date unit
      const convertedUnit = this.props.translate(`limit_order.${item.unit.toLowerCase()}`) || item.unit.charAt(0) + item.unit.slice(1);

      let className = "";
      if (item.unit === this.props.limitOrder.timeFilter.unit && item.interval === this.props.limitOrder.timeFilter.interval) {
        className = "filter--active";
      }

      return (
        <li key={index} onClick={(e) => this.onChangeTimeFilter(item)}>
          <a className={className}>{`${item.interval} ${convertedUnit}`}</a>
        </li>
      );
    })
	}
	
	toggleLimitOrderListModal = () => {
		this.setState({
			limitOrderModalVisible: !this.state.limitOrderModalVisible
		});
	}

	openCancelOrderModal = (order) => {
		this.props.global.analytics.callTrack("trackClickCancelOrder", order.id);
		if (order) {
			this.setState({
				cancelOrderModalVisible: true,
				currentOrder: order
			});
		}
	}

	closeCancelOrderModal = () => {
    this.setState({
      cancelOrderModalVisible: false
    });
  }
	
	getContent = () => {
		return (
			<div className="limit-order-modal">
				<div className="limit-order-modal__body">
					<div className="limit-order-modal__title">
						{this.props.translate("limit_order.order_list_title") || "Manage Your Orders"} 
					</div>
          {<div className="limit-order-list--title-faq">
            <a href="/faq#I-submitted-the-limit-order-but-it-was-not-triggered-even-though-my-desired-price-was-hit" target="_blank">
              {this.props.translate("limit_order.wonder_why_order_not_filled")}
            </a>
          </div>}
          <a className="limit-order-list__leaderboard limit-order-modal__leaderboard" href="/limit_order_leaderboard" target="_blank" rel="noreferrer noopener">
            Limit Order LeaderBoard
          </a>
					<div className="limit-order-modal__close" onClick={e => this.toggleLimitOrderListModal()}>
						<div className="limit-order-modal__close-wrapper"></div>
					</div>
					<div className="limit-order-modal__content">
						<div className="limit-order-list__filter-container">
							<div className="limit-order-list__filter-container">
								<ul className="filter">
									{this.getTimeFilter()}
								</ul>
							</div>
						</div>
						<div className="limit-order-list--table-mobile">
							<LimitOrderTable
								data={this.props.limitOrder.listOrder}
								screen="mobile"
								openCancelOrderModal={this.openCancelOrderModal}
								srcInputElementRef={this.props.srcInputElementRef}
								toggleLimitOrderListModal={this.toggleLimitOrderListModal}
							/>
							<CancelOrderModal order={this.state.currentOrder} 
								isOpen={this.state.cancelOrderModalVisible}
								closeModal={this.closeCancelOrderModal}
								screen="mobile"
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}

	render() {
		return (
			<div className="limit-order-list__wrapper">
				<div className="limit-order-list--title">
					<a className="title" onClick={e => this.toggleLimitOrderListModal()}>
						{this.props.translate(
							"limit_order.order_list_title"
						) || "Manage Your Orders"}
					</a>
				</div>
				<div className="limit-order-list__filter-container">
					<ul className="filter">
						{this.getTimeFilter()}
					</ul>
				</div>
				<Modal className={{
						base: 'reveal large confirm-modal',
						afterOpen: 'reveal large confirm-modal'
					}}
					isOpen={this.state.limitOrderModalVisible}
					onRequestClose={this.toggleLimitOrderListModal}
					contentLabel="Manage list orders modal"
					content={this.getContent()}
					size="large"
				/>
			</div>
		);
	}
}
