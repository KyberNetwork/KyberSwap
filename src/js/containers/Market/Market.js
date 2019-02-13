import React from "react"
import { connect } from "react-redux"

import { getTranslate } from 'react-localize-redux'
import { Currency, ManageColumn, MarketTable, SearchWord, SortColumn, TradingViewModal, RateSliderV2 } from "../Market"
import * as marketActions from "../../actions/marketActions"
import { toEther } from "../../utils/converter";
import * as analytics from "../../utils/analytics"
import { Modal } from "../../components/CommonElement"

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
    return function (tokenA, tokenB) {
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
    return function (tokenA, tokenB) {
      return originalTokens[tokenA][currency][sortKey] - originalTokens[tokenB][currency][sortKey]
    }
  }

  var tokens = listTokens.slice(0, currencyList).reduce(function (newOb, key) {
    newOb[key] = originalTokens[key]
    return newOb
  }, {})

  var data = []
  Object.keys(tokens).forEach((key) => {
    // if (key === "ETH" || key === "WETH") return
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
    originalTokens: originalTokens,
    searchWord: searchWord,
    sortType: sortType,
    showSearchInput: store.market.configs.showSearchInput,
    global: store.global
  }
})

export default class Market extends React.Component {
  constructor() {
    super()
    this.state = {
      modalState: false
    }
  }

  componentDidMount = () => {
    if (window.kyberBus) {
      window.kyberBus.on("swap.open.market", this.setShowMarket.bind(this));
    }
  }

  setShowMarket = () => {
    this.setState({ modalState: true })
  }

  getMoreData = () => {
    this.props.dispatch(marketActions.getMoreData(this.props.listTokens))
  }

  changeSearch = (e) => {
    var value = e.target.value
    this.props.dispatch(marketActions.changeSearchWord(value))
    this.props.dispatch(marketActions.resetListToken(value))
  }

  getContentMarket = () => {
    return (
      <div className="market container" id="market-eth">
        <a className="x" onClick={this.closeModal}>&times;</a>
        <h1 className="market__title">{this.props.translate("market.eth_market") || "Ethereum Market"}</h1>
        <div className="market-table">
          <div>
            <MarketTable
              data={this.props.data}
              currency={this.props.currency}
              tokens={this.props.tokens}
              listTokens={this.props.listTokens}
              page={this.props.page}
              firstPageSize={this.props.firstPageSize}
              originalTokens={this.props.originalTokens}
              searchWord={this.props.searchWord}
              sortType={this.props.sortType}
              manageColumn={<ManageColumn />}
              searchWordLayout={<SearchWord />}
              currencyLayout={<Currency currentCurrency={this.props.currency} />}
            />
          </div>
        </div>
        <TradingViewModal />
      </div>
    )
  }

  closeModal = () => {
    this.setState({ modalState: false })
    this.props.global.analytics.callTrack("trackClickCloseMarket")
  }
  openModal = () => {
    this.setState({ modalState: true })
    this.props.global.analytics.callTrack("trackClickOpenMarket")
  }

  render() {
    return (
      <div className="market-wrapper-container">
        {!this.props.global.isOnMobile && (
          <div className="rate-container">
            <div className="rate-container__slider">
              <RateSliderV2 />
            </div>
            <div className="rate-container__more">
              <a onClick={this.openModal}>{this.props.translate("market.more") || "More"}</a>
            </div>
          </div>

        )}
        <Modal className={{
          base: 'reveal large confirm-modal market-modal',
          afterOpen: 'reveal large confirm-modal'
        }}
          overlayClassName={"market-modal-scroll"}
          isOpen={this.state.modalState}
          onRequestClose={this.closeModal}
          contentLabel="Market modal"
          content={this.getContentMarket()}
          size="large"
        />
      </div>


    )
  }
}
