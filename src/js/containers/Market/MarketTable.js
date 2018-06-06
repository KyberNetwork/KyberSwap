import React from "react"
import { connect } from "react-redux"

import ReactTable from 'react-table'
//import "react-table/react-table.css";
import { getTranslate } from 'react-localize-redux'
import * as actions from "../../actions/marketActions"

import LineChart from 'react-linechart';
import {Line} from 'react-chartjs-2';
//import '../node_modules/react-linechart/dist/styles.css';


@connect((store) => {
  var searchWord = store.market.configs.searchWord
  var currency = store.market.configs.currency.focus
  var tokens = store.market.tokens
  var data = []
  Object.keys(tokens).forEach((key) => {
    if (key === "ETH") return
    if ((key !== "") && !key.toLowerCase().includes(searchWord.toLowerCase())) return

    var item = tokens[key]
    item.market = (
      <div>
        {key} / {currency}
      </div>
    )
    item = { ...item, ...item[currency] }
    data.push(item)
  })
  return {
    translate: getTranslate(store.locale),
    searchWord,
    currency,
    sort: store.market.configs.sort.focus,
    displayColumn: store.market.configs.column.display.active,
    showActive: store.market.configs.column.shows.active,
    listShowColumn: store.market.configs.column.shows.listItem,
    data: data
  }
})

export default class MarketTable extends React.Component {
  drawChart = (input) => {
    var point = []
    var labels = []
    input.map((item, index) => {
      labels.push(index)
      point.push(item)
    })

    var data = {
      labels: labels,
      datasets: [{
        data: point,
        backgroundColor: "#F5FAFF",
        fill: true,
        borderColor: "rgb(18, 149, 229)",
        borderWidth: 1.5
      }]
    }
    var options = {
      elements: {
        point: {
          radius: 0
        }
      },
      legend: {
        display: false
      },
      scales: { 
        xAxes: [{ 
          display: false,
          gridLines: {
            display:false
          }
        }],
        yAxes: [{
          display: false,
          gridLines: {
            display:false
          }
        }]
      }
    } 
    return (
      <Line 
        width={225}
        height={75}
        data={data}
        options={options}
        hideXAxis = {true}
        hideYAxis = {true}
        hidePoints = {true}
  		/>
    )
  }
  getColumn = () => {
    var columns = [{
      Header: 'Maket',
      accessor: 'market' // String-based value accessors!
    }, {
      Header: 'Sell price',
      accessor: 'sellPrice',
    }, {
      Header: 'Buy price', // Required because our accessor is not a string
      accessor: 'buyPrice',
    }
    ]
    Object.keys(this.props.listShowColumn).map((key, i) => {
      var item = this.props.listShowColumn[key]
      var index = this.props.showActive.indexOf(key)
      if (index !== -1) {
        switch (item.type){
          case "chart":{
            if (this.props.currency != "USD") {
              columns.push({
                Header: item.title,
                accessor: key,
                Cell: props => this.drawChart(props.value)
              })            
            }
            break
          }
          default: {
            columns.push({
              Header: item.title,
              accessor: key
            })
            break
          }
        }
        
      }
    })
    return columns
  }


  render() {
    const columns = this.getColumn()

    return (
      <ReactTable
        data={this.props.data}
        columns={columns}
        getTrProps={(state, rowInfo) => {
          return {
            onClick: (e) => {
              var symbol = rowInfo.original.info.symbol
              this.props.dispatch(actions.showTradingViewChart(symbol))
            }
          }
        }
        }
      />
    )
  }
}