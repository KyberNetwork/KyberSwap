import React from "react"
import { connect } from "react-redux"

import ReactTable from 'react-table'
//import "react-table/react-table.css";
import { getTranslate } from 'react-localize-redux'
import * as actions from "../../actions/marketActions"
import * as converters from "../../utils/converter"

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
    item.market = key + ' / ' + currency
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
    var lineColor = ""
    var backgroundColor = ""
    if (props["original"]["change"] < 0) {
      lineColor = "#EB7576"
      backgroundColor = "#F6EAEC"
    } else {
      lineColor = "#1FDCAB"
      backgroundColor = "#EDFBF6"
    }
    var point = []
    var labels = []
    var input = props.value
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
    if (input < 0) {
      return (
        <span className = "negative">{input} %<img src={require("../../../assets/img/landing/arrow_red.svg")}/></span>
      )
    } else {
      return (
        <span className = "positive">{input} %<img src={require("../../../assets/img/landing/arrow_green.svg")}/></span>
      )
    }
  }
  formatNumber = (number) => {
    if (number > 1000) {
      return converters.formatNumber(number)
    }
    return number
  }

  addUnit = (input, currency) => {
    return (
      <span>{this.formatNumber(input)} {currency}</span>
    )
  }
  
  getSortHeader = (title) => {
    return (
      <div className="rt-th-img">
        <img src={require("../../../assets/img/landing/sort.svg")} />{title}
      </div>
    )
  }

  getColumn = () => {
    var columns = [{
      Header: this.getSortHeader("Market"),
      accessor: 'market' // String-based value accessors!
    }, {
      Header: this.getSortHeader("Sell Price"),
      accessor: 'sellPrice',
      Cell: props => this.addUnit(props.value, this.props.currency),
      minWidth: 150
    }, {
      Header: this.getSortHeader("Buy Price"), // Required because our accessor is not a string
      accessor: 'buyPrice',
      Cell: props => this.addUnit(props.value, this.props.currency),
      minWidth: 150
    }]
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
                Cell: props => this.drawChart(props),
                sortable: false,
                minWidth: 200
              })            
            }
            break
          }
          default: {
            switch (key) {
              case "change": {
                columns.push({
                  Header: this.getSortHeader(item.title),
                  accessor: key,
                  Cell: props => this.addClassChange(props.value),
                  minWidth: 200
                })
                break
              }
              case "volume": {
                columns.push({
                  Header: this.getSortHeader(item.title),
                  accessor: key,
                  Cell: props => this.addUnit(props.value, this.props.currency),
                  minWidth: 150
                })
                break
              }
              case "circulating_supply": {
                columns.push({
                  Header: this.getSortHeader(item.title),
                  accessor: key,
                  minWidth: 200
                })
                break
              }
              default: {
                columns.push({
                  Header: this.getSortHeader(item.title),
                  accessor: key,
                  minWidth: 150
                })
                break
              }
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
