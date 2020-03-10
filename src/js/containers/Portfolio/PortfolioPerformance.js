import React from "react"
import Chart from "chart.js";
import portfolioChartService from "../../services/portfolio_balance";
import { CHART_RANGE_TYPE } from "../../services/portfolio_balance/portfolioChartUtils";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";

@connect((store) => {
  const address = store.account.account.address || '';
  const ethereum = store.connection.ethereum
  return {
    tokens: store.tokens.tokens,
    ethToken: store.tokens.tokens.ETH,
    account: store.account,
    address: address.toLowerCase(),
    translate: getTranslate(store.locale),
    global: store.global,
    ethereum: ethereum,
    portfolioPerformance: store.account.portfolioPerformance
  }
})

export default class PortfolioPerformance extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tokenAddresses: {},
      renderedChart: false,
      selectedTimeRange: CHART_RANGE_TYPE.SEVEN_DAYS,
      chartData: null
    };
    this.chartInstance = null
    this.renderedAtInnitTime = false
    this.fetchingTxsInterval = null
  }

  async componentDidMount() {
    await this.fetchChartData(this.props.address, this.props.ethereum, this.props.tokens)
  }

  componentWillUnmount() {
    this.clearFetchingInterval();
  }
  

  async componentWillReceiveProps(nextProps){
    if(nextProps.account.account.address && nextProps.ethereum && !this.renderedAtInnitTime){
      const ethereum = nextProps.ethereum;
      const tokens = this.props.tokens
      const address = nextProps.account.account.address
      await this.fetchChartData(address, ethereum, tokens)
    }
  }

  async fetchChartData(address, ethereum, tokens){
    if(!ethereum || !address || !tokens) return
    this.renderedAtInnitTime = true

    const chartData = await portfolioChartService.render(ethereum, address.toLowerCase(), tokens, this.state.selectedTimeRange)
    console.log("=#############====chartData", chartData)

    if (chartData.isError) {
      this.clearFetchingInterval();
      return;
    }

    if (chartData.inQueue) {
      if (this.fetchingTxsInterval === null) {
        this.fetchingTxsInterval = setInterval(async () => {
          await this.fetchChartData(this.props.address, this.props.ethereum, this.props.tokens)
        }, 2000);
      }
      
      return;
    }


    this.updateChartBalance(chartData)
  }

  clearFetchingInterval() {
    clearInterval(this.fetchingTxsInterval);
    this.fetchingTxsInterval = null;
  }

  renderChartBalance(chartData) {
    if (chartData) {
      this.chartInstance = new Chart(this.props.performanceChart.current, {
        type: 'line',
        data: {
          labels: chartData.label,
          datasets: [{
            data: chartData.data.map(d => d.eth),
            backgroundColor: 'rgba(30, 137, 193, 0.3)',
            borderColor: '#1e89c1'
          }]
        },
        options: {
          legend: {
            display: false
          },
          tooltips: {
            mode: 'x-axis'
          },
          responsive: false
        }
      });
    }
  }

  updateChartBalance(chartData){
    if(!this.chartInstance) {
      this.renderChartBalance(chartData)
    } else {
      this.chartInstance.data.labels = chartData.label
      this.chartInstance.data.datasets = [{
        data: chartData.data.map(d => d.eth),
        backgroundColor: 'rgba(30, 137, 193, 0.3)',
        borderColor: '#1e89c1'
      }]
      this.chartInstance.update()
    }
  }

  async selectTimeRange(range){
    this.setState({
      selectedTimeRange: range
    }, async () => {
      await this.fetchChartData(this.props.address, this.props.ethereum, this.props.tokens)
    })
    
  }

  render() {
    this.renderChartBalance()
    return (
      <div className={"portfolio__performance portfolio__item theme__background-2"}>
        <div className={"portfolio__performance__chart__header"}>
          <div className={"portfolio__title"}>Portfolio Performance</div>
          <div className="common__mb-10">
            <div className={"portfolio__switcher"}>
              <div className={"portfolio__switcher-item" + (this.state.selectedTimeRange == CHART_RANGE_TYPE.ONE_DAY ? " portfolio__switcher-item--active" : "")} 
              onClick={() => this.selectTimeRange(CHART_RANGE_TYPE.ONE_DAY)}>24H</div>

              <div className={"portfolio__switcher-item" + (this.state.selectedTimeRange == CHART_RANGE_TYPE.SEVEN_DAYS ? " portfolio__switcher-item--active" : "")} 
              onClick={() => this.selectTimeRange(CHART_RANGE_TYPE.SEVEN_DAYS)}>7 Days</div>

              <div className={"portfolio__switcher-item" + (this.state.selectedTimeRange == CHART_RANGE_TYPE.ONE_MONTH ? " portfolio__switcher-item--active" : "")} 
              onClick={() => this.selectTimeRange(CHART_RANGE_TYPE.ONE_MONTH)}>1 Month</div>

              <div className={"portfolio__switcher-item" + (this.state.selectedTimeRange == CHART_RANGE_TYPE.THREE_MONTHS ? " portfolio__switcher-item--active" : "")} 
              onClick={() => this.selectTimeRange(CHART_RANGE_TYPE.THREE_MONTHS)}>3 Months</div>

              
            </div>
          </div>

        </div>

        <canvas className={"portfolio__performance-chart"} height="200" ref={this.props.performanceChart} />
      </div>
    )
  }
}
