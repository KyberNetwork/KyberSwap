import React from "react"
import Chart from "chart.js";

export default class PortfolioPerformance extends React.Component {
  componentDidMount() {
    new Chart(this.props.performanceChart.current, {
      type: 'line',
      data: {
        labels: ["Nov 19", "Nov 20", "Nov 21", "Nov 22", "Nov 23", "Nov 24", "Nov 25"],
        datasets: [{
          data: [0, 59, 75, 20, 20, 55, 40],
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
  
  render() {
    return (
      <div className={"portfolio__performance portfolio__item theme__background-2"}>
        <div className={"portfolio__title"}>Portfolio Performance</div>
        <canvas className={"portfolio__performance-chart"} height="200" ref={this.props.performanceChart}/>
      </div>
    )
  }
}
