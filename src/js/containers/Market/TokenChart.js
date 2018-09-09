import React from "react"
import { connect } from "react-redux"
import * as marketActions from "../../actions/marketActions";
import { Line } from 'react-chartjs-2';
import SlideDown, { SlideDownTrigger, SlideDownContent } from "../../components/CommonElement/SlideDown";
import { default as _ } from 'underscore';
import { getTranslate } from 'react-localize-redux';
import BLOCKCHAIN_INFO from "../../../../env";
import constants from '../../services/constants';
import { roundingNumber } from "../../utils/converter";
// import {roundingNumber} from "../../utils/converter"

import { defaults } from 'react-chartjs-2';
defaults.global.animation = false;

@connect((store) => {
  const market = store.market;

  return {
    translate: getTranslate(store.locale),
    market: market,
    chart: market.chart,
    account: store.account,
    currentLang: store.locale.languages[0].code
  }
})
export default class TokenChart extends React.Component {
  constructor() {
    super();

    this.state = {
      symbol: 'KNC',
      change: -9999,
      buyPrice: 0,
      contractAddress: null,
      shouldRefreshChartData: false,
    };
  }

  componentDidMount = () => {
    this.fetchAllChartData(true);

    this.interval = setInterval(() => {
      this.setState({ shouldRefreshChartData: true });
    }, constants.TOKEN_CHART_INTERVAL);
  }

  componentWillUnmount = () => {
    clearInterval(this.interval);
  }

  componentDidUpdate = (nextProps) => {
    const isSourceTokenSymbolChanged = this.props.sourceTokenSymbol !== nextProps.sourceTokenSymbol;
    const isdestTokenSymbolChanged = this.props.destTokenSymbol !== nextProps.destTokenSymbol;
    const isTimeRangeChanged = this.props.chartTimeRange !== nextProps.chartTimeRange;
    const isTokenListUpdated = this.props.market.tokens !== nextProps.market.tokens;

    if (isSourceTokenSymbolChanged || isdestTokenSymbolChanged || isTimeRangeChanged) {
      this.fetchAllChartData(true);
    } else if (isTokenListUpdated) {
      this.fetchAllChartData(this.state.shouldRefreshChartData);
      this.setState({ shouldRefreshChartData: false });
    }
  }

  fetchAllChartData = (shouldFetchChartData = false) => {
    const chartTokenSymbol = this.getChartToken();
    this.setChartTokenData(chartTokenSymbol);

    if (shouldFetchChartData) {
      this.props.dispatch(marketActions.fetchChartData(chartTokenSymbol, this.props.chartTimeRange));
    }
  }

  getChartToken = () => {
    let chartTokenSymbol = this.props.destTokenSymbol !== 'ETH' ? this.props.destTokenSymbol : this.props.sourceTokenSymbol;

    if (chartTokenSymbol === 'ETH') {
      chartTokenSymbol = 'KNC';
    }

    return chartTokenSymbol;
  }

  setChartTokenData = (chartTokenSymbol) => {
    const chartTokenInfo = _.chain(this.props.market.tokens).filter((values, symbol) => {
      return symbol === chartTokenSymbol;
    }).first().value();

    this.setState({
      symbol: chartTokenSymbol,
      change: chartTokenInfo.ETH.change,
      buyPrice: chartTokenInfo.ETH.buyPrice,
      contractAddress: chartTokenInfo.info.address
    });
  }

  render() {
    const chartRanges = { d: '1D', w: '1W', m: '1M', y: 'All' };
    const chartRangeHtml = _.map(chartRanges, (value, key) => {
      return (
        <div
          className={"balance-content__range-item" + (this.props.chartTimeRange == key ? ' balance-content__range-item--active' : '')}
          key={key}
          onClick={() => this.props.onChangeChartRange(key)}>
            {value}
        </div>
      )
    });
    const currentChartData = this.props.chart.points[this.props.chartTimeRange]
    var chartData = currentChartData && currentChartData.c ? currentChartData.c : [] 
    var currentToken = this.state.symbol
    // if (chartData && chartData.length > 0) {
    //   var max = chartData[0]
    //   chartData.map(function(ele) {
    //     if (ele > max) {
    //       max = ele
    //     }
    //   })
    // }
    var ticks = { display: false }
    // if (typeof(max) !== "undefined") {
    //   ticks.max = max * 1.2
    // }
    var weekDays = []
    var currentLang = this.props.currentLang
    switch (currentLang) {
      case "vi": {
        weekDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"]
        break
      }
      case "cn": {
        weekDays = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]
        break
      }
      case "kr": {
        weekDays = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"]
        break
      }
      default: {
        weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      }
    }
    const isNegativeChange = this.state.change < 0;
    const shouldRenderChart = this.state.change !== -9999 || (currentChartData && currentChartData.c.length && this.state.change !== -9999);
    const data = {
      labels: currentChartData && currentChartData.t ? currentChartData.t : [],
      datasets: [{
        data: chartData,
        backgroundColor: '#EBEBEB',
        //backgroundColor: isNegativeChange ? 'rgba(255, 99, 132, 0.2)' : 'rgba(49, 203, 158, 0.2)',
        //borderColor: isNegativeChange ? 'rgba(255,99,132,1)': '#31CB9E',
        borderColor: '#ccc',
        borderWidth: 1
      }]
    };
    const options = {
      elements: {
        point: { radius: 0 },
        line: { tension: 0 }
      },
      legend: { display: false },
      scales: {
        xAxes: [{
          display: false,
          ticks: { display: false },
          gridLines: { display: false }
        }],
        yAxes: [{
          display: false,
          ticks: ticks,
          gridLines: { display: false }
        }]
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: function(item, data) {
            var title = item[0].xLabel
            var timeStampNumber = parseInt(title)
            if (timeStampNumber) {
              var timeStamp = timeStampNumber * 1000
              var date = new Date(timeStamp)
              var dayInWeek = date.getDay()
              var day = date.getDate() > 10 ? date.getDate() : '0' + date.getDate()
              var month = date.getMonth() + 1 > 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
              var year = date.getFullYear()
              var hours = date.getHours() > 10 ? date.getHours() : '0' + date.getHours()
              var mins = date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes()
              var seconds = date.getSeconds() > 10 ? date.getSeconds() : '0' + date.getSeconds()
              var dateFormat = ""
              switch (currentLang) {
                case "vi": {
                  dateFormat = `${day}-${month}-${year}`
                  break
                }
                case "kr": {
                  dateFormat = `${year}-${month}-${day}`
                  break
                }
                case "cn": {
                  dateFormat = `${year}-${month}-${day}`
                  break
                }
                default: {
                  dateFormat = `${month}-${day}-${year}`
                }
              }
              title = `${weekDays[dayInWeek]}, ${dateFormat} ${hours}:${mins}:${seconds}`
            }
            return title
          },
          label: function(item, data) {
            var label = item.yLabel
            var rateFloat = parseFloat(label)
            if (rateFloat) {
              return `1 ${currentToken} = ${roundingNumber(rateFloat, 10)} ETH`
            }
            return item.yLabel
          }
        }
      }
    }

    //console.log({data, options})
    return (
      <div className="balance-content">
        <SlideDown active={this.props.isChartActive}>
          <SlideDownTrigger onToggleContent={() => this.props.onToggleChartContent()} classNameTrigger="token-slide-trigger">
            <div className="balance-content__pair">
              {this.state.symbol}/ETH
            </div>
            <div className="balance-content__rate-wrapper">
              <div className="balance-content__rate">{this.state.buyPrice}</div>

              <div className="balance-content__change_wrapper">
                <div className={"balance-content__change" +
                (isNegativeChange ? ' balance-content__change--nagative' : '') +
                (!shouldRenderChart ? ' balance-content__change--inactive' : '')}>
                  {shouldRenderChart ? this.state.change + '%' : '---'}
                </div>
          
                <div>in 24h</div>
              </div>
            </div>
          </SlideDownTrigger>

          <SlideDownContent>
            {shouldRenderChart === true && (
              <div>
                <div
                  className={"balance-content__chart" + (this.props.chart.isLoading ? ' balance-content__chart--loading' : '')}>
                  <Line
                    data={data}
                    options={options}
                    height={240}
                  />
                </div>
                <div className="balance-content__range">{chartRangeHtml}</div>
              </div>
            )}

            {/* {shouldRenderChart !== true && (
              <div className="balance-content__contract">
                <span className="balance-content__contract-title">Contract Address:</span>

                {this.state.contractAddress && (
                  <a className="balance-content__contract-address"
                     href={BLOCKCHAIN_INFO.ethScanUrl + "address/" + this.state.contractAddress}
                     target="_blank">
                    {this.state.contractAddress}
                  </a>
                )}
              </div>
            )} */}
          </SlideDownContent>
        </SlideDown>
      </div>
    )
  }
}
