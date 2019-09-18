import React from "react"
import { connect } from "react-redux"
import { Selector } from "../CommonElements"
import { getTranslate } from 'react-localize-redux';
import { changeSymbol } from "../../actions/marketActions"
import BLOCKCHAIN_INFO from "../../../../env"

@connect((store) => {
  return {
    selectedSymbol: store.market.configs.selectedSymbol,
    locale: store.locale,
		translate: getTranslate(store.locale),
		global: store.global
  }
})

export default class TradingView extends React.Component {
	constructor() {
		super()
		this.state = {
			rateType: "",
			widget: null,
			widgetOverrides: null,
			iframeEl: null
		}
	}

	static defaultProps = {
		interval: '5',
		locale: 'en',
		containerId: 'tv_chart_container',
		datafeedUrl: BLOCKCHAIN_INFO.tracker + '/chart',
		updateFrequency: 300000, // 1 minutes
		libraryPath: '/trading_view/charting_library/',
		fullscreen: false,
		autosize: true
	};

	darkThemeWidget = {
		'paneProperties.background':  "#232323",
		'paneProperties.vertGridProperties.color': "#414141",
		'paneProperties.horzGridProperties.color': "#414141",
		'scalesProperties.textColor' : "#9ea1aa",	// text
		'mainSeriesProperties.candleStyle.upColor': "#32ca9e",
		'mainSeriesProperties.candleStyle.downColor': "#fa6566",
		'mainSeriesProperties.candleStyle.wickUpColor': '#32ca9e',
		'mainSeriesProperties.candleStyle.wickDownColor': '#fa6566'
	}

	lightThemeWidget = {
		'paneProperties.background':  "#FFFFFF",
		'paneProperties.vertGridProperties.color': "#E6E6E6",
		'paneProperties.horzGridProperties.color': "#E6E6E6",
		'scalesProperties.textColor' : "#555",
		'mainSeriesProperties.candleStyle.upColor': "#31CB9E",
		'mainSeriesProperties.candleStyle.downColor': "#F95555",
		'mainSeriesProperties.candleStyle.wickUpColor': '#31CB9E',
		'mainSeriesProperties.candleStyle.wickDownColor': '#F95555'
	}

  getLanguageFromURL = () => {
    var locale = this.props.locale
    var defaultValue = 'en'
    if (Array.isArray(locale.languages) && locale.languages.length === 1) {
      var language = locale.languages[0]
      switch (language.code) {
        case 'en':
          defaultValue = 'en'
          break;
        case 'cn':
          defaultValue = 'zh'
          break;
        case 'kr':
          defaultValue = 'ko'
          break;
        case 'vi':
          defaultValue = 'vi'
          break;
        default:
          defaultValue = 'en'
      }
    }
    return defaultValue
  }

  createButton = (widget, data) => {
    const button = widget.createButton()
      .attr('title', data.title)
      .addClass('apply-common-tooltip')
      .on('click', () => {
        window.KyberRateType = data.value;
        this.setState({ rateType: data.value })
      });
    button[0].innerHTML = data.content;
  }

	getTimeFrame = (interval) => {
		switch(interval) {
			case '5':
				return 12 * 3600
				break
			case '15':
				return 12 * 3 * 3600
				break
			case '30':
				return 12 * 6 * 3600
				break
			case '60':
				return 12 * 12 * 3600
				break
			case '120':
				return 12 * 24 * 3600
				break
			case '240':
				return 12 * 48 * 3600
				break
			case '360':
				return 12 * 72 * 3600
				break
			case '720':
				return 12 * 144 * 3600
				break
		}
		return '4D'
	}

	componentDidMount() {
		// console.log(this.props)
		const feeder = new window.Datafeeds.UDFCompatibleDatafeed(
			this.props.datafeedUrl, this.props.updateFrequency);


		const widgetOptions = {
			symbol: this.props.selectedSymbol,
			datafeed: feeder,
			interval: this.props.interval,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,
			// timeframe: this.props.timeframe,
			// time_frames: this.props.time_frames,
			locale: this.getLanguageFromURL() || this.props.locale,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			timeframe: this.getTimeFrame(this.props.interval),
			// timezone: "Asia/Singapore",
			overrides: {
				'mainSeriesProperties.candleStyle.drawBorder': false,
			}
		};

		const widgetOverrides = this.props.global.theme === "dark" ? this.darkThemeWidget : this.lightThemeWidget;

		const widget = window.tvWidget = new window.TradingView.widget(widgetOptions);
		
		this.setState({
			widget,
			widgetOverrides
		});

		widget.onChartReady(() => {
			// this.createButton(widget, { content: this.props.translate("trading_view.sell") || "Sell", value: "sell", title: this.props.translate("trading_view.sell_price") || "Sell price" })
			// this.createButton(widget, { content: this.props.translate("trading_view.buy") || "Buy", value: "buy", title: this.props.translate("trading_view.buy_price") || "Buy price" })
			// this.createButton(widget, { content: this.props.translate("trading_view.mid") || "Mid", value: "mid", title: this.props.translate("trading_view.mid_price") || "Mid price" })

      widget.activeChart().onSymbolChanged().subscribe(null, (symbolData) => {
        this.props.dispatch(changeSymbol(symbolData.name))
      })

			const chart = widget.chart();

			// chart.onIntervalChanged().subscribe(null, (interval, obj) => {

			// 	if (interval === "D") {
			// 		obj.timeframe = "100D"
			// 	} else if (interval === "W") {
			// 		obj.timeframe = "24M"
			// 	} else {
			// 		obj.timeframe = `${3600 / interval * 24}`;
			// 	}
			// });
		});


		const parent = document.getElementById(this.props.containerId);
		if (parent !== null) {
			const iframeEl = parent.getElementsByTagName("iframe")[0];
			this.setState({
				iframeEl
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		const { iframeEl } = this.state;
		if (nextProps.global.theme === this.props.global.theme) {
			return
		}
		if (nextProps.global.theme === "dark") {
			this.setState({
				widgetOverrides: this.darkThemeWidget,
			});

			// send message to iframe
			if (iframeEl !== null) {
				iframeEl.contentWindow.postMessage("dark", "*")
			}
		} else {
			this.setState({
				widgetOverrides: this.lightThemeWidget,
			});
			
			// send message to iframe
			if (iframeEl !== null) {
				iframeEl.contentWindow.postMessage("light", "*")
			}
		}
	}

  render() {
		const { widget, widgetOverrides, iframeEl } = this.state;
		if (widget !== null) {
			widget.onChartReady(() => {
				widget.applyOverrides(widgetOverrides)
			})
		}

		return (
      <div id={this.props.containerId} className={`trading-view`}/>
    )
  }
}
