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
    translate: getTranslate(store.locale)
  }
})

export default class TradingView extends React.Component {
  constructor() {
    super()
    this.state = {
      rateType: "sell",
    }
  }

  static defaultProps = {
    interval: '60',
    locale: 'en',
    containerId: 'tv_chart_container',
    datafeedUrl: BLOCKCHAIN_INFO.tracker + '/chart',
    updateFrequency: 300000, // 1 minutes
    libraryPath: '/trading_view/charting_library/',
    fullscreen: false,
    autosize: true
  };

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

  componentDidMount() {
    const feeder = new window.Datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl, this.props.updateFrequency);
    const widgetOptions = {
      symbol: this.props.selectedSymbol,
      datafeed: feeder,
      interval: this.props.interval,
      container_id: this.props.containerId,
      library_path: this.props.libraryPath,
      locale: this.getLanguageFromURL() || this.props.locale,
      fullscreen: this.props.fullscreen,
      autosize: this.props.autosize,
      timeframe: "4D",
      overrides: {
        'mainSeriesProperties.candleStyle.upColor': '#31CB9E',
        'mainSeriesProperties.candleStyle.downColor': '#F95555',
        'mainSeriesProperties.candleStyle.wickUpColor': '#31CB9E',
        'mainSeriesProperties.candleStyle.wickDownColor': '#F95555',
        'mainSeriesProperties.candleStyle.drawBorder': false,
      }
    };

    const widget = window.tvWidget = new window.TradingView.widget(widgetOptions);

    widget.onChartReady(() => {
      this.createButton(widget, { content: this.props.translate("trading_view.sell") || "Sell", value: "sell", title: this.props.translate("trading_view.sell_price") || "Sell price" })
      this.createButton(widget, { content: this.props.translate("trading_view.buy") || "Buy", value: "buy", title: this.props.translate("trading_view.buy_price") || "Buy price" })
      this.createButton(widget, { content: this.props.translate("trading_view.mid") || "Mid", value: "mid", title: this.props.translate("trading_view.mid_price") || "Mid price" })

      widget.activeChart().onSymbolChanged().subscribe(null, (symbolData) => {
        this.props.dispatch(changeSymbol(symbolData.name))
      })

      const chart = widget.chart();

      chart.onIntervalChanged().subscribe(null, (interval, obj) => {
        if (interval === "D") {
          obj.timeframe = "100D"
        } else if (interval === "W") {
          obj.timeframe = "24M"
        } else {
          obj.timeframe = `${interval / 60 * 4}D`;
        }
      });
    });
  }

  render() {
    return (
      <div id={this.props.containerId} className={'trading-view'}/>
    )
  }
}
