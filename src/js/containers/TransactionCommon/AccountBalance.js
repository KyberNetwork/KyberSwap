import React from "react"
import { connect } from "react-redux"
import BLOCKCHAIN_INFO from "../../../../env"
import { AccountBalanceLayout } from '../../components/Exchange'
import {acceptTermOfService} from "../../actions/globalActions"
import { getTranslate } from 'react-localize-redux';

@connect((store, props) => {
  var location = store.router.location.pathname
  var sourceActive = 'ETH'
  sourceActive = store.exchange.sourceTokenSymbol
  var isFixedSourceToken = !!(store.account && store.account.account.type ==="promo" && store.tokens.tokens[BLOCKCHAIN_INFO.promo_token])  
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
    sourceActive: props.sourceActive,
    isFixedSourceToken: isFixedSourceToken,
    analytics: store.global.analytics,
    walletName: props.walletName,
    isOnDAPP: props.isOnDAPP
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
    this.props.analytics.callTrack("trackSearchTokenBalanceBoard");
  }

  selectToken = (e, symbol, address) => {
    if (this.props.isFixedSourceToken) return
    this.props.chooseToken(symbol, address, "source")
    this.props.analytics.callTrack("trackChooseTokenOnBalanceBoard", symbol);
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
    this.props.analytics.callTrack("trackClickSortBalanceBoard", "Symbol", this.state.sortValueSymbol_DES ? "DESC" : "ASC");
  }

  sortPrice = (e) =>{
    this.setState({sortType: "Price", sortValuePrice_DES: !this.state.sortValuePrice_DES})
    this.hideSort()
    this.props.analytics.callTrack("trackClickSortBalanceBoard", "Price", this.state.sortValuePrice_DES ? "DESC" : "ASC");
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
        tradeType = {this.props.tradeType}
        isFixedSourceToken = {this.props.isFixedSourceToken}
        analytics={this.props.analytics}
        walletName={this.props.walletName}
        isOnDAPP = {this.props.isOnDAPP}
      />
    )
  }
}
