import React from "react"
import { connect } from "react-redux"
import BLOCKCHAIN_INFO from "../../../../env"
import { AccountBalanceLayout } from '../../components/Exchange'
import { getTranslate } from 'react-localize-redux';
import * as converts from "../../utils/converter";

@connect((store, props) => {
  var isFixedSourceToken = !!(store.account && store.account.account.type ==="promo" && store.tokens.tokens[BLOCKCHAIN_INFO.promo_token])
  const marketTokens = store.market.tokens;
  
  return {
    tokens: store.tokens.tokens,
    marketTokens: marketTokens,
    translate: getTranslate(store.locale),
    showBalance: store.global.showBalance,
    walletType: store.account.account.type,
    account: store.account.account,
    address: store.account.account.address,
    sourceActive: props.sourceActive,
    isFixedSourceToken: isFixedSourceToken,
    global: store.global,
    limitOrder : store.limitOrder,
    isOnMobile: store.global.isOnMobile
  }
})
export default class AccountBalance extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      searchWord: "",
      sortType: 'ETH',
      sortName: '',
      sortDESC: true,
      isAddressCopied: false,
      isAddressQROpened: false
    }
  }

  changeSearchBalance = (e) => {
    var value = e.target.value
    this.setState({searchWord:value})
  };

  clickOnInput = () => {
    this.props.global.analytics.callTrack("trackSearchTokenBalanceBoard");
  };

  setIsAddressCopied = (isCopied) => {
    this.setState({ isAddressCopied: isCopied });
  }

  setIsAddressQROpened = (isOpened) => {
    this.setState({ isAddressQROpened: isOpened });
  }
  
  onClickSort = (sortType, sortName, isDsc) => {
    this.setState({
      sortType: sortType !== false ? sortType : this.state.sortType,
      sortName: sortName,
      sortDESC: isDsc
    });
    
    this.props.global.analytics.callTrack("trackLimitOrderClickSort", sortType, isDsc ? 'dsc' : 'asc')
  };
  
  archiveMaintain = (tokens) => {
    return tokens.filter(t =>  (t.symbol === "ETH" || converts.compareTwoNumber(t.rate, 0)))
    .concat(tokens.filter(t =>  !(t.symbol === "ETH" || converts.compareTwoNumber(t.rate, 0))))
  };
  
  archiveBalanceZero = (tokens) => {
    return tokens.filter(t =>  (converts.compareTwoNumber(t.balance, 0)))
    .concat(tokens.filter(t =>  !(converts.compareTwoNumber(t.balance, 0))))
  };
  
  getChangeByETH = (tokenSymbol) => {
    let changeByETH = this.props.marketTokens[`ETH_${tokenSymbol}`] ? this.props.marketTokens[`ETH_${tokenSymbol}`].change : 0;
  
    if (changeByETH === 0) {
      const changeFromTokenToETH = this.props.marketTokens[`${tokenSymbol}_ETH`] ? this.props.marketTokens[`${tokenSymbol}_ETH`].change : 0;
      const changeFromTokenToETHPercent = changeFromTokenToETH / 100;
      changeByETH = changeFromTokenToETH ? converts.formatNumber((-changeFromTokenToETHPercent / (1 + changeFromTokenToETHPercent)) * 100, 2) : 0;
    }
  
    return changeByETH;
  };
  
  getChangeByUSD = (tokenSymbol) => {
    return this.props.marketTokens[`USDC_${tokenSymbol}`] ? this.props.marketTokens[`USDC_${tokenSymbol}`].change : 0;
  };
  
  getCustomizedTokens = () => {
    let tokens = this.props.tokens;
    let res = [];
    
    switch (this.state.sortType) {
      case "ETH":
        const WETHToTop = !!this.props.isLimitOrderTab;
        res = converts.sortETHBalance(tokens, this.state.sortDESC, WETHToTop);
        break;
      case "USD":
        res = Object.keys(tokens).map(key => tokens[key])
        .sort((a, b) => {
          return (this.state.sortDESC ? -1 : 1) *
            (converts.subOfTwoNumber(
              converts.multiplyOfTwoNumber(converts.toT(a.balance, a.decimals), a.rateUSD),
              converts.multiplyOfTwoNumber(converts.toT(b.balance, b.decimals), b.rateUSD)
            ))
        });
        break;
    }
    
    switch (this.state.sortName) {
      case "Name":
        let ordered = [];
        if (this.state.sortDESC) {
          Object.keys(tokens).sort().forEach(function (key) {
            ordered.push(tokens[key])
          });
          res = ordered
        } else {
          Object.keys(tokens).sort().reverse().forEach(function (key) {
            ordered.push(tokens[key])
          });
          res = ordered
        }
        break;
      case "Bal":
        res = Object.keys(tokens).map(key => tokens[key]).sort((a, b) => {
          return (this.state.sortDESC ? -1 : 1) *
            (converts.subOfTwoNumber(converts.toT(a.balance, a.decimals), converts.toT(b.balance, b.decimals)))
        });
        break;
      case "Change":
        res = Object.keys(tokens).map(key => tokens[key]).sort((a, b) => {
          let aChange, bChange;
          
          if (this.state.sortType === 'ETH') {
            aChange = this.getChangeByETH(a.symbol);
            bChange = this.getChangeByETH(b.symbol);
          } else {
            aChange = this.getChangeByUSD(a.symbol);
            bChange = this.getChangeByUSD(b.symbol);
          }
      
          return (this.state.sortDESC ? -1 : 1) * converts.subOfTwoNumber(aChange, bChange);
        });
        break;
    }
    
    res = this.archiveBalanceZero(res);
    
    if (!this.props.hideZeroBalance) {
      res = this.archiveMaintain(res)
    }
    
    return res
  };
  
  isValidPriority = (token) => {
    const {tokens, limitOrder} = this.props;
    const quote = tokens[limitOrder.destTokenSymbol.replace('WETH', 'ETH')];
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
        sortName = {this.state.sortName}
        account={this.props.account}
        screen = {this.props.screen}
        isFixedSourceToken = {this.props.isFixedSourceToken}
        analytics={this.props.global.analytics}
        selectBalance = {this.props.selectToken}
        selectBalanceButton={this.props.selectBalanceButton}
        isLimitOrderTab={this.props.isLimitOrderTab}
        openReImport={this.props.openReImport}
        onClickSort={this.onClickSort}
        hideZeroBalance={this.props.hideZeroBalance}
        show24hChange={this.props.show24hChange}
        marketTokens={this.props.marketTokens}
        getCustomizedTokens={this.getCustomizedTokens}
        isValidPriority={this.isValidPriority}
        getChangeByETH={this.getChangeByETH}
        getChangeByUSD={this.getChangeByUSD}
        isOnMobile={this.props.isOnMobile}
        isAddressCopied={this.state.isAddressCopied}
        setIsAddressCopied={this.setIsAddressCopied}
        isAddressQROpened={this.state.isAddressQROpened}
        setIsAddressQROpened={this.setIsAddressQROpened}
      />
    )
  }
}
