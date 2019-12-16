import React from "react"
import { connect } from "react-redux"
import BLOCKCHAIN_INFO from "../../../../env"
import { AccountBalanceLayout } from '../../components/Exchange'
import { getTranslate } from 'react-localize-redux';
import * as converts from "../../utils/converter";

@connect((store, props) => {
  var isFixedSourceToken = !!(store.account && store.account.account.type ==="promo" && store.tokens.tokens[BLOCKCHAIN_INFO.promo_token])
  
  return {
    tokens: store.tokens.tokens,
    marketTokens: store.market.tokens,
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
  };
  
  onClickSortType = (id, isDsc) => {
    this.onSort(id, isDsc);
    this.props.global.analytics.callTrack("trackLimitOrderClickSortOnWalletPanel", id, isDsc)
  };
  
  archiveMaintain = (tokens) => {
    return tokens.filter(t =>  (t.symbol == "ETH" || converts.compareTwoNumber(t.rate, 0)))
    .concat(tokens.filter(t =>  !(t.symbol == "ETH" || converts.compareTwoNumber(t.rate, 0))))
  };
  
  archiveBalanceZero = (tokens) => {
    return tokens.filter(t =>  (converts.compareTwoNumber(t.balance, 0)))
    .concat(tokens.filter(t =>  !(converts.compareTwoNumber(t.balance, 0))))
  };
  
  archiveUnsupported = (tokens) => {
    return tokens.filter(token =>  token.sp_limit_order && this.isValidPriority(token)).concat(tokens.filter(token =>  !(token.sp_limit_order && this.isValidPriority(token))))
  };
  
  getCustomizedTokens = () => {
    let tokens = this.props.tokens;
    console.log(tokens);
    let res = [];
    
    switch (this.state.sortType) {
      case "Eth":
        if (this.state.sortDESC) {
          res = converts.sortEthBalance(tokens)
        } else {
          res = converts.sortASCEthBalance(tokens)
        }
        break;
      case "Name":
        if (this.state.sortDESC) {
          var ordered = []
          Object.keys(tokens).sort().forEach(function (key) {
            ordered.push(tokens[key])
          })
          res = ordered
        } else {
          var ordered = []
          Object.keys(tokens).sort().reverse().forEach(function (key) {
            ordered.push(tokens[key])
          })
          res = ordered
        }
        break;
      case "Bal":
        res = Object.keys(tokens).map(key => tokens[key])
        .sort((a, b) => {
          return (this.state.sortDESC ? -1 : 1) *
            (converts.subOfTwoNumber(converts.toT(a.balance, a.decimals), converts.toT(b.balance, b.decimals)))
        })
        break;
      case "USDT":
        res = Object.keys(tokens).map(key => tokens[key])
        .sort((a, b) => {
          return (this.state.sortDESC ? -1 : 1) *
            (converts.subOfTwoNumber(
              converts.multiplyOfTwoNumber(converts.toT(a.balance, a.decimals), a.rateUSD),
              converts.multiplyOfTwoNumber(converts.toT(b.balance, b.decimals), b.rateUSD)
            ))
        })
        break;
    }
    
    if (this.props.isLimitOrderTab) {
      res = this.archiveUnsupported(res)
    } else {
      res = this.archiveBalanceZero(res)
    }
    
    if (!this.props.hideZeroBalance) {
      res = this.archiveMaintain(res)
    }
    
    return res
  };
  
  isValidPriority = (token) => {
    const {tokens, limitOrder} = this.props;
    const quote = limitOrder.sideTrade === "buy" ? tokens[limitOrder.sourceTokenSymbol.replace('WETH', 'ETH')] : tokens[limitOrder.destTokenSymbol.replace('WETH', 'ETH')];
    return !("quote_priority" in token) || token.quote_priority < quote.quote_priority;
  };
  
  render() {
    return (
      <AccountBalanceLayout
        tokens={this.props.tokens}
        translate={this.props.translate}
        sourceActive={this.props.sourceActive}
        clickOnInput={this.clickOnInput}
        changeSearchBalance = {this.changeSearchBalance}
        searchWord = {this.state.searchWord}
        sortType = {this.state.sortType}
        account={this.props.account}
        screen = {this.props.screen}
        isFixedSourceToken = {this.props.isFixedSourceToken}
        analytics={this.props.global.analytics}
        selectBalance = {this.props.selectToken}
        isLimitOrderTab={this.props.isLimitOrderTab}
        openReImport={this.props.openReImport}
        onClickSortType={this.onClickSortType}
        hideZeroBalance={this.props.hideZeroBalance}
        show24hChange={this.props.show24hChange}
        marketTokens={this.props.marketTokens}
        getCustomizedTokens={this.getCustomizedTokens}
        isValidPriority={this.isValidPriority}
      />
    )
  }
}
