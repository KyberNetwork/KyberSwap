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
  drawChart = (props) => {
    var input = props.value
    var lineColor = ""
    var backgroundColor = ""
    if (props["original"]["change"].includes("-")) {
      lineColor = "#EB7576"
      backgroundColor = "#F6EAEC"
    } else {
      lineColor = "#1FDCAB"
      backgroundColor = "#EDFBF6"
    }
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
        backgroundColor: backgroundColor,
        fill: true,
        borderColor: lineColor,
        borderWidth: 1.2
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
  addClassChange = (input) => {
    if (input.includes("-")) {
      return (
        <span className = "negative">{input}<img src={require("../../../assets/img/landing/arrow_red.svg")}/></span>
      )
    } else {
      return (
        <span className = "positive">{input}<img src={require("../../../assets/img/landing/arrow_green.svg")}/></span>
      )
    }
  }
  getColumn = () => {
    var columns = [{
      Header: 'Maket',
      accessor: 'market' // String-based value accessors!
    }, {
      Header: () => (
        <div className="rt-th-img">
          <img src={require("../../../assets/img/landing/sort.svg")} />Sell Price
        </div>
      ),
      accessor: 'sellPrice',
    }, {
      Header: () => (
        <div className="rt-th-img">
          <img src={require("../../../assets/img/landing/sort.svg")} />Buy Price
        </div>
      ), // Required because our accessor is not a string
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
                Cell: props => this.drawChart(props)
              })            
            }
            break
          }
          default: {
            if (key === "change") {
              columns.push({
                Header: () => (
                  <div className="rt-th-img">
                    <img src={require("../../../assets/img/landing/sort.svg")} />{item.title}
                  </div>
                ),
                accessor: key,
                Cell: props => this.addClassChange(props.value)
              })
            } else {
              columns.push({
                Header: item.title,
                accessor: key
              })
            }
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
