import React from "react"
import Chart from "chart.js";
import { MINIMUM_DISPLAY_BALANCE } from "../../services/constants";

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
      if (token.balanceInETH < MINIMUM_DISPLAY_BALANCE) return;
  
      let tokenSymbol = token.symbol;
      let tokenValue = +((token.balanceInETH / this.props.totalBalanceInETH) * 100).toFixed(2);
      
      if (index >= tokenDisplay) {
        tokenValue = tokenValues[tokenDisplay] ? tokenValues[tokenDisplay] + tokenValue : tokenValue;
        tokenValue = +(tokenValue).toFixed(2);
        tokenSymbols[tokenDisplay] = `Others - ${tokenValue}%`;
        tokenValues[tokenDisplay] = tokenValue;
      } else {
        tokenSymbols.push(`${tokenSymbol} - ${tokenValue}%`);
        tokenValues.push(tokenValue);
      }
    });
    
    this.chart = new Chart(this.props.equityChart.current, {
      type: 'pie',
      data: {
        labels: tokenSymbols,
        datasets: [{
          data: tokenValues,
          backgroundColor: ['#fb497c', '#ffc760', '#67c22b', '#4fccff', '#4d7bf3', '#214e9f'],
          borderColor: 'transparent'
        }]
      },
      options: {
        legend: {
          position: 'right',
          labels: {
            fontColor: `${this.props.theme === 'dark' ? 'white' : 'black'}`,
            fontStyle: '400',
            fontSize: 11
          }
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              return data.labels[tooltipItem.index];
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
      <canvas width="300" height="150" ref={this.props.equityChart}/>
    )
  }
}
