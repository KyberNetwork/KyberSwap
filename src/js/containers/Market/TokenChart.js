import React from "react"
import { connect } from "react-redux"
import * as marketActions from "../../actions/marketActions";
import { Line } from 'react-chartjs-2';
import SlideDown, { SlideDownTrigger, SlideDownContent } from "../../components/CommonElement/SlideDown";
import { default as _ } from 'underscore';
import { getTranslate } from 'react-localize-redux';
import BLOCKCHAIN_INFO from "../../../../env";
import constants from '../../services/constants';

@connect((store) => {
  const market = store.market;

  return {
    translate: getTranslate(store.locale),
    market: market,
    chart: market.chart,
    account: store.account
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
    const isNegativeChange = this.state.change < 0;
    const shouldRenderChart = this.state.change !== -9999 || (this.props.chart.points.length && this.state.change !== -9999);
    const data = {
      labels: _.keys(this.props.chart.points),
      datasets: [{
        data: this.props.chart.points,
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
          ticks: { display: false },
          gridLines: { display: false }
        }]
      }
    }

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
                    height={298}
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
