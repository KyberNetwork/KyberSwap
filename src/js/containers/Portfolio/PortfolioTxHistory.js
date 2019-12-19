import React from "react"
import BLOCKCHAIN_INFO from "../../../../env";
import { groupBy, isEmpty } from "underscore";
import {decodeTxInput, divOfTwoNumber, roundingNumber, toT} from "../../utils/converter";
import { ERC20 } from "../../services/constants";

const PortfolioTxHistory = (props) => {
  function formatValueAndTokenSymbol(value, tokenSymbol, tokenDecimal) {
    return {
      txValue: +toT(value, tokenDecimal ? tokenDecimal : 18, 6),
      txTokenSymbol: tokenSymbol ? tokenSymbol : 'ETH'
    }
  }
  
  function renderTransactionHistory() {
    const txs = props.historyTxs;
    
    if (isEmpty(txs)) {
      return <div className={"portfolio__not-found"}>No Transaction Found...</div>
    }
    
    return Object.keys(txs).map((date, index) => {
      return (
        <div className={"portfolio__tx"} key={index}>
          <div className={"portfolio__tx-header theme__table-header"}>{date}</div>
          {renderTxByDate(txs[date])}
        </div>
      )
    });
  }
  
  function renderTxByDate(txs) {
    txs = groupBy(txs, (tx) => {
      return tx.hash;
    });
    
    return Object.keys(txs).map((hash, index) => {
      if (txs[hash].length === 1) {
        const tx = txs[hash][0];
        const { txValue, txTokenSymbol } = formatValueAndTokenSymbol(tx.value, tx.tokenSymbol, tx.tokenDecimal);
        
        if (tx.from === props.address && txValue) {
          return renderSendTx(txValue, txTokenSymbol, tx.to, index);
        } else if (tx.to === props.address && txValue) {
          return renderReceiveTx(txValue, txTokenSymbol, tx.from, index);
        } else if (tx.from === props.address && !txValue) {
          const decodedInput = decodeTxInput(tx.input, ERC20);
          
          if (decodedInput && decodedInput.name === 'approve') {
            const approvedTokenSymbol = props.tokenAddresses[tx.to];
            if (approvedTokenSymbol) return renderApproveTx(approvedTokenSymbol, index);
          }
        }
        
        return null;
      }
      
      const txData = {};
      
      txs[hash].forEach((tx) => {
        const { txValue, txTokenSymbol } = formatValueAndTokenSymbol(tx.value, tx.tokenSymbol, tx.tokenDecimal);
        
        if (tx.from === props.address && !txData.send && txValue) {
          txData.send = {txValue, txTokenSymbol, address: tx.to};
        } else if (tx.to === props.address && !txData.receive && txValue) {
          txData.receive = {txValue, txTokenSymbol, address: tx.from};
        }
      });
      
      const receiveData = txData.receive;
      const sendData = txData.send;
      
      if (!sendData && receiveData) {
        return renderReceiveTx(receiveData.txValue, receiveData.txTokenSymbol, receiveData.address, index);
      } else if (!receiveData && sendData) {
        return renderSendTx(sendData.txValue, sendData.txTokenSymbol, sendData.address, index);
      } else if (receiveData && sendData) {
        if (sendData.address === BLOCKCHAIN_INFO.kyberswapAddress) {
          return renderLimitOrderTx(sendData.txValue, sendData.txTokenSymbol, receiveData.txValue, receiveData.txTokenSymbol, index);
        }
        
        return renderSwapTx(sendData.txValue, sendData.txTokenSymbol, receiveData.txValue, receiveData.txTokenSymbol, index);
      }
    })
  }
  
  function renderSendTx(txValue, txTokenSymbol, txTo, index) {
    return (
      <div className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon portfolio__tx-icon--send"}/>
          <div className={"portfolio__tx-content"}>
            <div className={"portfolio__tx-bold"}>- {txValue} {txTokenSymbol}</div>
            <div className={"portfolio__tx-light theme__text-7"}>To: {txTo}</div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>Send</div>
        </div>
      </div>
    )
  }
  
  function renderReceiveTx(txValue, txTokenSymbol, txFrom, index) {
    return (
      <div className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon portfolio__tx-icon--receive"}/>
          <div className={"portfolio__tx-content"}>
            <div className={"portfolio__tx-bold"}>+ {txValue} {txTokenSymbol}</div>
            <div className={"portfolio__tx-light theme__text-7"}>From: {txFrom}</div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>Receive</div>
        </div>
      </div>
    )
  }
  
  function renderApproveTx(txTokenSymbol, index) {
    return (
      <div className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon portfolio__tx-icon--approve"}/>
          <div className={"portfolio__tx-content"}>
            <div className={"portfolio__tx-light theme__text-7"}>Token Approved</div>
            <div className={"portfolio__tx-bold"}>{txTokenSymbol} is Approved</div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>Approve</div>
        </div>
      </div>
    )
  }
  
  function renderSwapTx(sendValue, sendTokenSymbol, receiveValue, receiveTokenSymbol, index) {
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
          <div className={"portfolio__tx-type"}>Swap</div>
        </div>
      </div>
    )
  }
  
  function renderLimitOrderTx(sendValue, sendTokenSymbol, receiveValue, receiveTokenSymbol, index) {
    return (
      <div className={"portfolio__tx-body theme__table-item"} key={index}>
        <div className={"portfolio__tx-left"}>
          <div className={"portfolio__tx-icon portfolio__tx-icon--limit-order"}/>
          <div className={"portfolio__tx-content"}>
            <div className={"portfolio__tx-light theme__text-7"}>Limit Order Triggered</div>
            <div className={"portfolio__tx-bold"}>
              {sendValue} {sendTokenSymbol} ➞ {receiveValue} {receiveTokenSymbol}
            </div>
          </div>
        </div>
        <div className={"portfolio__tx-right"}>
          <div className={"portfolio__tx-type"}>Limit Order</div>
        </div>
      </div>
    )
  }
  
  return (
      <div className={"portfolio__history portfolio__item theme__background-2"}>
        <div className={"portfolio__title"}>Transaction History</div>
        <div className={"portfolio__history-content"}>
          {props.historyTxs && renderTransactionHistory()}
        </div>
      </div>
  )
};

export default PortfolioTxHistory
