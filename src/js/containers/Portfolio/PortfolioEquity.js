import React from "react"
import Chart from "chart.js";

export default class PortfolioEquity extends React.Component {
  constructor(props) {
    super(props);
    this.chart = null;
  }
  
  componentDidMount() {
    const tokenSymbols = [];
    const tokenValues = [];
    const tokenDisplay = 5;
    
    this.props.availableTokens.forEach((token, index) => {
      if (token.balanceInETH === '0') return;
  
      let tokenSymbol = token.symbol;
      let tokenValue = +((token.balanceInETH / this.props.totalBalanceInETH) * 100).toFixed(2);
      
      if (index >= tokenDisplay) {
        tokenSymbols[tokenDisplay] = 'Others';
        tokenValues[tokenDisplay] = tokenValues[tokenDisplay] ? tokenValues[tokenDisplay] + tokenValue : tokenValue;
      } else {
        tokenSymbols.push(tokenSymbol);
        tokenValues.push(tokenValue);
      }
    });
    
    this.chart = new Chart(this.props.equityChart.current, {
      type: 'pie',
      data: {
        labels: tokenSymbols,
        datasets: [{
          data: tokenValues,
          backgroundColor: ['#fb497c', '#ffc760', '#67c22b', '#4fccff', '#4d7bf3', '#214e9f']
        }]
      },
      options: {
        legend: {
          position: 'right',
          labels: {
            fontColor: `${this.props.theme === 'dark' ? 'white' : 'black'}`,
            fontStyle: '400'
          }
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              return data.labels[tooltipItem.index] + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%';
            }
          }
        },
        responsive: false
      }
    });
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.theme !== prevProps.theme) {
      if (this.props.theme === 'dark') {
        this.chart.options.legend.labels.fontColor = 'white';
      } else {
        this.chart.options.legend.labels.fontColor = 'black';
      }
  
      this.chart.update();
    }
  }
  
  render() {
    return (
      <canvas width="250" height="150" ref={this.props.equityChart}/>
    )
  }
}
