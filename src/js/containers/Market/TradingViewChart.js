import React from "react"
import { connect } from "react-redux"


import { Selector } from "../CommonElements"
import {Modal} from "../../components/CommonElement"

import { getTranslate } from 'react-localize-redux';
import * as marketActions from "../../actions/marketActions"


@connect((store) => {
    return {
        translate: getTranslate(store.locale),
        isOpen: store.market.configs.isShowTradingChart,
        selectedSymbol: store.market.configs.selectedSymbol
    }
})




export default class TradingViewChart extends React.Component {


    static defaultProps = {
		symbol: 'AAPL',
		interval: 'D',
		containerId: 'tv_chart_container',
		datafeedUrl: 'http://demo_feed.tradingview.com',
		libraryPath: '/charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
	};

    getLanguageFromURL = () => {
        const regex = new RegExp('[\\?&]lang=([^&#]*)');
        const results = regex.exec(window.location.search);
        return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    componentDidMount() {
		const widgetOptions = {
			symbol: this.props.symbol,
			// BEWARE: no trailing slash is expected in feed URL
			datafeed: new datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl),
			interval: this.props.interval,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,

			locale: this.getLanguageFromURL() || 'en',
			disabled_features: ['use_localstorage_for_settings'],
			enabled_features: ['study_templates'],
			charts_storage_url: this.props.chartsStorageUrl,
			charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			studies_overrides: this.props.studiesOverrides,
		};
		window.TradingView.onready(() => (() => {
			const widget = window.tvWidget = new window.TradingView.widget(widgetOptions);
			console.log({widget})
			widget.onChartReady(() => {
				const button = widget.createButton()
					.attr('title', 'Click to show a notification popup')
					.addClass('apply-common-tooltip')
					.on('click', () => widget.showNoticeDialog({
						title: 'Notification',
						body: 'TradingView Charting Library API works correctly',
						callback: () => {
							console.log('Noticed!');
						},
					}));

				button[0].innerHTML = 'Check API';
			});
		});
    }
    
    closeModal = () => {
        this.props.dispatch(marketActions.hideTradingViewChart())
    }

    content = () => {
        return (
            <div
				id={ this.props.containerId }
				className={ 'TVChartContainer' }
			/>
        )
    }

    render() {
        return (
			<div>
				charding view
			{this.content()}
			</div>
            // <Modal
            //         className={{
            //         base: 'reveal large',
            //         afterOpen: 'reveal large'
            //         }}
            //         isOpen={this.props.isOpen}
            //         onRequestClose={this.closeModal}
            //         contentLabel="trading view modal"
            //         content={this.content()}
            //         size="large"
            //     />
        )
    }
}
