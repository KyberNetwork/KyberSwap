import React from "react"
import Chart from "chart.js";

export default class PortfolioEquity extends React.Component {
  componentDidMount() {
    new Chart(this.props.equityChart.current, {
      type: 'pie',
      data: {
        labels: ['ETH', 'DAI', 'KNC', 'WAX', 'OMG', 'Other'],
        datasets: [{
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: ['#fb497c', '#ffc760', '#67c22b', '#4fccff', '#4d7bf3', '#214e9f']
        }]
      },
      options: {
        legend: {
          position: 'right',
          labels: {
            fontStyle: '400'
          }
        },
        responsive: false
      }
    });
  }
  
  render() {
    return (
      <div className={"portfolio__equity portfolio__item theme__background-2"}>
        <canvas width="250" height="200" ref={this.props.equityChart}/>
      </div>
    )
  }
}
