import React from "react"
import { groupBy, isEmpty, sortBy } from "underscore";
import { divOfTwoNumber, formatAddress, roundingNumber, toT } from "../../utils/converter";
import { TX_TYPES } from "../../services/constants";
import * as portfolioService from "../../services/portfolio/portfolioService";
import { getFormattedDate } from "../../utils/common";
import InlineLoading from "../../components/CommonElement/InlineLoading";
import PaginationList from "../../components/CommonElement/Pagination/PaginationList";
import PaginationLimit from "../../components/CommonElement/Pagination/PaginationLimit";
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
      totalTxs: '---',
      currentPage: 1,
      pageTotal: 1,
      limit: 20,
    };
    
    this.fetchingTxsInterval = null
  }
  
  componentDidMount() {
    this.setTokenAddresses();
    this.setTxHistory();
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
  
  async setTxHistory(page = 1, limit = 20) {
    const address = this.props.address;
    
    if (!this.props.address) return;
  
    this.setState({ loadingHistory: true });
    let { data, totalTxs, inQueue, isError } = await portfolioService.fetchAddressTxs(address, page, limit);
    
    this.setState({ loadingError: isError });
    if (isError) {
      this.setState({ loadingHistory: false });
      return;
    }

    if (inQueue) {
      this.fetchingTxsInterval = setInterval(async () => {
        await this.setTxHistory(page, limit);
      }, 2000);
      return;
    }
    
    clearInterval(this.fetchingTxsInterval);
    
    data = this.reduceTxs(data);

    this.setState({
      historyTxs: data,
      loadingHistory: false,
      totalTxs: totalTxs,
      pageTotal: Math.ceil(totalTxs / limit)
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
    return tokenSymbol !== 'ETH' && this.props.tokens[tokenSymbol] ? this.props.tokens[tokenSymbol].decimals : 18;
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
      return (
        <div className={"portfolio__tx"} key={index}>
          <div className={"portfolio__tx-header theme__table-header"}>{date}</div>
          {this.renderTxByDate(txs[date])}
        </div>
      )
    });
  }
  
  renderTxByDate(txs) {
    return txs.map((tx, index) => {
      if (tx.type === TX_TYPES.transfer) {
        const transferTokenSymbol = tx.transfer_token_symbol;
        const transferTokenDecimal = this.getTokenDecimal(transferTokenSymbol);
        const transferValue = this.formatTxValue(tx.transfer_token_value, transferTokenDecimal);
        
        if (tx.transfer_from === this.props.address) {
          return this.renderSendTx(tx.hash, transferValue, transferTokenSymbol, tx.transfer_to, tx.time, tx.isError, index);
        } else if (tx.transfer_to === this.props.address) {
          return this.renderReceiveTx(tx.hash, transferValue, transferTokenSymbol, tx.transfer_from, tx.time, tx.isError, index);
        }
      } else if (tx.type === TX_TYPES.swap) {
        const srcSymbol = this.state.tokenAddresses[tx.swap_source_token.toLowerCase()];
        const destSymbol = this.state.tokenAddresses[tx.swap_dest_token.toLowerCase()];
        const srcDecimal = this.getTokenDecimal(srcSymbol);
        const destDecimal = this.getTokenDecimal(destSymbol);
        const srcValue = this.formatTxValue(tx.swap_source_amount, srcDecimal);
        const destValue = this.formatTxValue(tx.swap_dest_amount, destDecimal);
        
        return this.renderSwapTx(tx.hash, srcValue, srcSymbol, destValue, destSymbol, tx.time, tx.isError, index);
      } else if (tx.type === TX_TYPES.approve) {
        return this.renderApproveTx(tx.hash, tx.approve_token_symbol, tx.time, tx.isError, index);
      } else if (tx.type === TX_TYPES.undefined) {
        return this.renderUndefinedTx(tx.hash, tx.from, tx.to, tx.time, tx.isError, index);
      }
      
      return null;
    })
  }
  
  renderSendTx(txHash, txValue, txTokenSymbol, txTo, time, isError, index) {
    return (
      <a href={`${BLOCKCHAIN_INFO.ethScanUrl}tx/${txHash}`} target="_blank" className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon portfolio__tx-icon--send"}/>
          <div className={"portfolio__tx-content"}>
            <div className="common__flexbox-normal">
              <div className={"portfolio__tx-bold common__mr-15"}>- {txValue} {txTokenSymbol}</div>
              <div className={"common__small-text theme__text-7"}>{time}</div>
            </div>
            <div className={"portfolio__tx-light theme__text-7"}>
              {this.props.translate('transaction.exchange_to') || 'To'}: {formatAddress(txTo, 20)}
            </div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>{this.props.translate('send') || 'Send'}</div>
          {isError && (
            <div className={"portfolio__tx-type common__error-text"}>{this.props.translate('failed') || 'Failed'}</div>
          )}
        </div>
      </a>
    )
  }
  
  renderReceiveTx(txHash, txValue, txTokenSymbol, txFrom, time, isError, index) {
    return (
      <a href={`${BLOCKCHAIN_INFO.ethScanUrl}tx/${txHash}`} target="_blank" className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon portfolio__tx-icon--receive"}/>
          <div className={"portfolio__tx-content"}>
            <div className="common__flexbox-normal">
              <div className={"portfolio__tx-bold common__mr-15"}>+ {txValue} {txTokenSymbol}</div>
              <div className={"common__small-text theme__text-7"}>{time}</div>
            </div>
            <div className={"portfolio__tx-light theme__text-7"}>
              {this.props.translate('transaction.exchange_from') || 'From'}: {formatAddress(txFrom, 20)}
            </div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>{this.props.translate('transaction.exchange_receive') || 'Receive'}</div>
          {isError && (
            <div className={"portfolio__tx-type common__error-text"}>{this.props.translate('failed') || 'Failed'}</div>
          )}
        </div>
      </a>
    )
  }
  
  renderApproveTx(txHash, txTokenSymbol, time, isError, index) {
    return (
      <a href={`${BLOCKCHAIN_INFO.ethScanUrl}tx/${txHash}`} target="_blank" className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon portfolio__tx-icon--approve"}/>
          <div className={"portfolio__tx-content"}>
            <div className="common__flexbox-normal">
              <div className={"portfolio__tx-light theme__text-7 common__mr-15"}>
                {this.props.translate('portfolio.token_approved') || 'Token Approved'}
              </div>
              <div className={"common__small-text theme__text-7"}>{time}</div>
            </div>
            <div className={"portfolio__tx-bold"}>
              {this.props.translate('portfolio.token_is_approved', {token: txTokenSymbol}) || `${txTokenSymbol} is Approved`}
            </div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>{this.props.translate('modal.approve') || 'Approve'}</div>
          {isError && (
            <div className={"portfolio__tx-type common__error-text"}>{this.props.translate('failed') || 'Failed'}</div>
          )}
        </div>
      </a>
    )
  }
  
  renderSwapTx(txHash, sendValue, sendTokenSymbol, receiveValue, receiveTokenSymbol, time, isError, index) {
    return (
      <a href={`${BLOCKCHAIN_INFO.ethScanUrl}tx/${txHash}`} target="_blank" className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon portfolio__tx-icon--swap"}/>
          <div className={"portfolio__tx-content"}>
            <div className="common__flexbox-normal">
              <div className={"portfolio__tx-bold common__mr-15"}>
                {sendValue} {sendTokenSymbol} ➞ {receiveValue} {receiveTokenSymbol}
              </div>
              <div className={"common__small-text theme__text-7"}>{time}</div>
            </div>
            <div className={"portfolio__tx-light theme__text-7"}>
              1 {sendTokenSymbol} = {roundingNumber(divOfTwoNumber(receiveValue, sendValue))} {receiveTokenSymbol}
            </div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>{this.props.translate('transaction.swap') || 'Swap'}</div>
          {isError && (
            <div className={"portfolio__tx-type common__error-text"}>{this.props.translate('failed') || 'Failed'}</div>
          )}
        </div>
      </a>
    )
  }
  
  renderLimitOrderTx(txHash, sendValue, sendTokenSymbol, receiveValue, receiveTokenSymbol, time, isError, index) {
    return (
      <a href={`${BLOCKCHAIN_INFO.ethScanUrl}tx/${txHash}`} target="_blank" className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon portfolio__tx-icon--limit-order"}/>
          <div className={"portfolio__tx-content"}>
            <div className="common__flexbox-normal">
              <div className={"portfolio__tx-light common__mr-15 theme__text-7"}>{this.props.translate('portfolio.lo_triggered') || 'Limit Order Triggered'}</div>
              <div className={"common__small-text theme__text-7"}>{time}</div>
            </div>
            <div className={"portfolio__tx-bold"}>
              {sendValue} {sendTokenSymbol} ➞ {receiveValue} {receiveTokenSymbol}
            </div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>{this.props.translate('transaction.limit_order') || 'Limit Order'}</div>
          {isError && (
            <div className={"portfolio__tx-type common__error-text"}>{this.props.translate('failed') || 'Failed'}</div>
          )}
        </div>
      </a>
    )
  }
  
  renderUndefinedTx(txHash, from, to, time, isError, index) {
    return (
      <a href={`${BLOCKCHAIN_INFO.ethScanUrl}tx/${txHash}`} target="_blank" className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon"}/>
          <div className={"portfolio__tx-content"}>
            <div className="common__flexbox-normal">
              <div className={"portfolio__tx-light theme__text-7 common__mr-15"}>
                {this.props.translate('transaction.exchange_from') || 'From'}: {formatAddress(from, 20)}
              </div>
              <div className={"common__small-text theme__text-7"}>{time}</div>
            </div>
            <div className={"portfolio__tx-light theme__text-7"}>
              {this.props.translate('transaction.exchange_to') || 'To'}: {formatAddress(to, 20)}
            </div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>{this.props.translate('portfolio.interact_contract') || 'Interact Contract'}</div>
          {isError && (
            <div className={"portfolio__tx-type common__error-text"}>{this.props.translate('failed') || 'Failed'}</div>
          )}
        </div>
      </a>
    )
  }
  
  onPageChanged = (page) => {
    this.setState({ currentPage: page });
    this.setTxHistory(page, this.state.limit);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };
  
  onLimitChanged = (limit) => {
    this.setState({
      limit: limit,
      currentPage: 1
    });
    this.setTxHistory(1, limit);
  };
  
  render() {
    return (
      <div className={"portfolio__history portfolio__item common__slide-up theme__background-11"}>
        <div className="portfolio__history-header">
          {!this.props.isOnMobile && (
            <div className={"portfolio__history-title"}>
              {this.props.translate('portfolio.tx_history') || 'Transaction History'}
            </div>
          )}
          
          <PaginationLimit
            translate={this.props.translate}
            limit={this.state.limit}
            onLimitChanged={this.onLimitChanged}
            totalRecords={this.state.totalTxs}
          />
        </div>
        
        <div className={"portfolio__history-content"}>
          {this.state.loadingHistory && (
            <InlineLoading theme={this.props.theme}/>
          )}
          
          {!this.state.loadingHistory && this.renderTransactionHistory()}
        </div>
        
        {(!this.state.loadingError && !isEmpty(this.state.historyTxs) && this.state.pageTotal > 1) && (
          <PaginationList
            total={this.state.pageTotal}
            currentPage={this.state.currentPage}
            onPageChanged={this.onPageChanged}
            loading={this.state.loadingHistory}
          />
        )}
      </div>
    )
  }
}
