import React from "react"
import { groupBy, isEmpty, sortBy } from "underscore";
import { divOfTwoNumber, formatAddress, roundingNumber, toT } from "../../utils/converter";
import { TX_TYPES } from "../../services/constants";
import * as portfolioService from "../../services/portfolioService";
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
      loadingPagination: false,
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
    this.clearFetchingInterval();
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
    
    if (!this.props.address) {
      this.clearFetchingInterval();
      return;
    }
  
    this.setState({ loadingHistory: true });
    let { data, totalTxs, inQueue, isError } = await portfolioService.fetchAddressTxs(address, page, limit);
    
    this.setState({ loadingError: isError });
    
    if (isError) {
      this.setState({
        loadingHistory: false,
        loadingPagination: false,
      });
      this.clearFetchingInterval();
      return;
    }

    if (inQueue) {
      if (this.fetchingTxsInterval === null) {
        this.fetchingTxsInterval = setInterval(async () => {
          await this.setTxHistory(page, limit);
        }, 2000);
      }
      
      return;
    }
    
    this.clearFetchingInterval();

    data = this.reduceTxs(data);

    this.setState({
      historyTxs: data,
      loadingHistory: false,
      loadingPagination: false,
      totalTxs: totalTxs,
      pageTotal: Math.ceil(totalTxs / limit)
    });
  }
  
  clearFetchingInterval() {
    clearInterval(this.fetchingTxsInterval);
    this.fetchingTxsInterval = null;
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
      if (tx.type === TX_TYPES.send || tx.type === TX_TYPES.receive) {    
        if (tx.type === TX_TYPES.send) {
          return this.renderSendTx(tx, index);
        } else {
          return this.renderReceiveTx(tx, index);
        }
      } else if (tx.type === TX_TYPES.swap) {        
        return this.renderSwapTx(tx, index);
      } else if (tx.type === TX_TYPES.approve) {
        return this.renderApproveTx(tx, index);
      } else if (tx.type === TX_TYPES.undefined) {
        return this.renderUndefinedTx(tx, index);
      }
      
      return null;
    })
  }
  
  renderSendTx(tx, index) {
    const transferTokenSymbol = this.state.tokenAddresses[tx.transfer_token_address.toLowerCase()];
    let transferTokenDecimal, transferValue

    if(transferTokenSymbol){
      transferTokenDecimal = this.getTokenDecimal(transferTokenSymbol);
      transferValue = this.formatTxValue(tx.transfer_token_value, transferTokenDecimal);
    }
    
    return (
      <a href={`${BLOCKCHAIN_INFO.ethScanUrl}tx/${tx.hash}`} target="_blank" className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon portfolio__tx-icon--send"}/>
          <div className={"portfolio__tx-content"}>
            <div className="common__flexbox-normal">
              <div className={"portfolio__tx-bold common__mr-15"}>- {transferTokenSymbol ? `${transferValue} ${transferTokenSymbol}` : formatAddress(tx.transfer_token_address, 4, -4)} </div>
              <div className={"common__small-text theme__text-7"}>{tx.time}</div>
            </div>
            <div className={"portfolio__tx-light theme__text-7"}>
              {this.props.translate('transaction.exchange_to') || 'To'}: {formatAddress(tx.transfer_to, 20)}
            </div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>{this.props.translate('send') || 'Send'}</div>
          {tx.isError && (
            <div className={"portfolio__tx-type common__error-text"}>{this.props.translate('failed') || 'Failed'}</div>
          )}
        </div>
      </a>
    )
  }
  
  renderReceiveTx(tx, index) {
    const transferTokenSymbol = this.state.tokenAddresses[tx.transfer_token_address.toLowerCase()];
    let transferTokenDecimal, transferValue

    if(transferTokenSymbol){
      transferTokenDecimal = this.getTokenDecimal(transferTokenSymbol);
      transferValue = this.formatTxValue(tx.transfer_token_value, transferTokenDecimal);
    }

    return (
      <a href={`${BLOCKCHAIN_INFO.ethScanUrl}tx/${tx.hash}`} target="_blank" className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon portfolio__tx-icon--receive"}/>
          <div className={"portfolio__tx-content"}>
            <div className="common__flexbox-normal">
              <div className={"portfolio__tx-bold common__mr-15"}>+ {transferTokenSymbol ? `${transferValue} ${transferTokenSymbol}` : formatAddress(tx.transfer_token_address, 4, -4)}</div>
              <div className={"common__small-text theme__text-7"}>{tx.time}</div>
            </div>
            <div className={"portfolio__tx-light theme__text-7"}>
              {this.props.translate('transaction.exchange_from') || 'From'}: {formatAddress(tx.transfer_from, 20)}
            </div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>{this.props.translate('transaction.exchange_receive') || 'Receive'}</div>
          {tx.isError && (
            <div className={"portfolio__tx-type common__error-text"}>{this.props.translate('failed') || 'Failed'}</div>
          )}
        </div>
      </a>
    )
  }
  
  renderApproveTx(tx, index) {
    const approveTokenSymbol = this.state.tokenAddresses[tx.approve_token_address.toLowerCase()];
    return (
      <a href={`${BLOCKCHAIN_INFO.ethScanUrl}tx/${tx.hash}`} target="_blank" className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon portfolio__tx-icon--approve"}/>
          <div className={"portfolio__tx-content"}>
            <div className="common__flexbox-normal">
              <div className={"portfolio__tx-light theme__text-7 common__mr-15"}>
                {this.props.translate('portfolio.token_approved') || 'Token Approved'}
              </div>
              <div className={"common__small-text theme__text-7"}>{tx.time}</div>
            </div>
            <div className={"portfolio__tx-bold"}>
              {`${tx.formattedAllowance} ${this.props.translate('portfolio.token_is_approved', { token: approveTokenSymbol || formatAddress(tx.approve_token_address, 4, -4 ), contract: tx.formattedContract }) || `${approveTokenSymbol || formatAddress(tx.approve_token_address, 4, -4 )} is Approved for ${tx.formattedContract}`}`}
            </div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>{this.props.translate('modal.approve') || 'Approve'}</div>
          {tx.isError && (
            <div className={"portfolio__tx-type common__error-text"}>{this.props.translate('failed') || 'Failed'}</div>
          )}
        </div>
      </a>
    )
  }
  
  renderSwapTx(tx, index) {
    const srcSymbol = this.state.tokenAddresses[tx.swap_source_token.toLowerCase()];
    const destSymbol = this.state.tokenAddresses[tx.swap_dest_token.toLowerCase()];

    let srcDecimal, destDecimal, srcValue, destValue
    if(srcSymbol){
      srcDecimal = this.getTokenDecimal(srcSymbol);
      srcValue = this.formatTxValue(tx.swap_source_amount, srcDecimal);
    }

    if(destSymbol){
      destDecimal = this.getTokenDecimal(destSymbol); 
      destValue = this.formatTxValue(tx.swap_dest_amount, destDecimal);
    }
    
    
    return (
      <a href={`${BLOCKCHAIN_INFO.ethScanUrl}tx/${tx.hash}`} target="_blank" className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon portfolio__tx-icon--swap"}/>
          <div className={"portfolio__tx-content"}>
            <div className="common__flexbox-normal">
              <div className={"portfolio__tx-bold common__mr-15"}>
                {srcSymbol? `${srcValue} ${srcSymbol}` : formatAddress(tx.swap_source_token, 4, -4)} ➞ {destSymbol ? `${destValue} ${destSymbol}` : formatAddress(tx.swap_dest_token, 4, -4)}
              </div>
              <div className={"common__small-text theme__text-7"}>{tx.time}</div>
            </div>
            {srcSymbol && destSymbol && <div className={"portfolio__tx-light theme__text-7"}>
              1 {srcSymbol} = {roundingNumber(divOfTwoNumber(destValue, srcValue))} {destSymbol}
            </div>}
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>{this.props.translate('transaction.swap') || 'Swap'}</div>
          {tx.isError && (
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
  
  renderUndefinedTx(tx, index) {
    return (
      <a href={`${BLOCKCHAIN_INFO.ethScanUrl}tx/${tx.hash}`} target="_blank" className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon"}/>
          <div className={"portfolio__tx-content"}>
            <div className="common__flexbox-normal">
              <div className={"portfolio__tx-bold common__mr-15"}>
                {this.props.translate('portfolio.to_contract') || 'To Contract'}
              </div>
              <div className={"common__small-text theme__text-7"}>{tx.time}</div>
            </div>
            <div className={"portfolio__tx-light theme__text-7"}>{formatAddress(tx.to, 20)}</div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>{this.props.translate('portfolio.interact_contract') || 'Interact Contract'}</div>
          {tx.isError && (
            <div className={"portfolio__tx-type common__error-text"}>{this.props.translate('failed') || 'Failed'}</div>
          )}
        </div>
      </a>
    )
  }
  
  onPageChanged = (page) => {
    this.setState({
      currentPage: page,
      loadingPagination: true,
    });
    this.setTxHistory(page, this.state.limit);
    window.scrollTo({ top: 0 });
  };
  
  onLimitChanged = (limit) => {
    this.setState({
      limit: limit,
      currentPage: 1,
      loadingPagination: true
    });
    this.setTxHistory(1, limit);
  };
  
  render() {
    const firstTimeLoading = this.state.loadingHistory && !this.state.loadingPagination;
    return (
      <div className={"portfolio__history portfolio__item common__slide-up theme__background-2"}>
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
        
        <div className={`portfolio__history-content ${this.state.loadingPagination ? 'portfolio__history-content--disabled' : ''}`}>
          {firstTimeLoading && (
            <InlineLoading theme={this.props.theme}/>
          )}
          
          {!firstTimeLoading && this.renderTransactionHistory()}
        </div>
        
        {(!this.state.loadingError && !isEmpty(this.state.historyTxs) && this.state.pageTotal > 1) && (
          <PaginationList
            total={this.state.pageTotal}
            currentPage={this.state.currentPage}
            onPageChanged={this.onPageChanged}
            loading={this.state.loadingPagination}
          />
        )}
      </div>
    )
  }
}
