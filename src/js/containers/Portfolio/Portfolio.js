import React from "react";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import * as globalActions from "../../actions/globalActions";
import PortfolioView from "./PortfolioView";
import { PORTFOLIO_TAB } from "../../services/constants";

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
      />
    )
  }
}
