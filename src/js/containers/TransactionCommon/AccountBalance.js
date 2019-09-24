import React from "react"
import { connect } from "react-redux"
import BLOCKCHAIN_INFO from "../../../../env"
import { AccountBalanceLayout } from '../../components/Exchange'
import {acceptTermOfService} from "../../actions/globalActions"
import { getTranslate } from 'react-localize-redux';
import * as converters from "../../utils/converter"


@connect((store, props) => {
  // var location = store.router.location.pathname
  var sourceActive = 'ETH'
  sourceActive = store.exchange.sourceTokenSymbol
  var isFixedSourceToken = !!(store.account && store.account.account.type ==="promo" && store.tokens.tokens[BLOCKCHAIN_INFO.promo_token])  
  return {
    tokens: store.tokens.tokens,
    exchange: store.exchange,    
    transfer: store.transfer,
    translate: getTranslate(store.locale),
    ethereum: store.connection.ethereum,
    showBalance: store.global.showBalance,
    // location,
    walletType: store.account.account.type,
    account: store.account.account,
    address: store.account.account.address,
    chooseToken: props.chooseToken,
    sourceActive: props.sourceActive,
    isFixedSourceToken: isFixedSourceToken,
    global: store.global,
    walletName: props.walletName,
    isOnDAPP: props.isOnDAPP,
    limitOrder : store.limitOrder
  }
})

export default class AccountBalance extends React.Component {
  constructor(){
    super()
    this.state = {
      searchWord: "",
      sortActive: false,
      sortValueSymbol_DES:  false,
      sortValuePrice_DES:  true,
      sortType: 'Eth',
      sortDESC: true
    }
  }

//   selectBalance = (sourceSymbol) => {

//     this.props.chooseToken(sourceSymbol, this.props.tokens[sourceSymbol].address, this.props.screen === "swap" || this.props.screen === "limit_order" ?"source":"transfer")
    
//     var sourceBalance = this.props.tokens[sourceSymbol].balance

//     if (this.props.isLimitOrderTab) {
//       const tokens = this.props.getFilteredTokens();
//       const srcToken = tokens.find(token => {
//         return token.symbol === sourceSymbol;
//       });
//       sourceBalance = srcToken.balance;
//     }

//     var sourceDecimal = this.props.tokens[sourceSymbol].decimals
//     var amount

//     if (sourceSymbol !== "ETH") {
//         amount = sourceBalance
//         amount = converters.toT(amount, sourceDecimal)
//         amount = amount.replace(",", "")
//     } else {
//         var gasLimit
//         var totalGas
//         if (this.props.screen === "swap") {
//             var destTokenSymbol = this.props.exchange.destTokenSymbol
//             gasLimit = this.props.tokens[destTokenSymbol].gasLimit || this.props.exchange.max_gas
//             totalGas = converters.calculateGasFee(this.props.exchange.gasPrice, gasLimit) * Math.pow(10, 18)
//             // amount = (sourceBalance - totalGas) * percent / 100
//         } else if (this.props.screen === "limit_order") {
//             const destTokenSymbol = this.props.limitOrder.destTokenSymbol;
//             gasLimit = this.props.tokens[destTokenSymbol].gasLimit || this.props.limitOrder.max_gas;
//             totalGas = converters.calculateGasFee(this.props.limitOrder.gasPrice, gasLimit) * Math.pow(10, 18);
//         } else {
//             gasLimit = this.props.transfer.gas
//             totalGas = converters.calculateGasFee(this.props.transfer.gasPrice, gasLimit) * Math.pow(10, 18)
//             // amount = (sourceBalance - totalGas) * percent / 100
//         }
//         amount = sourceBalance - totalGas * 120 / 100
//         amount = converters.toEther(amount)
//         amount = converters.roundingNumber(amount).toString(10)
//         amount = amount.replace(",", "")
//     }

//     if (amount < 0) amount = 0;

//     if (this.props.screen === "swap" || this.props.screen === "limit_order") {
//         this.props.dispatch(this.props.changeAmount('source', amount))
//         this.props.dispatch(this.props.changeFocus('source'));
//     } else {
//         this.props.dispatch(this.props.changeAmount(amount))
//         // this.props.changeFocus()
//     }
//     this.props.selectTokenBalance();
//     this.props.global.analytics.callTrack("trackClickToken", sourceSymbol, this.props.screen);
// }

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
    this.props.global.analytics.callTrack("trackSearchTokenBalanceBoard");
  }

  // selectToken = (e, symbol, address) => {
  //   if (this.props.isFixedSourceToken) return
  //   this.props.chooseToken(symbol, address, "source")
  //   this.props.global.analytics.callTrack("trackChooseTokenOnBalanceBoard", symbol);
  // }

  showSort = (e) =>{
    this.setState({sortActive: true})
  }
  hideSort = (e) =>{
    this.setState({sortActive: false})
  }

  sortSymbol = (e) =>{
    this.setState({sortType: "Symbol", sortValueSymbol_DES: !this.state.sortValueSymbol_DES})
    this.hideSort()
    this.props.global.analytics.callTrack("trackClickSortBalanceBoard", "Symbol", this.state.sortValueSymbol_DES ? "DESC" : "ASC");
  }

  sortPrice = (e) =>{
    this.setState({sortType: "Price", sortValuePrice_DES: !this.state.sortValuePrice_DES})
    this.hideSort()
    this.props.global.analytics.callTrack("trackClickSortBalanceBoard", "Price", this.state.sortValuePrice_DES ? "DESC" : "ASC");
  }

  toggleBalanceContent = () => {
    this.props.onToggleBalanceContent()
  }

  onSort = (sortType, isDsc) => {
    console.log("[]",{sortType: sortType, sortDESC: isDsc})
    this.setState({sortType: sortType, sortDESC: isDsc})
    this.props.global.analytics.callTrack("trackLimitOrderClickSort", sortType, isDsc ? 'dsc' : 'asc')
  }
  render() {
    // var sortValue = this.state.sortType === "Price" ? this.state.sortValuePrice_DES : this.state.sortValueSymbol_DES;
    var sortValue = this.state.sortDESC
    return (
      <AccountBalanceLayout
        tokens={this.props.tokens}
        translate={this.props.translate}
        sourceActive={this.props.sourceActive}
        // selectToken={this.selectToken}
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
        screen = {this.props.screen}
        isFixedSourceToken = {this.props.isFixedSourceToken}
        analytics={this.props.global.analytics}
        walletName={this.props.walletName}
        isOnDAPP = {this.props.isOnDAPP}
        selectBalance = {this.props.selectToken}
        isLimitOrderTab={this.props.isLimitOrderTab}
        getFilteredTokens={this.props.getFilteredTokens}
        onSort={this.onSort}
        openReImport={this.props.openReImport}
      />
    )
  }
}
