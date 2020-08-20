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
      <div class="content-wrapper">
        <div>
          <div className="title">
            {broadcastError  &&
            <div className="broadcast-title-container">
              <div className="icon icon--failed"/>
              <div className="title-status">{props.translate('error_text') || "Error"}!</div>
            </div>
            }
            {!broadcastError &&
            <div className="broadcast-title-container">
              <div className="icon icon--broadcasted"/>
              <div className="title-status">{ props.translate('transaction.broadcasting') || "Broadcasting!" }</div>
            </div>
            }
          </div>
          <div className="x" onClick={() => props.makeNewTransaction()}>&times;</div>
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
                    <div className="description">{props.translate("transaction.cound_not_broadcast") || "Couldn't broadcast your transaction to the blockchain"}</div>
                    <div class="reason">{broadcastError}</div>
                  </li>
                  }
                </ul>
              </div>
            </div>
        </div>
        
        {isTxFailed && (
          <div className={"tx-actions tx-actions--error theme__background-2"}>
            <a className="new-transaction" onClick={() => props.makeNewTransaction()}>{props.translate("transaction.try_again") || "Try Again"}</a>
          </div>
        )}
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
        <div className="common__circle-loading"/>
      )
    }

    if (!props.debug.isDebuging && props.debug.isDebugComplete) {
      let txDebuggerUrl = `https://developer.kyber.network/tx-diagnose/${props.txHash}`;
      if (BLOCKCHAIN_INFO.chainName !== 'Mainnet') txDebuggerUrl += `/${BLOCKCHAIN_INFO.chainName.toLowerCase()}`;
      const txDebuggerLink = <a className={"analyze-link"} href={txDebuggerUrl} target="_blank">{props.translate("more_info") || "More Info"}</a>

      if (Object.keys(props.debug.errorTx).length === 0){
        reason = <div>
          <div className="analyze-description">{props.translate("transaction.error_no_reason")
          || "Cannot find any reason for your failed transaction. Please try again in a while"}</div>
          {txDebuggerLink}
        </div>
      }else{
        reason =
          <div>{
            Object.keys(props.debug.errorTx).map(key => {
              return <div className="analyze-description" key={key}>{props.debug.errorTx[key]}</div>
            })}
            {txDebuggerLink}
          </div>
      }
    }

    return reason;
  }

  return (
    <div className="content-wrapper">
      <div>
        <div className="title">
          {props.status === "success" &&
          <div className="broadcast-title-container">
            <div className="icon icon--success"/>
            <div className="status-title">{props.translate('transaction.done') || "Done"}</div>
          </div>
          }
          {isTxFailed &&
          <div className="broadcast-title-container">
            <div className="icon icon--failed"/>
            <div className="status-title">{ props.translate('transaction.failed') || "Failed!" }</div>
          </div>
          }
          {props.status === "pending" &&
          <div className="broadcast-title-container">
            <div className="icon icon--broadcasted"/>
            <div className="status-title">{ props.translate('transaction.broadcasted') || "Broadcasted!" }</div>
          </div>
          }
        </div>
        <div className="x" onClick={() => props.makeNewTransaction()}>&times;</div>
        <div className="content with-overlap theme__text-6">
          <div className="row">
            <div class="info tx-title theme__background-2">
              <div className="tx-title-text">{props.translate("transaction.transaction") || "Transaction hash"}:</div>
              <div className={`tx-hash ${isTxFailed ? "tx-hash--error" : ""}`}>
                <a class="text-light theme__text-6" href={BLOCKCHAIN_INFO.ethScanUrl + 'tx/' + props.txHash} target="_blank"
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
                <div>{props.translate("transaction.view_on") || "View on"}</div>
                <a href={BLOCKCHAIN_INFO.ethScanUrl + 'tx/' + props.txHash} target="_blank" >
                  <img  src={getAssetUrl(`utils/etherscan_explorer.svg`)}/>
                </a>
                <a href={BLOCKCHAIN_INFO.enjinx + 'eth/transaction/' + props.txHash} target="_blank" >
                  <img  src={getAssetUrl(`utils/kyber_explorer.svg`)}/>
                </a>
              </div>
            </div>
            <ul class="broadcast-steps">
              {props.status === "success" &&
                <li class={props.status}>
                    {props.type === "swap" && (
                      <div>
                        <div className="final-status">{ props.translate('transaction.success_swap_msg') || "Successfully swapped" }</div>
                        <div className="content">
                          <div>{displayRoundingNumber(props.balanceInfo.sourceAmount)} {props.balanceInfo.sourceTokenSymbol}</div>
                          <div className={"content__to"}>{props.translate('transaction.to') || "to"}</div>
                          <div>{displayRoundingNumber(props.balanceInfo.destAmount)} {props.balanceInfo.destTokenSymbol}</div>
                        </div>
                      </div>
                    )}
                    {props.type === "transfer" &&
                    <div>
                      <div className="final-status">{ props.translate('transaction.success_transfer_msg') || "Successfully transferred" }</div>
                      <div className="content">
                        <div>{displayRoundingNumber(props.balanceInfo.amount)} {props.balanceInfo.tokenSymbol}</div>
                        <div className={"content__to"}>{props.translate('transaction.to') || "to"}</div>
                        <div>
                          {props.balanceInfo.destEthName && (
                            <div>{props.balanceInfo.destEthName}</div>
                          )}
                          <div>{props.balanceInfo.address.substring(0, 8) + "..." + props.balanceInfo.address.substring(props.balanceInfo.address.length-8, props.balanceInfo.address.length)}</div>
                        </div>
                      </div>
                    </div>
                    }
                </li>
              }

              {isTxFailed &&
                <li class="failed">
                  <div>
                    {props.type==="swap" && (
                      <div className="failed__container">
                        <div className="failed__icon"/>
                        <div className="failed__description">
                          <div className="failed__title theme__text-6">{props.translate("transaction.transaction_error") || "Transaction error"}</div>
                          {!props.debug.isDebuging && !props.debug.isDebugComplete && <div className="failed__detail" onClick={(e) => handleAnalyze(e)}>{props.translate("details") || "Details"}</div>}
                          <div className="failed__list-error theme__text-6">
                            {getError()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              }

              {props.status === "pending" &&
                <li className={`pending pending--flex-start`}>
                  <div className="common__circle-loading"/>
                  <div className={"tx-waiting-text theme__text-6"}>{props.translate("transaction.waiting_transaction") || "Waiting for your transaction to be mined"}</div>
                </li>
              }
            </ul>
          </div>
        </div>
      </div>
      {!isTxFailed && (
        <div className="tx-actions theme__background-2">
          <div className={"change-path"} onClick={() => props.makeNewTransaction(true)}>
            {props.type === "swap" ? (props.translate("transaction.transfer") || "Transfer") : (props.translate("transaction.swap") || "Swap") }
          </div>
          <div className="new-transaction" onClick={() => props.makeNewTransaction()}>
            {props.type === "swap" ?
              props.translate("transaction.new_ex") || "New swap"
              : props.translate("transaction.new_tx") || "New transfer"}
          </div>
        </div>
      )}
      {isTxFailed && (
        <div className={"tx-actions tx-actions--error theme__background-2"}>
          <a className="new-transaction" onClick={() => props.makeNewTransaction()}>{props.translate("transaction.try_again") || "Try Again"}</a>
        </div>
      )}
    </div>
  )
}

export default TransactionLoadingView
