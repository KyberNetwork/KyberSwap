import React from "react"
import { connect } from "react-redux"


import { Selector } from "../CommonElements"
import { Modal } from "../../components/CommonElement"
import {TradingView} from "../Market"

import { getTranslate } from 'react-localize-redux';
import * as marketActions from "../../actions/marketActions"


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
	}

	content = () => {
		const {currency} = this.props
		return (
			<div className="trading-view-modal">
				{ currency==="USD" && <p>Now support only pairs with ETH, not support pairs with USD yet.</p>}
				<TradingView />
			</div>
		)
	}

	render() {
		return (
			<Modal
			        className={{
			        base: 'reveal large',
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
