import React from "react"
import { connect } from "react-redux"

import { AccountBalanceLayout } from '../../components/Exchange'
import {acceptTermOfService} from "../../actions/globalActions"
// import { selectToken } from '../../actions/transferActions'
// import { hideSelectToken } from "../../actions/utilActions"
import * as analytics from "../../utils/analytics"
// import {openImportAccount as openImportAccountExchange} from "../../actions/exchangeActions"
import {changeWallet} from "../../actions/globalActions"

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
     // isBalanceActive: true
    }
  }

  componentDidMount() {
    if (window.innerWidth < 640) {
      this.setState({isBalanceActive: false})
    }
    // if(this.props.isChartActive){
    //   this.setState({ isBalanceActive: false });      
    // }else{
    //   this.setState({ isBalanceActive: true });            
    // }
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
    if (this.props.isBalanceActive){
      this.props.onToggleChartContent(true)          
    }else{
      this.props.onToggleChartContent(false)                
    }
    this.props.onToggleBalanceContent()    
  }

  onToggleChartContent = () => {
    if (this.props.isChartActive){
      this.props.onToggleBalanceContent(true)          
    }else{
      this.props.onToggleBalanceContent(false)                
    }
    this.props.onToggleChartContent()    
  }

  // handleEndSession = () => {
  //   this.props.dispatch(openImportAccountExchange())
  // }

  changeWallet = (tradeType) => {
    this.props.dispatch(changeWallet(tradeType))
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
        isChartActive={this.props.isChartActive}
        chartTimeRange={this.props.chartTimeRange}
        onChangeChartRange={this.props.onChangeChartRange}
        onToggleChartContent={this.onToggleChartContent}
        onToggleBalanceContent={this.onToggleBalanceContent}

        acceptTerm = {this.acceptTerm}
        tradeType = {this.props.tradeType}
        changeWallet = {this.changeWallet}
      />
    )
  }
}
