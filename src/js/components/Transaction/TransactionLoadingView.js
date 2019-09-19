import React from "react"
import { roundingNumber } from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env"
import ReactTooltip from 'react-tooltip'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { getAssetUrl } from "../../utils/common"

const TransactionLoadingView = (props) => {
  const isBroadcasting = props.broadcasting;
  const broadcastError = props.error;
  const isTxFailed = props.status === "failed";

  if (isBroadcasting) {
    return (
      <div>
        <div className="title">
          {broadcastError  &&
          <div>
            <div className="icon icon--failed"/>
            <div className="title-status">{ props.translate('transaction.failed') || "Failed!" }</div>
          </div>
          }
          {!broadcastError &&
          <div>
            <div className="icon icon--broadcasted"/>
            <div className="title-status">{ props.translate('transaction.broadcasting') || "Broadcasting!" }</div>
          </div>
          }
        </div>
        <a className="x" onClick={() => props.makeNewTransaction()}>&times;</a>
        <div className="content with-overlap tx-loading">
          <div className="row">
            <ul class="broadcast-steps">
              {!broadcastError &&
              <li class="pending">
                <h4 class="font-w-b">{props.translate("transaction.broadcasting_blockchain") || "Broadcasting the transaction to the blockchain"}
                </h4>
              </li>
              }
              {broadcastError &&
              <li class="failed">
                <h4 class="font-w-b">{props.translate("transaction.cound_not_broadcast") || "Couldn't broadcast your transaction to the blockchain"}</h4>
                <div class="reason">{broadcastError}</div>
              </li>
              }
            </ul>
          </div>
        </div>
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
    props.debug.debugError()
  }

  var getTooltipCopy = () => {
    return props.isCopied ?
      (props.translate("transaction.copied") || "Copied!") :
      (props.translate("transaction.copy_tx") || "Copy transaction hash")
  }

  var getError = () => {
    let reason = "";

    if (props.debug.isDebuging && !props.debug.isDebugComplete) {
      reason = (
        <div className="analyze-panel loading">
          <div className="common__circle-loading"/>
        </div>
      )
    }

    if (!props.debug.isDebuging && props.debug.isDebugComplete) {
      let txDebuggerUrl = `https://developer.kyber.network/tx-diagnose/${props.txHash}`;
      if (BLOCKCHAIN_INFO.chainName !== 'Mainnet') txDebuggerUrl += `/${BLOCKCHAIN_INFO.chainName.toLowerCase()}`;
      const txDebuggerLink = <a className={"analyze-link"} href={txDebuggerUrl} target="_blank">{props.translate("more_info") || "More Info"}</a>

      if (Object.keys(props.debug.errorTx).length === 0){
        reason = <div className="analyze-panel">
          <div className="empty-error">{props.translate("transaction.error_no_reason")
          || "Cannot find any reason for your failed transaction. Please try again in a while"}</div>
          {txDebuggerLink}
        </div>
      }else{
        reason =
          <div className="analyze-panel">{
            Object.keys(props.debug.errorTx).map(key => {
              return <div key={key}>{props.debug.errorTx[key]}</div>
            })}
            {txDebuggerLink}
          </div>
      }
    }

    return reason
  }

  return (
    <div>
      <div className="title">
        {props.status === "success" &&
        <div>
          <div className="icon icon--success"/>
          <div className="title">{props.translate('transaction.done') || "Done"}</div>
        </div>
        }
        {isTxFailed &&
        <div>
          <div className="icon icon--failed"/>
          <div className="title">{ props.translate('transaction.failed') || "Failed!" }</div>
        </div>
        }
        {props.status === "pending" &&
        <div>
          <div className="icon icon--broadcasted"/>
          <div className="title">{ props.translate('transaction.broadcasted') || "Broadcasted!" }</div>
        </div>
        }
      </div>
      <a className="x" onClick={() => props.makeNewTransaction()}>&times;</a>
      <div className="content with-overlap">
        <div className="row">
          <div class="info tx-title">
            <div className="tx-title-text">{props.translate("transaction.transaction") || "Transaction hash"}</div>
            <div className={`tx-hash ${isTxFailed ? "tx-hash--error" : ""}`}>
              <a class="text-light" href={BLOCKCHAIN_INFO.ethScanUrl + 'tx/' + props.txHash} target="_blank"
                 title={props.translate("modal.view_on_etherscan") || "View on Etherscan"} onClick={(e) => props.analytics.callTrack("trackClickViewTxOnEtherscan")}>
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
            <div className="tx-explorer">
              <a href={BLOCKCHAIN_INFO.ethScanUrl + 'tx/' + props.txHash} target="_blank" >
                <img  src={getAssetUrl(`utils/etherscan_explorer.svg`)}/>
                <span>{props.translate("transaction.etherscan_explorer") || "View on etherscan"}</span>
              </a>
              <a href={BLOCKCHAIN_INFO.enjinx + 'eth/transaction/' + props.txHash} target="_blank" >
                <img  src={getAssetUrl(`utils/kyber_explorer.svg`)}/>
                <span>{props.translate("transaction.kyber_explorer") || "View on kyber.enjinx"}</span>
              </a>
            </div>
          </div>
          <ul class="broadcast-steps">
            {props.status === "success" &&
              <li class={props.status}>
                <div>
                  <div>
                    {props.type === "swap" &&
                    <div>
                      <div className="title final-status">{ props.translate('transaction.success_swap_msg') || "Successfully swapped" }</div>
                      <div className="content">
                          <span>
                            <strong>{displayRoundingNumber(props.balanceInfo.sourceAmount)} {props.balanceInfo.sourceTokenSymbol}</strong>
                          </span>
                        <span> {props.translate('transaction.to') || "to"} </span>
                        <span><strong>{displayRoundingNumber(props.balanceInfo.destAmount)} {props.balanceInfo.destTokenSymbol}</strong></span>
                      </div>
                    </div>
                    }
                    {props.type === "transfer" &&
                    <div>
                      <div className="title final-status">{ props.translate('transaction.success_transfer_msg') || "Successfully transferred" }</div>
                      <div className="content">
                              <span>
                              <strong>{displayRoundingNumber(props.balanceInfo.amount)} {props.balanceInfo.tokenSymbol}</strong>
                              </span>
                        <span> {props.translate('transaction.to') || "to"} </span>
                        <span><strong>{props.balanceInfo.address}</strong></span>
                      </div>
                    </div>
                    }
                  </div>
                </div>
              </li>
            }

            {isTxFailed &&
              <li class={props.status}>
                <div>
                  {props.type==="swap" && (
                    <div>
                      <h4 class="font-w-b d-inline-blocka analyze-btn" onClick={(e) => handleAnalyze(e)}>
                        {props.translate("transaction.transaction_error") || "Transaction error"}
                      </h4>
                      <div className="list-err">
                        {getError()}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            }

            {props.status === "pending" &&
              <li class={props.status}>
                <div class="common__circle-loading"/>
                <div className={"tx-waiting-text"}>{props.translate("transaction.waiting_transaction") || "Waiting for your transaction to be mined"}</div>
              </li>
            }
          </ul>
        </div>
      </div>
      {!isTxFailed && (
        <div className="tx-actions">
          <a className={"change-path"} onClick={() => props.makeNewTransaction(true)}>
            {props.type === "swap" ? (props.translate("transaction.transfer") || "Transfer") : (props.translate("transaction.swap") || "Swap") }
          </a>
          <a className="new-transaction" onClick={() => props.makeNewTransaction()}>
            {props.type === "swap" ?
              props.translate("transaction.new_ex") || "New swap"
              : props.translate("transaction.new_tx") || "New transfer"}
          </a>
        </div>
      )}
      {isTxFailed && (
        <div className={"tx-actions tx-actions--error"}>
          <a className="new-transaction" onClick={() => props.makeNewTransaction()}>{props.translate("transaction.try_again") || "Try Again"}</a>
        </div>
      )}
    </div>
  )
}

export default TransactionLoadingView
