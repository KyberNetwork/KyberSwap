import React from "react"
import { connect } from "react-redux"
import * as marketActions from "../../actions/marketActions";
import { Line } from 'react-chartjs-2';
import SlideDown, { SlideDownTrigger, SlideDownContent } from "../../components/CommonElement/SlideDown";
import { default as _ } from 'underscore';
import { getTranslate } from 'react-localize-redux';
import BLOCKCHAIN_INFO from "../../../../env";

@connect((store) => {
  const market = store.market;

  return {
    translate: getTranslate(store.locale),
    market: market,
    chart: market.chart,
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
    };
  }

  componentDidMount = () => {
    this.fetchAllChartData();
  }

  componentDidUpdate = (nextProps) => {
    const isTokenListUpdated = this.props.market.tokens !== nextProps.market.tokens;
    const isSourceTokenSymbolChanged = this.props.sourceTokenSymbol !== nextProps.sourceTokenSymbol;
    const isdestTokenSymbolChanged = this.props.destTokenSymbol !== nextProps.destTokenSymbol;
    const isTimeRangeChanged = this.props.chartTimeRange !== nextProps.chartTimeRange;

    if (isSourceTokenSymbolChanged || isdestTokenSymbolChanged || isTokenListUpdated || isTimeRangeChanged) {

      if (isTokenListUpdated) {
        this.fetchAllChartData(true);
      } else {
        this.fetchAllChartData();
      }
    }
  }

  fetchAllChartData = (disableLoading = false) => {
    const chartTokenSymbol = this.getChartToken();

    this.setChartTokenData(chartTokenSymbol);

    this.props.dispatch(marketActions.fetchChartData(chartTokenSymbol, this.props.chartTimeRange, disableLoading));
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
    })
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
    const isNegativeChange = this.state.change < 0;
    const shouldRenderChart = this.state.change !== -9999 || (this.props.chart.points.length && this.state.change !== -9999);
    const data = {
      labels: _.keys(this.props.chart.points),
      datasets: [{
        data: this.props.chart.points,
        backgroundColor: isNegativeChange ? 'rgba(255, 99, 132, 0.2)' : 'rgba(49, 203, 158, 0.2)',
        borderColor: isNegativeChange ? 'rgba(255,99,132,1)': '#31CB9E',
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
          ticks: { display: false },
          gridLines: { display: false }
        }]
      }
    }

    return (
      <div className="balance-content">
        <SlideDown active={this.props.isChartActive}>
          <SlideDownTrigger onToggleContent={() => this.props.onToggleChartContent()}>
            <div className="balance-content__pair">
              {this.state.symbol}/ETH
            </div>
            <div className="balance-content__rate-wrapper">
              <div className="balance-content__rate">{this.state.buyPrice}</div>
              <div className={"balance-content__change" +
              (isNegativeChange ? ' balance-content__change--nagative' : '') +
              (!shouldRenderChart ? ' balance-content__change--inactive' : '')}>
                {shouldRenderChart ? this.state.change + '%' : '---'}
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
                    height={200}
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
