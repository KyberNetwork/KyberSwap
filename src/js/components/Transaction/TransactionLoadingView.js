import React from "react"
import { roundingNumber } from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env"
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import AnalyzeLogModal from './AnalyzeLogModal'

const TransactionLoadingView = (props) => {
  if (props.broadcasting) {
    var classPending = !props.error ? " pulse" : ""
    return (
      <div>
        <div className="title">
          {props.error ?
            props.translate("error.failed") || 'Failed!'
            : props.translate("transaction.broadcasting") || 'Broadcasting'}
        </div>
        <a className="x" onClick={(e) => props.onCancel(e)}>&times;</a>
        <div className="content with-overlap tx-loading">
          <div className="row">
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
                {!props.error ? <img src={require('../../../assets/img/broadcast.svg')} /> : <img src={require('../../../assets/img/error_state.svg')} />}
              </div>
            </div>
          </div>
        </div>
        {/* 
        <div class="frame tx-loading">
          <div class="row">
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
        </div> */}
      </div>
    )
  }

  var displayRoundingNumber = (amount) => {
    var roundingAmount = roundingNumber(amount)
    if (isNaN(roundingAmount)) {
      return roundingAmount
    }
    return +roundingAmount
  }

  var handleAnalyze = (e) => {
    props.analyze.action(e)
    // props.toogleModal()
  }

  var getTooltipCopy = () => {
    return props.isCopied ?
      (props.translate("transaction.copied") || "Copied!") :
      (props.translate("transaction.copy_tx") || "Copy transaction hash")
  }

  var classPending = props.status === "pending" ? " pulse" : ""
  // var analyzeBtn = ""

  // if (props.type === "exchange") {
  //   analyzeBtn = (
  //     <a className="analyze" onClick={(e) => handleAnalyze(e)}>
  //       {props.translate('transaction.analyze') || "Show reasons"}
  //     </a>
  //   )
  // }
  return (
    <div>
      <div className="title">
        {props.status === "success" &&
          <div>
            <div className="icon icon--success"></div>
            <div>{ props.translate('transaction.done') || "Success!" }</div>
          </div>
        }
        {props.status === "failed" &&
          <div>
            <div className="icon icon--failed"></div>
            <div>{ props.translate('transaction.failed') || "Failed!" }</div>
          </div>
        }
        {props.status === "pending" &&
          <div>
            <div className="icon icon--broadcasted"></div>
            <div>{ props.translate('transaction.broadcasted') || "Broadcasted!" }</div>
          </div>
        }
      </div>
      <a className="x" onClick={(e) => props.onCancel(e)}>&times;</a>
      <div className="content with-overlap">
        <div className="row">
          <div class="info tx-title">
            <div className="tx-title-text">{props.translate("transaction.transaction") || "Transaction hash"}</div>
            <div className="tx-hash">
              <a class="text-light" href={BLOCKCHAIN_INFO.ethScanUrl + 'tx/' + props.txHash} target="_blank"
                title={props.translate("modal.view_on_etherscan") || "View on Etherscan"} >
                {props.txHash}
              </a>
              <a className="copy-tx" data-for='copy-tx-tip' data-tip=""
                onClick={props.handleCopy}
                onMouseLeave={props.resetCopy} >
                <CopyToClipboard text={props.txHash}>
                  <img src={require("../../../assets/img/copy-address.svg")} />
                </CopyToClipboard>
              </a>
              <ReactTooltip getContent={[() => getTooltipCopy()]} place="right" id="copy-tx-tip" type="light" />
            </div>
          </div>
          <ul class="broadcast-steps">
            {props.status === "success" &&
              <li class={props.status}>
                <div>
                <div>
                  {props.type === "exchange" &&
                    <div>
                      <div className="title">Successfully exchanged from</div>
                      <div className="content">
                        <span>
                          <strong>{displayRoundingNumber(props.balanceInfo.sourceAmount)} {props.balanceInfo.sourceSymbol}</strong> 
                        </span>
                        <span> to </span>
                        <span><strong>{displayRoundingNumber(props.balanceInfo.destAmount)} {props.balanceInfo.destSymbol}</strong></span>
                      </div>
                    </div>
                  }
                  {props.type === "transfer" &&
                      <div>
                          <div className="title">Successfully transferred</div>
                          <div className="content">
                            <span>
                            <strong>{displayRoundingNumber(props.balanceInfo.amount)} {props.balanceInfo.tokenSymbol}</strong>
                            </span>
                            <span> to</span>
                            <span><strong>{props.address}</strong></span>
                          </div>                           
                      </div>
                  }
                </div>
                </div>
                {/* <div className="broadcast-img">
                  <img src={require('../../../assets/img/finish.svg')} />
                  <div>Done</div>
                </div> */}
              </li>
            }
            {props.status === "failed" &&
              <li class={props.status}>
                <div>
                  {props.type==="exchange" && (
                    <h4 class="font-w-b d-inline-blocka" onClick={(e) => handleAnalyze(e)}>                    
                      {props.translate("transaction.transaction_error") || "Transaction error"}
                    </h4>
                  )}                                    
                </div>
              </li>
            }
            {props.status === "pending" &&
              <li class={props.status}>
                <div>
                  <h4>
                    <p>{props.translate("transaction.waiting_transaction") || "Waiting for your transaction to be mined"}
                    </p>
                  </h4>
                </div>
              </li>
            }
          </ul>
        </div>
      </div>
      <div className="tx-actions">
        <a className="new-transaction" onClick={props.makeNewTransaction}>
          {props.type === "exchange" ?
            "New swap"
            : props.translate("transaction.new_tx") || "New transfer"}
        </a>
      </div>

      {/* <div class="frame tx-loading">
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
                      (props.translate("transaction.success_ex_msg", 
                      {sourceAmount: displayRoundingNumber(props.balanceInfo.sourceAmount), sourceSymbol: props.balanceInfo.sourceSymbol, 
                        destAmount: displayRoundingNumber(props.balanceInfo.destAmount), destSymbol: props.balanceInfo.destSymbol}) 
                      ||`Successfully exchanged from </br> ${displayRoundingNumber(props.balanceInfo.sourceAmount)} ${props.balanceInfo.sourceSymbol} to ${displayRoundingNumber(props.balanceInfo.destAmount)} ${props.balanceInfo.destSymbol}`)
                    }
                    {props.type === "transfer" && 
                      (props.translate("transaction.success_tx_msg", {amount: displayRoundingNumber(props.balanceInfo.amount), token: props.balanceInfo.tokenSymbol, address: props.address}) ||
                      `Successfully transferred </br> ${displayRoundingNumber(props.balanceInfo.amount)} ${props.balanceInfo.tokenSymbol} to ${props.address}`)
                    }
                  </h4>
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
                </li>
              }
            </ul>
            {classPending != "" ? (
              <div class="text-center">
                <div className={"broadcast-animation"}>
                  {!props.error ? <img src={require('../../../assets/img/broadcast.svg')} /> : <img src={require('../../../assets/img/finish.svg')} />}
                </div>
              </div>
            ) : ''
            }
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
      </div> */}
    </div>
  )
}


export default TransactionLoadingView
