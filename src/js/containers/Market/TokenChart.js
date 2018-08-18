import React from "react"
import { connect } from "react-redux"
import * as marketActions from "../../actions/marketActions";
import { Line } from 'react-chartjs-2';
import SlideDown, { SlideDownTrigger, SlideDownContent } from "../../components/CommonElement/SlideDown";
import { default as _ } from 'underscore';
import { getTranslate } from 'react-localize-redux';

@connect((store) => {
  const market = store.market;

  return {
    translate: getTranslate(store.locale),
    market: market,
    chart: market.chart,
    exchange: store.exchange,
  }
})
export default class TokenChart extends React.Component {
  componentDidUpdate = (nextProps) => {
    if ((this.props.sourceTokenSymbol !== nextProps.sourceTokenSymbol) || (this.props.destTokenSymbol !== nextProps.destTokenSymbol) || (this.props.market.tokens !== nextProps.market.tokens)) {
      this.fetchAllChartData(nextProps.sourceTokenSymbol, nextProps.destTokenSymbol);
    }
  }

  fetchAllChartData = (sourceTokenSymbol, destTokenSymbol) => {
    const chartTokenSymbol = this.getChartToken(sourceTokenSymbol, destTokenSymbol);

    this.setChartTokenData(chartTokenSymbol);
    this.props.dispatch(marketActions.fetchChartData(chartTokenSymbol));
  }

  getChartToken = (sourceTokenSymbol, destTokenSymbol) => {
    let chartTokenSymbol =
      this.props.exchange.destTokenSymbol !== 'ETH' ? this.props.exchange.destTokenSymbol : this.props.exchange.sourceTokenSymbol;

    if (chartTokenSymbol === 'ETH') {
      chartTokenSymbol = 'KNC';
    }

    return chartTokenSymbol;
  }

  setChartTokenData = (chartTokenSymbol) => {
    const chartTokenInfo = _.chain(this.props.market.tokens).filter((values, symbol) => {
      return symbol === chartTokenSymbol;
    }).first().value();

    this.props.dispatch(marketActions.setChartTokenData(
      chartTokenSymbol, chartTokenInfo.ETH.change, chartTokenInfo.ETH.buyPrice
    ));
  }

  changeChartRange = (value) => {
    this.props.dispatch(marketActions.setChartLoading(true));
    this.props.dispatch(marketActions.setChartTimeRange(value));
    this.props.dispatch(marketActions.setChartLoading(false));
  }

  toggleChartContent = () => {
    this.props.dispatch(marketActions.toggleChartContent());
  }

  render() {
    const chartRanges = ['1D', '1W', '1M', 'All'];
    const chartRangeHtml = chartRanges.map((value, index) => {
      return (
        <div
          className={"balance-content__range-item" + (this.props.chart.timeRange == value ? ' balance-content__range-item--active' : ' disabled')}
          key={index}
          onClick={() => this.changeChartRange(value)}>
            {value}
        </div>
      )
    })
    const isNegativeChange = this.props.chart.token.change < 0;
    const shouldRenderChart = this.props.chart.token.change !== -9999 || (this.props.chart.points.length && this.props.chart.token.change !== -9999);
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
        <SlideDown active={this.props.chart.isActive}>
          <SlideDownTrigger onToggleContent={() => this.toggleChartContent()}>
            <div className="balance-content__pair">
              {this.props.chart.token.symbol}/ETH
            </div>
            <div className="balance-content__rate-wrapper">
              <div className="balance-content__rate">{this.props.chart.token.buyPrice}</div>
              <div className={"balance-content__change" +
              (isNegativeChange ? ' balance-content__change--nagative' : '') +
              (!shouldRenderChart ? ' balance-content__change--inactive' : '')}>
                {shouldRenderChart ? this.props.chart.token.change + '%' : '---'}
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
          </SlideDownContent>
        </SlideDown>
      </div>
    )
  }
}
