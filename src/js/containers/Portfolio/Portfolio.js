import React from "react";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import * as globalActions from "../../actions/globalActions";
import PortfolioView from "./PortfolioView";
import { PORTFOLIO_TAB } from "../../services/constants";
import history from "../../history";

@connect((store) => {
  const address = store.account.account.address || '';
  return {
    ethToken: store.tokens.tokens.ETH,
    account: store.account,
    address: address.toLowerCase(),
    translate: getTranslate(store.locale),
    global: store.global
  }
})
export default class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    
    this.equityChart = React.createRef();
    this.performanceChart = React.createRef();
    
    this.state = {
      currency: 'ETH',
      mobileTab: PORTFOLIO_TAB.overview
    }
  }
  
  reImportWallet = () => {
    this.props.dispatch(globalActions.clearSession());
    this.props.global.analytics.callTrack("trackClickChangeWallet");
  };
  
  switchCurrency = (currency) => {
    this.setState({ currency })
  };
  
  switchMobileTab = (tab) => {
    this.setState({ mobileTab: tab })
  };

  selectToken=(symbol) => {
    this.props.global.analytics.callTrack("trackClickTokenInAccountBalance", symbol, "portfolio");
    let path = '';
    
    if (symbol === "ETH") {
      path = "/swap/eth-knc"
    } else {
      path = "/swap/" + symbol.toLowerCase() + "-eth"
    }
    
    history.push(path);
    
    if (window.kyberBus) window.kyberBus.broadcast('go.to.swap-path');
  };

  selectBalanceButton=(type, symbol) => {
    this.props.global.analytics.callTrack("trackClickTokenInAccountBalance", symbol, "portfolio");
    let path = '';

    switch (type) {
      case "buy":
        if (symbol === "ETH") {
          path = "/swap/dai-eth"
        } else {
          path = "/swap/eth-" + symbol.toLowerCase()
        }
        break;
      
      case "sell":
        if (symbol === "ETH") {
          path = "/swap/eth-knc"
        } else {
          path = "/swap/" + symbol.toLowerCase() + "-eth"
        }
        break;
      
      case "transfer":
        path = "/transfer/" + symbol.toLowerCase()
        break;
      default:
        break;
    }
    
    if(!path) return
    history.push(path);
    
    if (window.kyberBus) window.kyberBus.broadcast('go.to.swap-path');
  };
  
  render() {
    return (
      <PortfolioView
        eth={this.props.ethToken}
        ethereum={this.props.ethereum}
        account={this.props.account}
        isImported={this.props.account.account}
        address={this.props.address}
        translate={this.props.translate}
        reImportWallet={this.reImportWallet}
        equityChart={this.equityChart}
        performanceChart={this.performanceChart}
        currency={this.state.currency}
        switchCurrency={this.switchCurrency}
        mobileTab={this.state.mobileTab}
        switchMobileTab={this.switchMobileTab}
        isOnMobile={this.props.global.isOnMobile}
        theme={this.props.global.theme}
        selectToken={this.selectToken}
        selectBalanceButton={this.selectBalanceButton}
      />
    )
  }
}
