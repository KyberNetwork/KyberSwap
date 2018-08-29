import React from "react"
import { connect } from "react-redux"


import { Selector } from "../CommonElements"
import { Modal } from "../../components/CommonElement"
import {TradingView} from "../Market"

import { getTranslate } from 'react-localize-redux';
import * as marketActions from "../../actions/marketActions"
import * as analytics from "../../utils/analytics"


@connect((store) => {
	return {
		translate: getTranslate(store.locale),
		isOpen: store.market.configs.isShowTradingChart,
		selectedSymbol: store.market.configs.selectedSymbol,
		currency: store.market.configs.currency.focus
	}
})

export default class TradingViewModal extends React.Component {
	closeModal = () => {
		this.props.dispatch(marketActions.hideTradingViewChart())
		analytics.trackClickCloseModal("TradingView Modal")
	}

	content = () => {
		const {currency} = this.props
		return (
			<div className="trading-view-modal">
			 	<a className="x" onClick={(e) => this.closeModal(e)}>&times;</a>
				{ currency==="USD" && <p className="trading-title">{this.props.translate("market.support_eth_only") || "Now support only pairs with ETH, not support pairs with USD yet."}</p>}
				{ currency==="ETH" && <p className="trading-title">{this.props.selectedSymbol} - ETH</p>}
				<TradingView />
			</div>
		)
	}

	render() {
		return (
			<Modal
			        className={{
			        base: 'reveal large trading_view_modal_wrapper',
			        afterOpen: 'reveal large'
			        }}
			        isOpen={this.props.isOpen}
			        onRequestClose={this.closeModal}
			        contentLabel="trading view modal"
			        content={this.content()}
			        size="large"
			    />
		)
	}
}
