import React from "react"
import { roundingNumber } from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env"

const TransactionLoadingView = (props) => {
  if (props.broadcasting) {
    var classPending = props.error === "" ? " pulse" : ""
    return (
      <div>
        <div class="frame">
          <div class="row">
            <div class="text-center">
              <h1 class="title mb-0">{props.translate("transaction.broadcast") || "Broadcast"}
              </h1>
              <ul class="broadcast-steps">
                {props.error === "" &&
                  <li class="pending">
                    <h5 class="font-w-b">{props.translate("transaction.broadcasting") || "Broadcasting your transaction to network"}
                    </h5>
                  </li>
                }
                {props.error !== "" &&
                  <li class="failed">
                    <h5 class="font-w-b">{props.translate("transaction.cound_not_broadcast") || "Couldn't broadcast your transaction to the blockchain"}</h5>
                    <div class="reason">{props.error}</div>
                  </li>
                }
              </ul>
              <div class="text-center">
                <div className={"broadcast-animation animated infinite" + classPending}>
                  {props.error === "" ? <img src={require('../../../assets/img/broadcast.svg')} /> : <img src={require('../../../assets/img/finish.svg')} />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="column small-11 medium-10 large-9 small-centered text-center">
            <p class="note text-white">{props.type == 'exchange' ? props.translate("transaction.close_browser_or_make_new_exchange") : props.translate("transaction.close_browser_or_make_new_transfer")}</p><a class="button accent" onClick={props.makeNewTransaction}>{props.type == 'exchange' ? "Exchange" : "Transfer"}</a>
          </div>
        </div>
      </div>
    )
  }
  var classPending = props.status === "pending" ? " pulse" : ""
  return (
    <div>
      <div class="frame">
        <div class="row">
          <div class="text-center">
            <h1 class="title mb-0">{props.translate("transaction.broadcast") || "Broadcast"}
            </h1>
            <div class="info text-light font-s-down-1 my-3">
              {props.translate("transaction.transaction") || "Transaction"}&nbsp;
              <a class="font-w-b text-light" data-tooltip title="View on Etherscan" href={BLOCKCHAIN_INFO.ethScanUrl + 'tx/' + props.txHash} target="_blank">
              {props.txHash.slice(0, 12)} ... {props.txHash.slice(-10)}
              </a>
            </div>
            <ul class="broadcast-steps">
              {props.status === "success" &&
                <li class={props.status}>
                  <h5 class="text-success font-w-b">{props.translate("transaction.broadcasted_title") || "Broadcasted your transaction to the blockchain"}</h5>
                  {props.type === "exchange" &&
                    <ul class="address-balances text-white">
                      <li class="text-left">
                        <span class="name">{props.balanceInfo.sourceTokenName}</span>
                        <span class="balance" title={props.balanceInfo.sourceAmount.prevValue}>{roundingNumber(props.balanceInfo.sourceAmount.prevValue)}</span>
                        <span class="ml-2 mr-3">-></span>
                        <span class="balance" title={props.balanceInfo.sourceAmount.nextValue}>{roundingNumber(props.balanceInfo.sourceAmount.nextValue)}</span>
                      </li>
                      <li class="text-left">
                        <span class="name">{props.balanceInfo.destTokenName}</span>
                        <span class="balance" title={props.balanceInfo.destAmount.prevValue}>{roundingNumber(props.balanceInfo.destAmount.prevValue)}</span>
                        <span class="ml-2 mr-3">-></span>
                        <span class="balance font-w-b" title={props.balanceInfo.destAmount.nextValue}>{roundingNumber(props.balanceInfo.destAmount.nextValue)}</span>
                      </li>
                    </ul>
                  }
                  {props.type === "transfer" &&
                    <ul class="address-balances text-white">
                      <li class="text-left">
                        <span class="name">{props.balanceInfo.tokenName}</span>
                        <span class="balance" title={props.balanceInfo.amount.prev}>{roundingNumber(props.balanceInfo.amount.prev)}</span>
                        <span class="ml-2 mr-3">-></span>
                        <span class="balance font-w-b" title={props.balanceInfo.amount.next}>{roundingNumber(props.balanceInfo.amount.next)}</span>
                      </li>
                    </ul>
                  }
                </li>
              }
              {props.status === "failed" &&
                <li class={props.status}>
                  <h5 class="font-w-b">{props.translate("transaction.transaction_error") || "Transaction error"}</h5>
                  <div class="reason">{props.error}</div>
                </li>
              }
              {props.status === "pending" &&
                <li class={props.status}>
                  <h5 class="font-w-b">{props.translate("transaction.waiting_transaction") || "Waiting for your transaction to be mined"}</h5>
                </li>
              }
            </ul>
            {classPending != "" ? (
              <div class="text-center">
                <div className={"broadcast-animation animated infinite" + classPending}>
                  {props.error === "" ? <img src={require('../../../assets/img/broadcast.svg')} /> : <img src={require('../../../assets/img/finish.svg')} />}
                </div>
              </div>
              ) : ''
            }
          </div>
        </div>
      </div>
      <div class="row">
        <div class="column small-11 medium-10 large-9 small-centered text-center">
          <p class="note text-white">{props.type == 'exchange' ? props.translate("transaction.close_browser_or_make_new_exchange") : props.translate("transaction.close_browser_or_make_new_transfer")}</p><a className={"button accent new-transaction" + (props.status != "pending" ? " animated infinite pulse" : "")} onClick={props.makeNewTransaction}>{props.type == 'exchange' ? props.translate("transaction.exchange") : props.translate("transaction.transfer")}</a>
        </div>
      </div>
    </div>
  )
}


export default TransactionLoadingView
