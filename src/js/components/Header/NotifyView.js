import React, { Fragment } from "react"
import BLOCKCHAIN_INFO from "../../../../env"
import Menu, {SubMenu, MenuItem} from 'rc-menu';

const Notify = (props) => {
  var classNotify = ""
  if (!props.displayTrans) {
    classNotify += "hide"
  }
  var counter = ""
  if (props.transactionsNum !== 0) {
    counter = <span class="counter">{props.transactionsNum}</span>
  } else {
    classNotify += " empty"
  }

  function hashDetailLink(hash) {
    const url = BLOCKCHAIN_INFO.ethScanUrl + 'tx/'
    return url + hash
  }


  function createRecap(type, data) {
    if (type == "exchange") {
      return (
        <div class="title">
          <span class="amount">{data.sourceAmount.slice(0, 8)} {data.sourceTokenSymbol}&nbsp;</span>
          {props.translate("transaction.for") || "for"}
          <span class="amount">&nbsp;{data.destAmount.slice(0, 7)} {data.destTokenSymbol}</span>
        </div>
      )
    } else if (type == "transfer") {
      return (
        <div class="title">
          <span class="amount">{data.amount.slice(0, 8)} {data.tokenSymbol}&nbsp;</span>
          {props.translate("transaction.to") || "to"}
          <span class="amount">&nbsp;{data.destAddress.slice(0, 8)}...{data.destAddress.slice(-6)}</span>
        </div>
      )
    } else {
      return '';
    }
  }

  const transactions = Object.keys(props.txs).map((hash) => {
    var classTx = "pending"
    switch (props.txs[hash].status) {
      case "success":
        classTx = "success"
        break
      case "fail":
      case "failed":
        classTx = "failed"
        break
      default:
        classTx = "pending"
        break
    }
    var tx = props.txs[hash]

    if(tx && tx.error == "transaction.error_tx_log" && classTx === "failed"){
      return (
        <li key={hash}>
          <a class={classTx} href={hashDetailLink(tx.hash)} target="_blank">
            <div class="title"><span class="amount">{createRecap(tx.type, tx.data)}</span></div>
  
            <div class="link">{tx.hash.slice(0, 10)} ... {tx.hash.slice(-6)}</div>
            {/* <div class="reason">{props.translate(tx.error || tx.errorInfo) || "Transaction is not mined"}</div> */}
            
          </a>
          <button className="analyze" onClick={(e) => props.handleAnalyze(tx.hash)}>
              {props.translate('transaction.analyze') || "Show reasons"}
          </button>
        </li>
      )
    } else {
      return (
        <li key={hash}>
          <a class={classTx} href={hashDetailLink(tx.hash)} target="_blank">
            <div class="title"><span class="amount">{createRecap(tx.type, tx.data)}</span></div>
  
            <div class="link">{tx.hash.slice(0, 10)} ... {tx.hash.slice(-6)}</div>
            {classTx === "failed" &&
              <div class="reason">{props.translate(tx.error || tx.errorInfo) || "Transaction is not mined"}</div>
            }
          </a>
        </li>
      )
    }
  });

  return (
    <Fragment>
      <a className="notifications-toggle" href="#notifications" onClick={(e) => props.displayTransactions(e)}>
        <img src={require('../../../assets/img/menu.svg')} />{counter}
      </a>
      <ul className={"notifications animated fadeIn " + classNotify}>
        {transactions}
        {props.transactionsNum === 0 &&
          <li className="empty">
            <img src={require('../../../assets/img/empty.svg')} />
            <p>{props.translate('transaction.no_pedding_tx') || 'No pending transaction'}</p>
          </li>
        }
      </ul>
      </Fragment>
  )
}

export default Notify