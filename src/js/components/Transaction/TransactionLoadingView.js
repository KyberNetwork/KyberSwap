import React from "react"
import { roundingNumber } from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env"
import { Link } from 'react-router-dom'

const TransactionLoadingView = (props) => {
  if (props.broadcasting) {
    var classPending = !props.error ? " pulse" : ""
    return (
      <div>
        <div class="frame">
          <div class="row">
            <div className="column">
              <h1 class="title">
                <Link to="/exchange" className={props.type === "exchange" ? "disable" : ""}>{props.translate("transaction.exchange") || "Exchange"}</Link>
                <Link to="/transfer" className={props.type === "transfer" ? "disable" : ""}>{props.translate("transaction.transfer") || "Transfer"}</Link>
              </h1>
            </div>
            <div class="text-center">
              <h1 class="title mb-0 font-w-b">{props.translate("transaction.broadcast") || "Broadcast"}
              </h1>
              <ul class="broadcast-steps">
                {!props.error &&
                  <li class="pending">
                    <h4 class="font-w-b">{props.translate("transaction.broadcasting") || "Broadcasting your transaction to network"}
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
              {props.translate("transaction.back") || 'Back'}
            </a>
          </div>
        </div>
      </div>
    )
  }
  var classPending = props.status === "pending" ? " pulse" : ""
  return (
    <div>
      <div class="frame">
        <div class="row small-11 medium-12 large-12">
          <div className="column">
            <h1 class="title">
              <Link to="/exchange" className={props.type === "exchange" ? "disable" : ""}>{props.translate("transaction.exchange") || "Exchange"}</Link>
              <Link to="/transfer" className={props.type === "transfer" ? "disable" : ""}>{props.translate("transaction.transfer") || "Transfer"}</Link>
            </h1>
          </div>
          <div class="text-center">
            <h1 class="title mb-0 font-w-b">{props.translate("transaction.broadcast") || "Broadcast"}
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
                  <h4 class="text-success font-w-b">{props.translate("transaction.broadcasted_title") || "Broadcasted your transaction to the blockchain"}</h4>
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
                  <h4 class="font-w-b">{props.translate("transaction.transaction_error") || "Transaction error"}</h4>
                  <div class="reason">{props.translate(props.error) || "Warning! Error encountered during contract execution"}</div>
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
            {props.translate("transaction.back") || 'Back'}
          </a>
        </div>
      </div>
    </div>
  )
}


export default TransactionLoadingView
