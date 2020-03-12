import React,  { Fragment } from "react"
import Chart from "chart.js";
import portfolioChartService from "../../services/portfolio_balance";
import { CHART_RANGE_TYPE, getTimeUnitWithTimeRange } from "../../services/portfolio_balance/portfolioChartUtils";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import InlineLoading from "../../components/CommonElement/InlineLoading";

@connect((store) => {
  const address = store.account.account.address || '';
  const ethereum = store.connection.ethereum
  return {
    tokens: store.tokens.tokens,
    ethToken: store.tokens.tokens.ETH,
    account: store.account,
    address: address.toLowerCase(),
    translate: getTranslate(store.locale),
    theme: global.theme,
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
      chartData: null,
      chartLoading: true,
      emplyWallet: false
    };
    this.chartInstance = null
    this.renderedAtInnitTime = false
    this.intervalRenderAtInitTime = null
    this.fetchingTxsInterval = null
    this.currency = props.currency
  }

  async componentDidMount() {
    await this.fetchChartData(this.props.address, this.props.ethereum, this.props.tokens)
    this.intervalRenderAtInitTime = setInterval(async () => {
      if(this.renderedAtInnitTime) {
        this.clearIntervalRenderAtInitTime()
      } else {
        await this.fetchChartData(this.props.address, this.props.ethereum, this.props.tokens)
      }  
    }, 4000);
  }

  componentWillUnmount() {
    this.clearFetchingInterval();
  }
  

  async componentWillReceiveProps(nextProps){
    // if(nextProps.account.account.address && nextProps.ethereum && !this.renderedAtInnitTime){
    //   const ethereum = nextProps.ethereum;
    //   const tokens = this.props.tokens
    //   const address = nextProps.account.account.address
    //   await this.fetchChartData(address, ethereum, tokens)
    // }
    if(nextProps.currency !== this.currency){
      this.currency = nextProps.currency
      this.updateChartForNewCurrency()
    }
  }

  async fetchChartData(address, ethereum, tokens){
    console.log("_____________________________ call fetchChartData")
    if(!ethereum || !address || !tokens) return
    this.renderedAtInnitTime = true


    const chartData = await portfolioChartService.render(ethereum, address.toLowerCase(), tokens, this.state.selectedTimeRange)
    console.log("=#############====chartData", chartData)

    if (!chartData || chartData.isError) {
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
    this.clearFetchingInterval();

    this.setState({
      chartData
    })

    this.updateChartBalance(chartData)
    this.setState({chartLoading: false})
  }

  clearFetchingInterval() {
    clearInterval(this.fetchingTxsInterval);
    this.fetchingTxsInterval = null;
  }

  clearIntervalRenderAtInitTime(){
    clearInterval(this.intervalRenderAtInitTime);
    this.intervalRenderAtInitTime = null;
  }
  renderChartBalance(chartData) {
    if (chartData) {
      const currentCurrency = this.currency
      const arrayValue = chartData.data.map(d => d[currentCurrency.toLowerCase()])
      this.chartInstance = new Chart(this.props.performanceChart.current, {
        type: 'line',
        data: {
          labels: chartData.label,
          datasets: [{
            data: arrayValue,
            backgroundColor: 'rgba(30, 137, 193, 0.3)',
            borderColor: '#1e89c1',
            borderWidth: 0.7,
            pointRadius: 0,
            lineTension: 0
          }]
        },
        options: {
          legend: {
            display: false
          },
          tooltips: {
            mode: 'x-axis',
            callbacks: {
              label: function(t, d) {
                return t.yLabel + " " + currentCurrency.toUpperCase()
              }
            }
          },
          scales: {
            xAxes: [{
              display: true,
              gridLines: {
                display:false
              },
              type: 'time',
              ticks: {
                autoSkip: true,
                maxTicksLimit: 6,
                maxRotation: 0,
                minRotation: 0,
              },
              time: {
                unit: getTimeUnitWithTimeRange(this.state.selectedTimeRange),
                displayFormats: {
                  'day': 'MMM DD',
                  'hour': 'hA'
                }
              }
            }],
            yAxes: [{
              display: true,
              gridLines: {
                display:false
              },
              ticks: {
                min: chartData["min" + currentCurrency.toUpperCase()],
                max: chartData["max" + currentCurrency.toUpperCase()],
                maxTicksLimit: 1,
                mirror: true,
                // fontColor: "#fff",
                // fontSize: 18,
              }
            }],
          },
          responsive: true
        }
      });
    }
  }

  updateChartForNewCurrency(){
    if(!this.state.chartData || !this.chartInstance) return
    const currentCurrency = this.currency
    const arrayValue = this.state.chartData.data.map(d => d[currentCurrency.toLowerCase()])
    this.chartInstance.data.datasets = [{
      data: arrayValue,
      backgroundColor: 'rgba(30, 137, 193, 0.3)',
      borderColor: '#1e89c1',
      borderWidth: 0.7,
      pointRadius: 0,
      lineTension: 0
    }]
    this.chartInstance.options.scales.yAxes = [{
        display: true,
        gridLines: {
          display:false
        },
        ticks: {
          maxTicksLimit: 1,
          min: this.state.chartData["min" + currentCurrency.toUpperCase()],
          max: this.state.chartData["max" + currentCurrency.toUpperCase()],
          mirror: true,
          // fontColor: "#fff",
          // fontSize: 18,
        }
      }]

      this.chartInstance.options.tooltips = {
        mode: 'x-axis',
        callbacks: {
          label: function(t, d) {
            return t.yLabel + " " + currentCurrency.toUpperCase()
          }
        }
      }
    this.chartInstance.update()
  }

  updateChartBalance(chartData){
    if(!this.chartInstance) {
      this.renderChartBalance(chartData)
    } else {
      const currentCurrency = this.currency
      this.chartInstance.data.labels = chartData.label
      this.chartInstance.data.datasets = [{
        data: chartData.data.map(d => d[currentCurrency.toLowerCase()]),
        backgroundColor: 'rgba(30, 137, 193, 0.3)',
        borderColor: '#1e89c1',
        borderWidth: 0.7,
        pointRadius: 0,
        lineTension: 0
      }]
      this.chartInstance.options.scales.xAxes = [{
        display: true,
        gridLines: {
          display:false
        },
        type: 'time',
        ticks: {
          autoSkip: true,
          maxTicksLimit: 6,
          maxRotation: 0,
          minRotation: 0,
        },
        time: {
          unit: getTimeUnitWithTimeRange(this.state.selectedTimeRange),
          displayFormats: {
            'minute': "h:mm a",
            'day': 'MMM DD',
            'hour': 'hA'
          }
        }
      }]
      this.chartInstance.options.scales.yAxes = [{
        display: true,
        gridLines: {
          display:false
        },
        ticks: {
          maxTicksLimit: 1,
          min: chartData["min" + currentCurrency.toUpperCase()],
          max: chartData["max" + currentCurrency.toUpperCase()],
          mirror: true,
          // fontColor: "#fff",
          // fontSize: 18,
        }
      }]

      this.chartInstance.options.tooltips = {
        mode: 'x-axis',
        callbacks: {
          label: function(t, d) {
            return t.yLabel + " " + currentCurrency.toUpperCase()
          }
        }
      }

      this.chartInstance.update()
    }
  }

  async selectTimeRange(range){
    this.setState({
      selectedTimeRange: range,
      chartLoading: true
    }, async () => {
      await this.fetchChartData(this.props.address, this.props.ethereum, this.props.tokens)
    })
    
  }

  render() {
    return (
      <div className={"portfolio__performance portfolio__item theme__background-2 " + ("portfolio__performance" + (this.props.isOnMobile ? "__mobile" : "__desktop"))}>
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

        

        {this.state.chartData && this.state.chartData.isEmpty ? 
        <div className="portfolio__info">
          <div className="portfolio__info-text theme__text-7">
          -- % --
          </div>
          {/*<div className="portfolio__info-button">Start Now</div>*/}
        </div>
        :
        <Fragment>
          {this.state.chartLoading && <InlineLoading theme={this.props.theme}/>}
          <canvas className={"portfolio__performance-chart"} height="200" ref={this.props.performanceChart} />
        </Fragment>
        
        }
        
      </div>
    )
  }
}
