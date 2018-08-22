import React from "react"
import { connect } from "react-redux"

import ReactTable from 'react-table'
//import "react-table/react-table.css";
import { getTranslate } from 'react-localize-redux'
import * as actions from "../../actions/marketActions"
import * as converters from "../../utils/converter"

//import LineChart from 'react-linechart';
import {Line} from 'react-chartjs-2';
import * as analytics from "../../utils/analytics"
//import '../node_modules/react-linechart/dist/styles.css';


@connect((store, props) => {
  var data = props.data
  var listTokens = props.listTokens
  var currency = props.currency
  var tokens = props.tokens
  var page = props.page
  var firstPageSize = props.firstPageSize
  var sortType = props.sortType

  var numScroll = store.market.configs.numScroll

  return {
    translate: getTranslate(store.locale),
    currency,
    sort: store.market.configs.sort.focus,
    displayColumn: store.market.configs.column.display.active,
    showActive: store.market.configs.column.shows.active,
    listShowColumn: store.market.configs.column.shows.listItem,
    data: data,
    tokens: tokens,
    isLoading: store.market.configs.isLoading,
    listTokens: listTokens,
    numScroll: numScroll,
    page: page,
    firstPageSize: firstPageSize,
    sortType: sortType
  }
})

export default class MarketTable extends React.Component {

  getMoreData = () => {
    this.props.dispatch(actions.getMoreData(this.props.listTokens))
  }

  handleScroll = () => {
    if (this.props.listTokens.length > this.props.firstPageSize && !this.props.isLoading && this.props.page - 1 < this.props.numScroll) {
      var market = document.getElementById("market-eth")
      if ((window.innerHeight + window.scrollY) >= market.offsetHeight) {
        this.getMoreData()
      }
      // var scrollTop   = window.scrollY,
      //   elementOffset = market.offsetTop,
      //   elementHeight = market.clientHeight,
      //   windowH       = window.innerHeight,
      //   distance      = (elementHeight + elementOffset - scrollTop - windowH);
      //   if (distance <= 250) {
      //     this.getMoreData()
      //   }
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll)
  }

  drawChart = (props) => {
    var lineColor = ""
    var backgroundColor = ""
    if (props["original"]["change"] < 0) {
      lineColor = "#EB7576"
      backgroundColor = "#F6EAEC"
    } else if (props["original"]["change"] === 0) {
      lineColor = "#767677"
      backgroundColor = "#eee"
    } else {
      lineColor = "#1FDCAB"
      backgroundColor = "#EDFBF6"
    }
    var point = []
    var labels = []
    var input = props.value
    var dataLength = 28

    if (Array.isArray(input)) {
      if (input.length === 29) {
        input.shift()
      }
      var addLength = 0
      var inputLength = input.length
      if (inputLength < dataLength) {
        addLength = dataLength - inputLength
        for (let index = 0; index < addLength; index++) {
          point.push(0)
          labels.push(index)
        }
      }
      var maxValue = input[0]
      input.map((item, index) => {
        labels.push(index + addLength)
        point.push(item)
        if (item > maxValue) {
          maxValue = item
        }
      })

      var yOption = {
        display: false,
        gridLines: {
          display:false
        },
        ticks: {
          max: maxValue * 1.1
        }
      }

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
    } else {
      return (
        <div></div>
      )
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
        yAxes: [yOption]
      }
    } 
    return (
      <Line 
        width={200}
        height={70}
        data={data}
        options={options}
        hideXAxis = {true}
        hideYAxis = {true}
        hidePoints = {true}
  		/>
    )
  }
  addClassChange = (input) => {
    if (input === -9999){
      return (
        <span>---</span>
      )
    }
    if (input < 0) {
      return (
        <span className = "negative">{input} %<img src={require("../../../assets/img/landing/arrow_red.svg")}/></span>
      )
    }
    if (input === 0){
      return (
        <span>{input} %</span>
      )
    }
    if (input > 0){
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
      <div className="symbol-price">
        <span className="value">{input === 0 ? "---" : this.formatNumber(input)}</span>
        <span className="unit">{input === 0 ? '' : currency}</span>
      </div>
    )
  }

  getTranslateFromKey = (key) => {
    switch (key) {
      case "market": {
        return "market.market"
      }
      case "sell_price": {
        return "market.sell_price"
      }
      case "buy_price": {
        return "market.buy_price"
      }
      case "last_7d": {
        return "market.last_7d"
      }
      case "change": {
        return "market.change"
      }
      case "circulating_supply": {
        return "market.circulating_supply"
      }
      case "total_supply": {
        return "market.total_supply"
      }
      case "market_cap": {
        return "market.market_cap"
      }
      case "volume": {
        return "market.volume"
      }
    }
  }
  
  getSortHeader = (title, key) => {
    return (
      <div className="rt-th-img">
        <img src={require("../../../assets/img/landing/sort.svg")} />{this.props.translate(this.getTranslateFromKey(key)) || title}
      </div>
    )
  }

  addIcon = (input) => {
    var tokenPair = input.split(" / ")
    var key = tokenPair[0]
    return (
      <div className="token-pair">
        <img src={require("../../../assets/img/tokens/" + this.props.tokens[key].info.icon)} />
        {input}
        {this.props.tokens[key].info.isNew ? <div className="new-token">{this.props.translate("market.new_token" || "NEW")}</div>:""}
      </div>
    )
  }

  compareString(currency) {
    return function(tokenA, tokenB) {
      var marketA = tokenA + currency
      var marketB = tokenB + currency
      if (marketA < marketB)
        return -1;
      if (marketA > marketB)
        return 1;
      return 0;
    }
  }

  compareNum(originalTokens, currency, sortKey) {
    return function(tokenA, tokenB) {
      return originalTokens[tokenA][currency][sortKey] - originalTokens[tokenB][currency][sortKey]
    }
  }

  getSortArray = (sortKey, sortType) => {
    var listTokens = this.props.listTokens
    var searchWord = this.props.searchWord
    if (sortKey === 'market') {
      listTokens.sort(this.compareString(this.props.currency))
    } else if (sortKey != '') {
       listTokens.sort(this.compareNum(this.props.originalTokens, this.props.currency, sortKey))
    }
    
    var sortedTokens = []
    listTokens.forEach((key) => {
      if (key === 'ETH') return
      if ((key !== "") && !key.toLowerCase().includes(searchWord.toLowerCase())) return
      sortedTokens.push(key)
    })
    
    if (sortType === '-sort-desc') {
      sortedTokens.reverse()
      this.props.dispatch(actions.updateSortedTokens(sortedTokens))
    } else if (sortType === '-sort-asc') {
      this.props.dispatch(actions.updateSortedTokens(sortedTokens))
    }
  }

  updateSortState = (key, sortType) => {
    this.props.dispatch(actions.updateSortState(key, sortType))
    analytics.trackSortETHMarket(key, sortType)
  }

  getSortType = (key) => {
    var sortType = this.props.sortType
    var newSortType = ''
    if (key !== 'market') {
      if ((sortType[key] && sortType[key] === '-sort-asc') || !sortType[key]) {
        newSortType = '-sort-desc'
      } else {
        newSortType = '-sort-asc'
      }
    } else if (key != '') {
      if ((sortType[key] && sortType[key] === '-sort-desc') || !sortType[key]) {
        newSortType = '-sort-asc'
      } else {
        newSortType = '-sort-desc'
      }
    }
    return newSortType
  }

  getColumn = () => {
    var columns = [{
      Header: this.getSortHeader("Market", "market"),
      accessor: 'market', // String-based value accessors!
      Cell: props => this.addIcon(props.value),
      minWidth: 175,
      getHeaderProps: () => {
        return {
          className: this.props.sortType['market'] ?  (this.props.sortType['market'] + ' -cursor-pointer') :'-cursor-pointer',
          onClick: (e) => {
            this.getSortArray('market', this.getSortType('market'))
            this.updateSortState('market', this.getSortType('market'))
          }
        }
      }
    }, {
      Header: this.getSortHeader("Sell Price", "sell_price"),
      accessor: 'sellPrice',
      Cell: props => this.addUnit(props.value, this.props.currency),
      minWidth: 150,
      getHeaderProps: () => {
        return {
          className: this.props.sortType["sellPrice"] ?  (this.props.sortType["sellPrice"] + ' -cursor-pointer') :'-cursor-pointer',
          onClick: (e) => {
            this.getSortArray("sellPrice", this.getSortType("sellPrice"))
            this.updateSortState("sellPrice", this.getSortType("sellPrice"))
          }
        }
      }
    }, {
      Header: this.getSortHeader("Buy Price", "buy_price"), // Required because our accessor is not a string
      accessor: 'buyPrice',
      Cell: props => this.addUnit(props.value, this.props.currency),
      minWidth: 150,
      getHeaderProps: () => {
        return {
          className: this.props.sortType["buyPrice"] ?  (this.props.sortType["buyPrice"] + ' -cursor-pointer') :'-cursor-pointer',
          onClick: (e) => {
            this.getSortArray("buyPrice", this.getSortType("buyPrice"))
            this.updateSortState("buyPrice", this.getSortType("buyPrice"))
          }
        }
      }
    }]
    Object.keys(this.props.listShowColumn).map((key, i) => {
      var item = this.props.listShowColumn[key]
      var index = this.props.showActive.indexOf(key)
      if (index !== -1) {
        switch (item.type){
          case "chart":{
            if (this.props.currency != "USD") {
              columns.push({
                Header: this.props.translate(this.getTranslateFromKey(key)) || item.title,
                accessor: key,
                Cell: props => this.drawChart(props),
                sortable: false,
                maxWidth: 200,
                minWidth: 150,
                height: 70
              })            
            }
            break
          }
          default: {
            switch (key) {
              case "change": {
                columns.push({
                  Header: this.getSortHeader(item.title, key),
                  accessor: key,
                  Cell: props => this.addClassChange(props.value),
                  minWidth: 200,
                  getHeaderProps: () => {
                    return {
                      className: this.props.sortType[key] ?  (this.props.sortType[key] + ' -cursor-pointer') :'-cursor-pointer',
                      onClick: (e) => {
                        this.getSortArray(key, this.getSortType(key))
                        this.updateSortState(key, this.getSortType(key))
                      }
                    }
                  }
                })
                break
              }
              case "circulating_supply":{
                columns.push({
                  Header: this.getSortHeader(item.title, key),
                  accessor: key,
                  Cell: props => this.formatNumber(props.value),
                  minWidth: 200
                })
                break
              }
              case "total_supply":{
                columns.push({
                  Header: this.getSortHeader(item.title, key),
                  accessor: key,
                  Cell: props => this.formatNumber(props.value),
                  minWidth: 150
                })
                break
              }
              case "market_cap":{
                columns.push({
                  Header: this.getSortHeader(item.title, key),
                  accessor: key,
                  Cell: props => this.addUnit(props.value, this.props.currency),
                  minWidth: 150,
                  getHeaderProps: () => {
                    return {
                      className: this.props.sortType[key] ?  (this.props.sortType[key] + ' -cursor-pointer') :'-cursor-pointer',
                      onClick: (e) => {
                        this.getSortArray(key, this.getSortType(key))
                        this.updateSortState(key, this.getSortType(key))
                      }
                    }
                  }
                })
                break
              }
              case "volume": {
                columns.push({
                  Header: this.getSortHeader(item.title, key),
                  accessor: key,
                  Cell: props => this.addUnit(props.value, this.props.currency),
                  minWidth: 150,
                  getHeaderProps: () => {
                    return {
                      className: this.props.sortType[key] ?  (this.props.sortType[key] + ' -cursor-pointer') :'-cursor-pointer',
                      onClick: (e) => {
                        this.getSortArray(key, this.getSortType(key))
                        this.updateSortState(key, this.getSortType(key))
                      }
                    }
                  }
                })
                break
              }
              case "circulating_supply": {
                columns.push({
                  Header: this.getSortHeader(item.title, key),
                  accessor: key,
                  minWidth: 200
                })
                break
              }
              default: {
                columns.push({
                  Header: this.getSortHeader(item.title, key),
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
        showPagination = {false}
        pageSize = {this.props.data.length}
        minRows = {1}
        getTrProps={(state, rowInfo) => {
          return {
            onClick: (e) => {
              var symbol = rowInfo.original.info.symbol
              this.props.dispatch(actions.showTradingViewChart(symbol))
              analytics.tokenForCharting(symbol)
            }
          }
        }
        }
        getPaginationProps={() => {
          return {
            previousText: (<img src={require("../../../assets/img/market/arrow-left.png")} />),
            nextText:  (<img src={require("../../../assets/img/market/arrow-right.svg")} />)
          }
        }
        }
        getNoDataProps={(state, rowInfo) => {
          if(this.props.data.length==0) return { style: { border: 'none' ,top:'75%',padding:'0px'} };
          return {};
          }
        }
        sortable={false}
      />
    )
  }
}
