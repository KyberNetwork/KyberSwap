import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux';
import BLOCKCHAIN_INFO from "../../../../env"

@connect((store) => {
  return {
    selectedSymbol: 'KNC',
    locale: store.locale,
    translate: getTranslate(store.locale),
    global: store.global
  }
})

export default class TradingView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rateType: "",
      widget: null,
      widgetOverrides: null,
    }
  }

  static defaultProps = {
    interval: '60',
    locale: 'en',
    containerId: 'tv_chart_container',
    datafeedUrl: BLOCKCHAIN_INFO.tracker + '/chart',
    updateFrequency: 300000, // 1 minutes
    libraryPath: `${process.env.integrate ? '' : '/assets/libs'}/trading_view/charting_library/`,
    fullscreen: false,
    autosize: true,
    timezone: "Etc/UTC"
  };

  darkThemeWidget = {
    'paneProperties.background': "#232323",
    'paneProperties.vertGridProperties.color': "#414141",
    'paneProperties.horzGridProperties.color': "#414141",
    'scalesProperties.textColor': "#9ea1aa",	// text
    'mainSeriesProperties.candleStyle.upColor': "#32ca9e",
    'mainSeriesProperties.candleStyle.downColor': "#fa6566",
    'mainSeriesProperties.candleStyle.wickUpColor': '#32ca9e',
    'mainSeriesProperties.candleStyle.wickDownColor': '#fa6566'
  }

  lightThemeWidget = {
    'paneProperties.background': "#FFFFFF",
    'paneProperties.vertGridProperties.color': "#E6E6E6",
    'paneProperties.horzGridProperties.color': "#E6E6E6",
    'scalesProperties.textColor': "#555",
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
    switch (interval) {
      case '5':
        return 12 * 3600
      case '15':
        return 12 * 3 * 3600
      case '30':
        return 12 * 6 * 3600
      case '60':
        return 12 * 12 * 3600
      case '120':
        return 12 * 24 * 3600
      case '240':
        return 12 * 48 * 3600
      case '360':
        return 12 * 72 * 3600
      case '720':
        return 12 * 144 * 3600
    }
    return '4D'
  }

  getChartProperties = () => {
    var chartProperties = {}
    try {
      chartProperties = {
        "tradingview.chartproperties": JSON.parse(localStorage.getItem("tradingview.chartproperties")),
        "tvxwevents.settings": JSON.parse(localStorage.getItem("tvxwevents.settings"))
      }
    } catch (e) {
      console.log(e)
    }
    return chartProperties
  }

  componentDidMount() {
    const feeder = new window.Datafeeds.UDFCompatibleDatafeed(
      this.props.datafeedUrl, this.props.updateFrequency);


    var disabled_features = ['header_compare', 'header_symbol_search']
    var overrides = {
      'mainSeriesProperties.candleStyle.drawBorder': false,
    }
    if (this.props.global.isOnMobile) {
      disabled_features = ['header_compare', 'header_symbol_search', 'left_toolbar', 'header_undo_redo', 'header_settings',
        'header_chart_type', 'header_screenshot', 'pane_context_menu', 'main_series_scale_menu']
      overrides['paneProperties.legendProperties.showSeriesTitle'] = false
      overrides['paneProperties.legendProperties.showSeriesOHLC'] = false
      overrides['paneProperties.legendProperties.showBarChange'] = false
    }

    var chartProperties = this.getChartProperties()

    const widgetOptions = {
      symbol: `${this.props.baseSymbol}_${this.props.quoteSymbol}`,
      allow_symbol_change: false,
      datafeed: feeder,
      interval: chartProperties["tvxwevents.settings"] ? chartProperties["tvxwevents.settings"].value : this.props.interval,
      container_id: this.props.containerId,
      library_path: this.props.libraryPath,
      locale: this.getLanguageFromURL() || this.props.locale,
      fullscreen: this.props.fullscreen,
      autosize: this.props.autosize,
      timeframe: this.getTimeFrame(this.props.interval),
      theme: this.props.global.theme === "dark" ? "Dark" : "Light",
      disabled_features: disabled_features,
      timezone: chartProperties["tradingview.chartproperties"] ? chartProperties["tradingview.chartproperties"].timezone : this.props.timezone,
      overrides: overrides
    };

    const widgetOverrides = this.props.global.theme === "dark" ? this.darkThemeWidget : this.lightThemeWidget;

    const widget = window.tvWidget = new window.TradingView.widget(widgetOptions);

    this.setState({
      widget,
      widgetOverrides
    });

    widget.onChartReady(() => {
      const chart = widget.chart();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.global.theme === this.props.global.theme) {
      return
    }
    const { widget } = this.state;
    if (nextProps.global.theme === "dark") {
      widget.changeTheme("Dark")
      this.setState({
        widgetOverrides: this.darkThemeWidget,
      });
    } else {
      widget.changeTheme("Light")
      this.setState({
        widgetOverrides: this.lightThemeWidget,
      });
    }
  }

  changePair(baseSymbol, quoteSymbol) {
    const { widget } = this.state;
    if (widget) {
      widget.onChartReady(() => {
        const chart = widget.chart();
        const symbol = `${baseSymbol}_${quoteSymbol}`
        chart.setSymbol(symbol, e => {
        });
      });
    }
  }

  render() {
    const { widget, widgetOverrides } = this.state;
    if (widget !== null) {
      widget.onChartReady(() => {
        widget.applyOverrides(widgetOverrides)
      })
    }

    this.changePair(this.props.baseSymbol, this.props.quoteSymbol)

    return (
      <div id={this.props.containerId} className={`trading-view`}/>
    )
  }
}
