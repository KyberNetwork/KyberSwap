import React from "react"
import { connect } from "react-redux"
import { AccountBalanceLayout } from '../../components/Exchange';
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
      isBalanceActive: true
    }
  }

  componentDidMount() {
    if (window.innerWidth < 640) {
      this.setState({isBalanceActive: false})
    }
  }

  changeSearchBalance = (e) => {
    var value = e.target.value
    this.setState({searchWord:value})
  }

  selectToken = (e, symbol, address) => {
    this.props.chooseToken(symbol, address, "source")
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
  }

  sortPrice = (e) =>{
    this.setState({sortType: "Price", sortValuePrice_DES: !this.state.sortValuePrice_DES})
    this.hideSort()
  }

  toggleBalanceContent = () => {
    this.setState({ isBalanceActive: !this.state.isBalanceActive });
  }

  render() {
    var sortValue = this.state.sortType === "Price" ? this.state.sortValuePrice_DES : this.state.sortValueSymbol_DES;

    return (
      <AccountBalanceLayout
        tokens={this.props.tokens}
        translate={this.props.translate}
        sourceActive={this.props.sourceActive}
        selectToken={this.selectToken}
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
        isBalanceActive={this.state.isBalanceActive}
        toggleBalanceContent={this.toggleBalanceContent}
        account={this.props.account}
        sourceTokenSymbol={this.props.sourceActive}
        destTokenSymbol={this.props.destTokenSymbol}
        isChartActive={this.props.isChartActive}
        chartTimeRange={this.props.chartTimeRange}
        onChangeChartRange={this.props.onChangeChartRange}
        onToggleChartContent={this.props.onToggleChartContent}
      />
    )
  }
}
