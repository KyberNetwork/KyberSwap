import React from "react"
import { connect } from "react-redux"

import { AccountBalanceLayout } from '../../components/Exchange'
// import { selectTokenAsync } from '../../actions/exchangeActions'
// import { selectToken } from '../../actions/transferActions'
// import { hideSelectToken } from "../../actions/utilActions"
import * as analytics from "../../utils/analytics"

import { getTranslate } from 'react-localize-redux';

@connect((store, props) => {
  var location = store.router.location.pathname
  var sourceActive = 'ETH'
  sourceActive = store.exchange.sourceTokenSymbol
  return {
    tokens: store.tokens.tokens,
    translate: getTranslate(store.locale),
    ethereum: store.connection.ethereum,
    showBalance: store.global.showBalance,
    sourceActive,
    location,
    walletType: store.account.account.type,
    address: store.account.account.address,
    chooseToken: props.chooseToken,
  }
})

export default class AccountBalance extends React.Component {

  constructor(){
    super()
    this.state = {
      searchWord: "",
      sortValueSymbol_DES:  false,
      sortValuePrice_DES:  true,
      sortType: 'Price',
      sortActive: false
    }
  }
  changeSearchBalance = (e) => {
    var value = e.target.value
    this.setState({searchWord:value})
  }

  clickOnInput = (e) => {
    analytics.trackSearchTokenBalanceBoard()
  }

  selectToken = (e, symbol, address) => {
    this.props.chooseToken(symbol, address, "source")
    analytics.trackChooseTokenOnBalanceBoard(symbol)
  }

  showSort = (e) =>{
    this.setState({sortActive: true})
  }
  hideSort = (e) =>{
    this.setState({sortActive: false})
  }

  sortSymbol = (e) =>{
    this.setState({sortType: "Symbol", sortValueSymbol_DES: !this.state.sortValueSymbol_DES})
    this.hideSort()
    analytics.trackClickSortBalanceBoard("Symbol", this.state.sortValueSymbol_DES ? "DESC" : "ASC")
  }

  sortPrice = (e) =>{
    this.setState({sortType: "Price", sortValuePrice_DES: !this.state.sortValuePrice_DES})
    this.hideSort()
    analytics.trackClickSortBalanceBoard("Price", this.state.sortValuePrice_DES ? "DESC" : "ASC")
  }

  

  render() {
    var sortValue = this.state.sortType === "Price" ? this.state.sortValuePrice_DES : this.state.sortValueSymbol_DES
    return (
      <AccountBalanceLayout
        tokens={this.props.tokens}
        translate={this.props.translate}
        sourceActive={this.props.sourceActive}
        selectToken={this.selectToken}
        clickOnInput={this.clickOnInput}
        showBalance = {this.props.showBalance}
        changeSearchBalance = {this.changeSearchBalance}
        searchWord = {this.state.searchWord}
        walletType = {this.props.walletType}
        address = {this.props.address}

        showSort = {this.showSort}
        hideSort = {this.hideSort}
        sortActive = {this.state.sortActive}

        sortSymbol = {this.sortSymbol}
        sortPrice = {this.sortPrice}
        sortType = {this.state.sortType}
        sortValue = {sortValue}
      />
    )
  }
}

