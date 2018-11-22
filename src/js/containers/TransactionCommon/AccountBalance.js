import React from "react"
import { connect } from "react-redux"
import { AccountBalanceLayout } from '../../components/Exchange'
import {acceptTermOfService} from "../../actions/globalActions"
import * as analytics from "../../utils/analytics"
import { getTranslate } from 'react-localize-redux';

@connect((store, props) => {
  var location = store.router.location.pathname

  return {
    tokens: store.tokens.tokens,
    translate: getTranslate(store.locale),
    ethereum: store.connection.ethereum,
    showBalance: store.global.showBalance,    
    location,
    walletType: store.account.account.type,
    account: store.account.account,
    address: store.account.account.address,
    chooseToken: props.chooseToken,
    sourceActive: props.sourceActive
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
      sortActive: false,
    }
  }

  componentDidMount() {
    if (window.innerWidth < 640) {
      this.setState({isBalanceActive: false})
    }
  }

  acceptTerm = () => {
    this.props.dispatch(acceptTermOfService())
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

  toggleBalanceContent = () => {
    this.props.onToggleBalanceContent()    
  }

  render() {
    var sortValue = this.state.sortType === "Price" ? this.state.sortValuePrice_DES : this.state.sortValueSymbol_DES;

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
        showSort = {this.showSort}
        hideSort = {this.hideSort}
        sortActive = {this.state.sortActive}
        sortSymbol = {this.sortSymbol}
        sortPrice = {this.sortPrice}
        sortType = {this.state.sortType}
        sortValue = {sortValue}
        isBalanceActive={this.props.isBalanceActive}
        toggleBalanceContent={this.toggleBalanceContent}
        account={this.props.account}
        sourceTokenSymbol={this.props.sourceActive}
        destTokenSymbol={this.props.destTokenSymbol}
        onToggleBalanceContent={this.onToggleBalanceContent}
        // acceptTerm = {this.acceptTerm}
        tradeType = {this.props.tradeType}
      />
    )
  }
}