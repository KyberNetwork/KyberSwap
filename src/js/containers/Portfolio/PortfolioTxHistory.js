import React from "react"
import { groupBy, isEmpty, sortBy } from "underscore";
import { divOfTwoNumber, roundingNumber, toT } from "../../utils/converter";
import { TX_TYPES, PORTFOLIO_TX_LIMIT } from "../../services/constants";
import * as portfolioService from "../../services/portfolio/portfolioService";
import { getFormattedDate } from "../../utils/common";
import InlineLoading from "../../components/CommonElement/InlineLoading";
import PaginationList from "../../components/CommonElement/PaginationList";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import BLOCKCHAIN_INFO from "../../../../env";

@connect((store) => {
  const address = store.account.account.address || '';
  const global = store.global;
  
  return {
    tokens: store.tokens.tokens,
    address: address.toLowerCase(),
    translate: getTranslate(store.locale),
    theme: global.theme,
    isOnMobile: global.isOnMobile,
  }
})
export default class PortfolioTxHistory extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      tokenAddresses: {},
      historyTxs: {},
      loadingHistory: false,
      loadingError: false,
      pageTotal: 1
    }
    
    this.fetchingTxsInterval = null
  }
  
  componentDidMount() {
    this.setTokenAddresses();
    this.setTxHistory();
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.address !== prevProps.address) {
      this.setTxHistory();
    }
  }
  
  componentWillUnmount() {
    clearInterval(this.fetchingTxsInterval)
  }
  
  setTokenAddresses() {
    const tokenAddresses = Object.values(this.props.tokens).reduce((result, token) => {
      Object.assign(result, {[token.address]: token.symbol});
      return result
    }, {});
    
    this.setState({ tokenAddresses: tokenAddresses });
  }
  
  async setTxHistory(page = 1) {
    const address = this.props.address;
    
    if (!this.props.address) return;
  
    this.setState({ loadingHistory: true });
    let { data, count, in_queue } = await portfolioService.fetchAddressTxs(address, page);

    if (in_queue) {
      this.fetchingTxsInterval = setInterval(async () => {
        await this.setTxHistory();
      }, 2000);
      return;
    }
    
    clearInterval(this.fetchingTxsInterval);
    
    data = this.reduceTxs(data);
    
    this.setState({
      historyTxs: data,
      loadingHistory: false,
      pageTotal: Math.ceil(count / PORTFOLIO_TX_LIMIT)
    });
  }
  
  reduceTxs(txs) {
    const formattedTxs = sortBy(txs, (tx) => {
      return -tx.blockNumber;
    });
    
    return groupBy(formattedTxs, (tx) => {
      return getFormattedDate(+tx.timeStamp);
    });
  }
  
  formatTxValue(value, tokenDecimal) {
    return +toT(value, tokenDecimal ? tokenDecimal : 18, 6);
  }
  
  getTokenDecimal(tokenSymbol) {
    return tokenSymbol !== 'ETH' ? this.props.tokens[tokenSymbol].decimals : 18;
  }
  
  validateTransferTx(tx) {
    return tx.transfer_token_symbol && tx.transfer_token_value && tx.transfer_from && tx.transfer_to && tx.hash;
  }
  
  validateSwapTx(tx) {
    return tx.swap_source_token && tx.swap_dest_token && tx.swap_source_amount && !isNaN(tx.swap_source_amount) && tx.swap_dest_amount && !isNaN(tx.swap_dest_amount) && tx.hash;
  }
  
  validateApproveTx(tx) {
    return tx.approve_token_symbol && tx.hash;
  }
  
  validateUndefinedTx(tx) {
    return tx.from && tx.to && tx.hash;
  }
  
  checkValidTxsByDate(txs) {
    let isValid = false;
    for (let i = 0; i < txs.length; i++) {
      if (txs[i] !== null) {
        isValid = true;
        break;
      }
    }
    return isValid;
  }
  
  renderTransactionHistory() {
    const txs = this.state.historyTxs;
  
    if (this.state.loadingError) {
      return (
        <div className="portfolio__info">
          <div className="portfolio__info-text theme__text-7">
            {this.props.translate('portfolio.error_loading_history') || 'Something wrong loading your history txs, please try again later.'}
          </div>
        </div>
      )
    }
    
    if (isEmpty(txs)) {
      return (
        <div className="portfolio__info">
          <div className="portfolio__info-text theme__text-7">
            {this.props.translate('portfolio.empty_history') || 'You do not have any transaction.'}
          </div>
          {/*<div className="portfolio__info-button">Start Now</div>*/}
        </div>
      )
    }
    
    return Object.keys(txs).map((date, index) => {
      const txsByDate = this.renderTxByDate(txs[date]);
      
      if (!this.checkValidTxsByDate(txsByDate)) return null;
      
      return (
        <div className={"portfolio__tx"} key={index}>
          <div className={"portfolio__tx-header theme__table-header"}>{date}</div>
          {txsByDate}
        </div>
      )
    });
  }
  
  renderTxByDate(txs) {
    return txs.map((tx, index) => {
      if (tx.type === TX_TYPES.transfer) {
        const isValidTx = this.validateTransferTx(tx);
        if (!isValidTx) return null;
        
        const transferTokenSymbol = tx.transfer_token_symbol;
        const transferTokenDecimal = this.getTokenDecimal(transferTokenSymbol);
        const transferValue = this.formatTxValue(tx.transfer_token_value, transferTokenDecimal);
        
        if (tx.transfer_from === this.props.address) {
          return this.renderSendTx(tx.hash, transferValue, transferTokenSymbol, tx.transfer_to, index);
        } else if (tx.transfer_to === this.props.address) {
          return this.renderReceiveTx(tx.hash, transferValue, transferTokenSymbol, tx.transfer_from, index);
        }
      } else if (tx.type === TX_TYPES.swap) {
        const isValidTx = this.validateSwapTx(tx);
        if (!isValidTx) return null;
        
        const srcSymbol = this.state.tokenAddresses[tx.swap_source_token.toLowerCase()];
        const destSymbol = this.state.tokenAddresses[tx.swap_dest_token.toLowerCase()];
        const srcDecimal = this.getTokenDecimal(srcSymbol);
        const destDecimal = this.getTokenDecimal(destSymbol);
        const srcValue = this.formatTxValue(tx.swap_source_amount, srcDecimal);
        const destValue = this.formatTxValue(tx.swap_dest_amount, destDecimal);
        
        return this.renderSwapTx(tx.hash, srcValue, srcSymbol, destValue, destSymbol, index);
      } else if (tx.type === TX_TYPES.approve) {
        const isValidTx = this.validateApproveTx(tx);
        if (!isValidTx) return null;
        
        return this.renderApproveTx(tx.hash, tx.approve_token_symbol, index);
      } else if (tx.type === TX_TYPES.undefined) {
        const isValidTx = this.validateUndefinedTx(tx);
        if (!isValidTx) return null;
        
        return this.renderUndefinedTx(tx.hash, tx.from, tx.to, index);
      }
      
      return null;
    })
  }
  
  renderSendTx(txHash, txValue, txTokenSymbol, txTo, index) {
    return (
      <a href={`${BLOCKCHAIN_INFO.ethScanUrl}tx/${txHash}`} target="_blank" className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon portfolio__tx-icon--send"}/>
          <div className={"portfolio__tx-content"}>
            <div className={"portfolio__tx-bold"}>- {txValue} {txTokenSymbol}</div>
            <div className={"portfolio__tx-light theme__text-7"}>{this.props.translate('transaction.exchange_to') || 'To'}: {txTo}</div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>{this.props.translate('send') || 'Send'}</div>
        </div>
      </a>
    )
  }
  
  renderReceiveTx(txHash, txValue, txTokenSymbol, txFrom, index) {
    return (
      <a href={`${BLOCKCHAIN_INFO.ethScanUrl}tx/${txHash}`} target="_blank" className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon portfolio__tx-icon--receive"}/>
          <div className={"portfolio__tx-content"}>
            <div className={"portfolio__tx-bold"}>+ {txValue} {txTokenSymbol}</div>
            <div className={"portfolio__tx-light theme__text-7"}>{this.props.translate('transaction.exchange_from') || 'From'}: {txFrom}</div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>{this.props.translate('transaction.exchange_receive') || 'Receive'}</div>
        </div>
      </a>
    )
  }
  
  renderApproveTx(txHash, txTokenSymbol, index) {
    return (
      <a href={`${BLOCKCHAIN_INFO.ethScanUrl}tx/${txHash}`} target="_blank" className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon portfolio__tx-icon--approve"}/>
          <div className={"portfolio__tx-content"}>
            <div className={"portfolio__tx-light theme__text-7"}>{this.props.translate('portfolio.token_approved') || 'Token Approved'}</div>
            <div className={"portfolio__tx-bold"}>
              {this.props.translate('portfolio.token_is_approved', {token: txTokenSymbol}) || `${txTokenSymbol} is Approved`}
            </div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>{this.props.translate('modal.approve') || 'Approve'}</div>
        </div>
      </a>
    )
  }
  
  renderSwapTx(txHash, sendValue, sendTokenSymbol, receiveValue, receiveTokenSymbol, index) {
    return (
      <a href={`${BLOCKCHAIN_INFO.ethScanUrl}tx/${txHash}`} target="_blank" className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon portfolio__tx-icon--swap"}/>
          <div className={"portfolio__tx-content"}>
            <div className={"portfolio__tx-bold"}>
              {sendValue} {sendTokenSymbol} ➞ {receiveValue} {receiveTokenSymbol}
            </div>
            <div className={"portfolio__tx-light theme__text-7"}>
              1 {sendTokenSymbol} = {roundingNumber(divOfTwoNumber(receiveValue, sendValue))} {receiveTokenSymbol}
            </div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>{this.props.translate('transaction.swap') || 'Swap'}</div>
        </div>
      </a>
    )
  }
  
  renderLimitOrderTx(txHash, sendValue, sendTokenSymbol, receiveValue, receiveTokenSymbol, index) {
    return (
      <a href={`${BLOCKCHAIN_INFO.ethScanUrl}tx/${txHash}`} target="_blank" className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon portfolio__tx-icon--limit-order"}/>
          <div className={"portfolio__tx-content"}>
            <div className={"portfolio__tx-light theme__text-7"}>{this.props.translate('portfolio.lo_triggered') || 'Limit Order Triggered'}</div>
            <div className={"portfolio__tx-bold"}>
              {sendValue} {sendTokenSymbol} ➞ {receiveValue} {receiveTokenSymbol}
            </div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>{this.props.translate('transaction.limit_order') || 'Limit Order'}</div>
        </div>
      </a>
    )
  }
  
  renderUndefinedTx(txHash, from, to, index) {
    return (
      <a href={`${BLOCKCHAIN_INFO.ethScanUrl}tx/${txHash}`} target="_blank" className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon"}/>
          <div className={"portfolio__tx-content"}>
            <div className={"portfolio__tx-light theme__text-7"}>{this.props.translate('transaction.exchange_from') || 'From'}: {from}</div>
            <div className={"portfolio__tx-light theme__text-7"}>{this.props.translate('transaction.exchange_to') || 'To'}: {to}</div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>{this.props.translate('undefined') || 'Undefined'}</div>
        </div>
      </a>
    )
  }
  
  render() {
    return (
      <div className={"portfolio__history portfolio__item common__slide-up theme__background-11"}>
        {!this.props.isOnMobile && (
          <div className={"portfolio__title"}>{this.props.translate('portfolio.tx_history') || 'Transaction History'}</div>
        )}
        
        <div className={"portfolio__history-content"}>
          {this.state.loadingHistory && (
            <InlineLoading theme={this.props.theme}/>
          )}
          
          {!this.state.loadingHistory && this.renderTransactionHistory()}
        </div>
        
        {(!this.state.loadingError && !isEmpty(this.state.historyTxs) && this.state.pageTotal > 1) && (
          <PaginationList
            total={this.state.pageTotal}
            onPageChanged={(page) => this.setTxHistory(page)}
            loading={this.state.loadingHistory}
          />
        )}
      </div>
    )
  }
}
