import React from "react"
import { connect } from "react-redux"

import ReactTable from 'react-table'
//import "react-table/react-table.css";
import { getTranslate } from 'react-localize-redux'
import * as actions from "../../actions/marketActions"



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
        <div>
          <img src={require("../../../assets/img/tokens/" + tokens[key].info.icon)} />
        </div>
        <div>{key} / {currency}</div>
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
      var index = this.props.showActive.indexOf(key)
      if (index !== -1) {
        columns.push({
          Header: this.props.listShowColumn[key],
          accessor: key
        })
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