import React from "react";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import * as globalActions from "../../actions/globalActions";
import { getFormattedDate } from "../../utils/common";
import * as etherScanService from "../../services/etherscan/etherScanService";
import PortfolioView from "./PortfolioView";
import { groupBy, sortBy } from 'underscore';

@connect((store) => {
  const address = store.account.account.address || '';
  return {
    tokens: store.tokens.tokens,
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
      historyTxs: {},
      tokenAddresses: {},
      currency: 'ETH'
    }
  }
  
  componentDidMount() {
    this.setTxHistory();
    this.setTokenAddresses();
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.address !== prevProps.address) {
      this.setTxHistory(true);
    }
  }
  
  setTokenAddresses() {
    const tokenAddresses = Object.values(this.props.tokens).reduce((result, token) => {
      Object.assign(result, {[token.address]: token.symbol});
      return result
    }, {});

    this.setState({ tokenAddresses: tokenAddresses });
  }
  
  async setTxHistory(forceUpdate = false) {
    const address = this.props.address;
    
    if (!this.props.address) return;
    
    let txs = sessionStorage.getItem(`historyTxs_${address}`);
    
    if (!txs || forceUpdate) {
      const normalTxs = await etherScanService.fetchNormalTransactions(address);
      const internalTxs = await etherScanService.fetchInternalTransactions(address);
      const erc20Txs = await etherScanService.fetchERC20Transactions(address);
      
      txs = normalTxs.concat(internalTxs).concat(erc20Txs);
      txs = this.reduceTxs(txs);
  
      sessionStorage.setItem(`historyTxs_${address}`, JSON.stringify(txs));
    } else {
      txs = JSON.parse(txs);
    }
  
    this.setState({ historyTxs: txs });
  }
  
  reduceTxs(txs) {
    const formattedTxs = sortBy(txs, (tx) => {
      return -tx.blockNumber;
    });
    
    return groupBy(formattedTxs, (tx) => {
      return getFormattedDate(+tx.timeStamp);
    });
  }
  
  reImportWallet = () => {
    this.props.dispatch(globalActions.clearSession());
    this.props.global.analytics.callTrack("trackClickChangeWallet");
  };
  
  switchCurrency = (currency) => {
    this.setState({ currency: currency === 'ETH' ? 'USD' : 'ETH' })
  };
  
  render() {
    return (
      <PortfolioView
        eth={this.props.tokens.ETH}
        ethereum={this.props.ethereum}
        account={this.props.account}
        isImported={this.props.account.account}
        address={this.props.address}
        translate={this.props.translate}
        reImportWallet={this.reImportWallet}
        equityChart={this.equityChart}
        performanceChart={this.performanceChart}
        historyTxs={this.state.historyTxs}
        tokenAddresses={this.state.tokenAddresses}
        currency={this.state.currency}
        switchCurrency={this.switchCurrency}
      />
    )
  }
}
