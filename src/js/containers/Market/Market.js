import React from "react"
import { connect } from "react-redux"

import { getTranslate } from 'react-localize-redux'
import { Currency, ManageColumn, MarketTable, SearchWord, SortColumn, TradingViewModal } from "../Market"
import * as marketActions from "../../actions/marketActions"
import { toEther } from "../../utils/converter";


@connect((store) => {

  var searchWord = store.market.configs.searchWord
  if (typeof searchWord === "undefined") searchWord = ""

  var currency = store.market.configs.currency.focus
  var page = store.market.configs.page
  var firstPageSize = store.market.configs.firstPageSize
  var pageSize = store.market.configs.normalPageSize
  var currencyList = firstPageSize + (page - 1) * pageSize
  var originalTokens = store.market.tokens
  var sortedTokens = store.market.sortedTokens
  var listTokens = []
  var sortKey = store.market.configs.sortKey
  var sortType = store.market.configs.sortType

  if (sortedTokens.length > 0) {
    listTokens = sortedTokens
  } else {
    Object.keys(originalTokens).forEach((key) => {
      if ((key !== "") && !key.toLowerCase().includes(searchWord.toLowerCase())) return
      listTokens.push(key)
    })
    // Object.keys(originalTokens).forEach((key) => {
    //   if ((key !== "") && !key.toLowerCase().includes(searchWord.toLowerCase()) || originalTokens[key].info.isNew) return
    //   listTokens.push(key)
    // })
    if (sortKey === 'market') {
      listTokens.sort(compareString(currency))
    } else if (sortKey != '') {
      listTokens.sort(compareNum(originalTokens, currency, sortKey))
    }
    
    if (sortType[sortKey] && sortType[sortKey] === '-sort-desc') {
      listTokens.reverse()
    }
  }

  function compareString(currency) {
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

  function compareNum(originalTokens, currency, sortKey) {
    return function(tokenA, tokenB) {
      return originalTokens[tokenA][currency][sortKey] - originalTokens[tokenB][currency][sortKey]
    }
  }

  var tokens = listTokens.slice(0, currencyList).reduce(function(newOb, key){
    newOb[key] = originalTokens[key]
    return newOb
  }, {})

  var data = []
  Object.keys(tokens).forEach((key) => {
    if (key === "ETH") return
    var item = tokens[key]
    item.market = key + ' / ' + currency
    item = { ...item, ...item[currency] }
    data.push(item)
  })

  return {
    translate: getTranslate(store.locale),
    listTokens: listTokens,
    data: data,
    currency: currency,
    tokens: tokens,
    page: page,
    firstPageSize: firstPageSize,
    currencyList: currencyList,
    // isDisabled: currencyList > listTokens.length || listTokens.length < firstPageSize,
    originalTokens: originalTokens,
    searchWord: searchWord,
    sortType: sortType
  }
})

export default class Market extends React.Component {
  getMoreData = () => {
    this.props.dispatch(marketActions.getMoreData(this.props.listTokens))
  }

  render() {
    return (
      <div className="market container" id="market-eth">
        <h1 className="market__title">{this.props.translate("market.eth_market") || "Ethereum Market"}</h1>
        <div className="market__header">
          <div className="market__header-left">
            <div className="market__header-search"><SearchWord /></div>
            <div className="market__header-currency"><Currency /></div>
          </div>
          <div className="market__header-right"><ManageColumn /></div>
        </div>
        <div className="market-table">
            <div>
              <MarketTable
                data = {this.props.data}
                currency = {this.props.currency}
                tokens = {this.props.tokens}
                listTokens = {this.props.listTokens}
                page = {this.props.page}
                firstPageSize = {this.props.firstPageSize}
                originalTokens = {this.props.originalTokens}
                searchWord = {this.props.searchWord}
                sortType = {this.props.sortType}
              />
            </div>
        </div>
        {/* <div className="show-more">
          <button className={this.props.isDisabled ? 'disabled' : ''} onClick={(e) => {if(!this.props.isDisabled) this.getMoreData(e)}}>
            {this.props.translate("market.show_more_results") || "Show more results"}
          </button>
        </div> */}
        <TradingViewModal />
      </div>
    )
  }
}