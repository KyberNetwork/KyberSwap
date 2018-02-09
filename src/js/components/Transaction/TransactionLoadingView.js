import React from "react"
import { roundingNumber } from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env"
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import AnalyzeLogModal from './AnalyzeLogModal'

const TransactionLoadingView = (props) => {
  if (props.broadcasting) {
    var classPending = !props.error ? " pulse" : ""
    return (
      <div>
        <div class="frame tx-loading">
          <div class="row">
            <div className="column">
              <h1 class="title">
                <Link to="/exchange" className={props.type === "exchange" ? "disable" : ""}>{props.translate("transaction.exchange") || "Exchange"}</Link>
                <Link to="/transfer" className={props.type === "transfer" ? "disable" : ""}>{props.translate("transaction.transfer") || "Transfer"}</Link>
              </h1>
            </div>
            <div class="text-center">
              <h1 class="title mb-0 font-w-b">
              {props.error? 
                props.translate("error.failed") || 'Failed!'
                : props.translate("transaction.broadcasting") || 'Broadcasting'}
              
              </h1>
              <ul class="broadcast-steps">
                {!props.error &&
                  <li class="pending">
                    <h4 class="font-w-b">{props.translate("transaction.broadcasting_blockchain") || "Broadcasting the transaction to the blockchain"}
                    </h4>
                  </li>
                }
                {props.error &&
                  <li class="failed">
                    <h4 class="font-w-b">{props.translate("transaction.cound_not_broadcast") || "Couldn't broadcast your transaction to the blockchain"}</h4>
                    <div class="reason">{props.error}</div>
                  </li>
                }
              </ul>
              <div class="text-center">
                <div className={"broadcast-animation"}>
                  {!props.error ? <img src={require('../../../assets/img/broadcast.svg')} /> : <img src={require('../../../assets/img/finish.svg')} />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="column small-11 medium-10 large-9 small-centered text-center">
            <a className="new-transaction" onClick={props.makeNewTransaction}>
              {props.type === "exchange"?
                props.translate("transaction.new_ex") || "New exchange"
                : props.translate("transaction.new_tx") || "New transfer"}
            </a>
          </div>
        </div>
      </div>
    )
  }

  var handleAnalyze = (e) => {
    props.analyze.action(e)
  }

  var getTooltipCopy = () => {
    return props.isCopied ? 
      (props.translate("transaction.copied") || "Copied!") :
      (props.translate("transaction.copy_tx") || "Copy transaction hash")
  }

  var analyzeBtn = ""
  if (props.type === "exchange") {
    analyzeBtn = (
      <a className="analyze" onClick={(e) => handleAnalyze(e)}>
        {props.translate('transaction.analyze') || "Show reasons"}
      </a>
    )
  }

  var estimateTime = props.progress.estimateTime
  var estimateSecond = Math.floor(estimateTime / 1000)
  var estimateMinute = Math.floor(estimateSecond / 60)
  var percentProgress = estimateTime === 0 ? 0 : Math.round(props.progress.currentTime/estimateTime * 100)
  return (
    <div>
      <div class="frame tx-loading">
        <div class="row small-11 medium-12 large-12">
          <div className="column">
            <h1 class="title">
              <Link to="/exchange" className={props.type === "exchange" ? "disable" : ""}>{props.translate("transaction.exchange") || "Exchange"}</Link>
              <Link to="/transfer" className={props.type === "transfer" ? "disable" : ""}>{props.translate("transaction.transfer") || "Transfer"}</Link>
            </h1>
          </div>
          <div class="text-center">
            <h1 class="title mb-0 font-w-b">
              {props.status === "success" && (props.translate('transaction.done') || "Done!")}
              {props.status === "failed" && (props.translate('transaction.failed') || "Failed!")}
              {props.status === "pending" && (props.translate('transaction.broadcasted') || "Broadcasted")}
            </h1>
            <div class="info text-light font-s-down-1 tx-title">
              <span className="font-w-b ">{props.translate("transaction.transaction") || "Transaction"}</span>
              <a class="text-light" href={BLOCKCHAIN_INFO.ethScanUrl + 'tx/' + props.txHash} target="_blank" 
              title={props.translate("modal.view_on_etherscan") || "View on Etherscan"} >
                {props.txHash.slice(0, 12)} ... {props.txHash.slice(-10)}
              </a>
              <a className="copy-tx" data-for='copy-tx-tip' data-tip=""
                onClick={props.handleCopy} 
                onMouseLeave={props.resetCopy} >
                <CopyToClipboard text={props.txHash}>
                  <img src={require("../../../assets/img/copy.svg")} />
                </CopyToClipboard>
              </a>
              <ReactTooltip getContent={[() => getTooltipCopy()]} place="right" id="copy-tx-tip" type="light"/>
            </div>
            <ul class="broadcast-steps">
              {props.status === "success" &&
                <li class={props.status}>
                  <h4 class="text-success font-w-b">
                    {props.type === "exchange" && 
                      (props.translate("transaction.success_ex_msg", {source: props.balanceInfo.sourceSymbol, dest: props.balanceInfo.destSymbol}) 
                      ||`Successfully exchanged from ${props.balanceInfo.sourceSymbol} to ${props.balanceInfo.destSymbol}`)
                    }
                    {props.type === "transfer" && 
                      (props.translate("transaction.success_tx_msg", {token: props.balanceInfo.tokenSymbol, address: props.address}) ||
                      `Successfully transferred ${props.balanceInfo.tokenSymbol} to ${props.address}`)
                    }
                  </h4>
                  {props.type === "exchange" &&
                    <ul class="address-balances text-white">
                      <li class="text-left">
                        <span class="name">{props.balanceInfo.sourceSymbol}</span>
                        <span class="balance" title={props.balanceInfo.sourceAmount.prevValue}>{roundingNumber(props.balanceInfo.sourceAmount.prevValue)}</span>
                        <i className="k k-arrow"></i>
                        <span class="balance" title={props.balanceInfo.sourceAmount.nextValue}>{roundingNumber(props.balanceInfo.sourceAmount.nextValue)}</span>
                      </li>
                      <li class="text-left">
                        <span class="name">{props.balanceInfo.destSymbol}</span>
                        <span class="balance" title={props.balanceInfo.destAmount.prevValue}>{roundingNumber(props.balanceInfo.destAmount.prevValue)}</span>
                        <i className="k k-arrow"></i>
                        <span class="balance font-w-b" title={props.balanceInfo.destAmount.nextValue}>{roundingNumber(props.balanceInfo.destAmount.nextValue)}</span>
                      </li>
                    </ul>
                  }
                  {props.type === "transfer" &&
                    <ul class="address-balances text-white">
                      <li class="text-left">
                        <span class="name">{props.balanceInfo.tokenSymbol}</span>
                        <span class="balance" title={props.balanceInfo.amount.prev}>{roundingNumber(props.balanceInfo.amount.prev)}</span>
                        <i className="k k-arrow"></i>
                        <span class="balance font-w-b" title={props.balanceInfo.amount.next}>{roundingNumber(props.balanceInfo.amount.next)}</span>
                      </li>
                    </ul>
                  }
                </li>
              }
              {props.status === "failed" &&
                <li class={props.status}>
                  <h4 class="font-w-b d-inline-block">
                    <img src={require("../../../assets/img/error.svg")} />
                    {props.translate("transaction.transaction_error") || "Transaction error"}
                  </h4>
                  {analyzeBtn}
                </li>
              }
              {props.status === "pending" &&
                <li class={props.status}>
                  <h4 class="font-w-b">{props.translate("transaction.waiting_transaction") || "Waiting for your transaction to be mined"}</h4>
                  <div>
                    <div class="text-center my-7">
                      <img src={require("../../../assets/img/spinner.svg")} width="60"/>
                    </div>
                    {props.progress.isShowInfo && 
                      <div class="text-white my-4">Due to network congrestion, transaction may take long time to proccess</div>
                    }
                    {!props.progress.isShowInfo && 
                      <div class="k-progress">
                        <img src={require('../../../assets/img/transaction.svg')} className="mr-4"/>
                        <div className="w-100">
                          <div class="text-right">Estimated Time: {estimateMinute} mins</div>
                          <div className="bar">
                            <div style={{animationDuration: estimateSecond + 's'}}></div>
                          </div>
                          <div className="text-left text-white">{percentProgress}% Completed</div>
                        </div>
                      </div>
                    }
                  </div>
                </li>
              }
            </ul>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="column small-11 medium-10 large-9 small-centered text-center">
          <a className="new-transaction" onClick={props.makeNewTransaction}>
            {props.type === "exchange"?
                props.translate("transaction.new_ex") || "New exchange"
                : props.translate("transaction.new_tx") || "New transfer"}
          </a>
        </div>
      </div>
    </div>
  )
}


export default TransactionLoadingView
