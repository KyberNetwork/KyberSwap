import React from "react"
import { connect } from "react-redux"
import BLOCKCHAIN_INFO from "../../../../env"
import { AccountBalanceLayout } from '../../components/Exchange'
import { getTranslate } from 'react-localize-redux';

@connect((store, props) => {
  var isFixedSourceToken = !!(store.account && store.account.account.type ==="promo" && store.tokens.tokens[BLOCKCHAIN_INFO.promo_token])
  
  return {
    tokens: store.tokens.tokens,
    translate: getTranslate(store.locale),
    showBalance: store.global.showBalance,
    walletType: store.account.account.type,
    account: store.account.account,
    address: store.account.account.address,
    sourceActive: props.sourceActive,
    isFixedSourceToken: isFixedSourceToken,
    global: store.global,
    limitOrder : store.limitOrder
  }
})

export default class AccountBalance extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      searchWord: "",
      sortType: 'Eth',
      sortDESC: true
    }
  }

  changeSearchBalance = (e) => {
    var value = e.target.value
    this.setState({searchWord:value})
  }

  clickOnInput = () => {
    this.props.global.analytics.callTrack("trackSearchTokenBalanceBoard");
  }

  onSort = (sortType, isDsc) => {
    this.setState({sortType: sortType, sortDESC: isDsc})
    this.props.global.analytics.callTrack("trackLimitOrderClickSort", sortType, isDsc ? 'dsc' : 'asc')
  }
  
  render() {
    const {tokens, limitOrder} = this.props
    var sortValue = this.state.sortDESC
    
    return (
      <AccountBalanceLayout
        tokens={this.props.tokens}
        translate={this.props.translate}
        sourceActive={this.props.sourceActive}
        clickOnInput={this.clickOnInput}
        changeSearchBalance = {this.changeSearchBalance}
        searchWord = {this.state.searchWord}
        sortType = {this.state.sortType}
        sortValue = {sortValue}
        account={this.props.account}
        screen = {this.props.screen}
        isFixedSourceToken = {this.props.isFixedSourceToken}
        analytics={this.props.global.analytics}
        selectBalance = {this.props.selectToken}
        isLimitOrderTab={this.props.isLimitOrderTab}
        onSort={this.onSort}
        openReImport={this.props.openReImport}
        {
          ...(this.props.isLimitOrderTab && {
            priorityValid: (t) => {
              const {sideTrade} = this.props.limitOrder
              const quote = sideTrade == "buy" ? tokens[limitOrder.sourceTokenSymbol.replace('WETH', 'ETH')] : tokens[limitOrder.destTokenSymbol.replace('WETH', 'ETH')]
              return !("quote_priority" in t) || t.quote_priority < quote.quote_priority
            }
          })
        }
      />
    )
  }
}
