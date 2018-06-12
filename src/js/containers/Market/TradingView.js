import React from "react"
import { connect } from "react-redux"


import { Selector } from "../CommonElements"

import { getTranslate } from 'react-localize-redux';


@connect((store) => {
	return {
		selectedSymbol: store.market.configs.selectedSymbol
	}
})


export default class TradingView extends React.Component {
	constructor(){
		super()
		this.state = {
			rateType : "sell",
		}
	}

	static defaultProps = {
	//	symbol: this.props.selectedSymbol,
		interval: '60',
		locale: 'en',		
		containerId: 'tv_chart_container',
		datafeedUrl: 'http://52.77.238.156:3000/chart',
		updateFrequency: 5000, // 1 minutes
		libraryPath: '/trading_view/charting_library/',
		fullscreen: false,
		autosize: true
	  };



	getLanguageFromURL = () => {
		const regex = new RegExp('[\\?&]lang=([^&#]*)');
		const results = regex.exec(window.location.search);
		return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
	}

	createButton = (widget, data) => {
		const button = widget.createButton()
			.attr('title', data.title)
			.addClass('apply-common-tooltip')
			.on('click', () => {
				window.KyberRateType = data.value;
				this.setState({rateType : data.value})
			});
		button[0].innerHTML = data.content;
	}
	componentDidMount() {
		const feeder = new window.Datafeeds.UDFCompatibleDatafeed(
			this.props.datafeedUrl, this.props.updateFrequency);
		const widgetOptions = {
			symbol: this.props.selectedSymbol,
			datafeed: feeder,
			interval: this.props.interval,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,
			timeframe: this.props.timeframe,
			time_frames: this.props.time_frames,
			locale: this.getLanguageFromURL() || this.props.locale,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize
		};

	//	window.TradingView.onready(() => {
			const widget = window.tvWidget = new window.TradingView.widget(widgetOptions);

			widget.onChartReady(() => {
				this.createButton(widget, {content: "Sell", value:"sell", title: "Sell price"})
				this.createButton(widget, {content: "Buy", value:"buy", title: "Buy price"})
				this.createButton(widget, {content: "Mid", value:"mid", title: "Mid price"})
			});
	//	});
	}



	render() {
		try{
			if (window.tvWidget) {
				const chart = window.tvWidget.chart();
				const oldR = chart.resolution();
				const newR = (oldR == "M") ? "W" : "M";
				
				chart.setResolution(newR, function(){
					chart.setResolution(oldR);
				});
			}
		}catch(e){
			console.log(e)
		}
		
		return (
			<div style={{height:600, padding: 40}}
				id={this.props.containerId}
				className={'TVChartContainer'}
			/>
		)
	}
}
