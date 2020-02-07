import React from "react"
import BLOCKCHAIN_INFO from "../../../../env";
import { groupBy, isEmpty, sortBy } from "underscore";
import {decodeTxInput, divOfTwoNumber, roundingNumber, toT} from "../../utils/converter";
import { ERC20 } from "../../services/constants";
import * as etherScanService from "../../services/etherscan/etherScanService";
import { getFormattedDate } from "../../utils/common";
import InlineLoading from "../../components/CommonElement/InlineLoading";
import PaginationList from "../../components/CommonElement/PaginationList";

export default class PortfolioTxHistory extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      historyTxs: {},
      loadingHistory: false,
      loadingError: false
    }
  }
  
  componentDidMount() {
    this.setTxHistory();
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.address !== prevProps.address) {
      this.setTxHistory();
    }
  }
  
  async setTxHistory() {
    const address = this.props.address;
    
    if (!this.props.address) return;
  
    this.setState({ loadingHistory: true });
    
    const normalTxs = await etherScanService.fetchNormalTransactions(address);
    const internalTxs = await etherScanService.fetchInternalTransactions(address);
    const erc20Txs = await etherScanService.fetchERC20Transactions(address);
    
    let txs = normalTxs.concat(internalTxs).concat(erc20Txs);
    txs = this.reduceTxs(txs);
    
    this.setState({
      historyTxs: txs,
      loadingHistory: false
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
  
  formatValueAndTokenSymbol(value, tokenSymbol, tokenDecimal) {
    return {
      txValue: +toT(value, tokenDecimal ? tokenDecimal : 18, 6),
      txTokenSymbol: tokenSymbol ? tokenSymbol : 'ETH'
    }
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
    txs = groupBy(txs, (tx) => {
      return tx.hash;
    });
    
    return Object.keys(txs).map((hash, index) => {
      if (txs[hash].length === 1) {
        const tx = txs[hash][0];
        const { txValue, txTokenSymbol } = this.formatValueAndTokenSymbol(tx.value, tx.tokenSymbol, tx.tokenDecimal);
        
        if (tx.from === this.props.address && txValue) {
          return this.renderSendTx(txValue, txTokenSymbol, tx.to, index);
        } else if (tx.to === this.props.address && txValue) {
          return this.renderReceiveTx(txValue, txTokenSymbol, tx.from, index);
        } else if (tx.from === this.props.address && !txValue) {
          const decodedInput = decodeTxInput(tx.input, ERC20);
          
          if (decodedInput && decodedInput.name === 'approve') {
            const approvedTokenSymbol = this.props.tokenAddresses[tx.to];
            if (approvedTokenSymbol) return this.renderApproveTx(approvedTokenSymbol, index);
          }
        }
        
        return null;
      }
      
      const txData = {};
      
      txs[hash].forEach((tx) => {
        const { txValue, txTokenSymbol } = this.formatValueAndTokenSymbol(tx.value, tx.tokenSymbol, tx.tokenDecimal);
        
        if (tx.from === this.props.address && !txData.send && txValue) {
          txData.send = {txValue, txTokenSymbol, address: tx.to};
        } else if (tx.to === this.props.address && !txData.receive && txValue) {
          txData.receive = {txValue, txTokenSymbol, address: tx.from};
        }
      });
      
      const receiveData = txData.receive;
      const sendData = txData.send;
      
      if (!sendData && receiveData) {
        return this.renderReceiveTx(receiveData.txValue, receiveData.txTokenSymbol, receiveData.address, index);
      } else if (!receiveData && sendData) {
        return this.renderSendTx(sendData.txValue, sendData.txTokenSymbol, sendData.address, index);
      } else if (receiveData && sendData) {
        if (sendData.address === BLOCKCHAIN_INFO.kyberswapAddress) {
          return this.renderLimitOrderTx(sendData.txValue, sendData.txTokenSymbol, receiveData.txValue, receiveData.txTokenSymbol, index);
        }
        
        return this.renderSwapTx(sendData.txValue, sendData.txTokenSymbol, receiveData.txValue, receiveData.txTokenSymbol, index);
      }
    })
  }
  
  renderSendTx(txValue, txTokenSymbol, txTo, index) {
    return (
      <div className={"portfolio__tx-body theme__table-item"} key={index}>
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
      </div>
    )
  }
  
  renderReceiveTx(txValue, txTokenSymbol, txFrom, index) {
    return (
      <div className={"portfolio__tx-body theme__table-item"} key={index}>
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
      </div>
    )
  }
  
  renderApproveTx(txTokenSymbol, index) {
    return (
      <div className={"portfolio__tx-body theme__table-item"} key={index}>
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
      </div>
    )
  }
  
  renderSwapTx(sendValue, sendTokenSymbol, receiveValue, receiveTokenSymbol, index) {
    return (
      <div className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon portfolio__tx-icon--swap"}/>
          <div className={"portfolio__tx-content"}>
            <div className={"portfolio__tx-bold"}>
              {sendValue} {sendTokenSymbol} ➞ {receiveValue} {receiveTokenSymbol}
            </div>
            <div className={"portfolio__tx-light theme__text-7"}>
              1 {sendTokenSymbol} = {roundingNumber(divOfTwoNumber(receiveValue || 0, sendValue || 0))} {receiveTokenSymbol}
            </div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>{this.props.translate('transaction.swap') || 'Swap'}</div>
        </div>
      </div>
    )
  }
  
  renderLimitOrderTx(sendValue, sendTokenSymbol, receiveValue, receiveTokenSymbol, index) {
    return (
      <div className={"portfolio__tx-body theme__table-item"} key={index}>
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
      </div>
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
        
        <PaginationList
          total={1000}
          onPageChanged={() => alert(1)}
          loading={false}
        />
      </div>
    )
  }
}
