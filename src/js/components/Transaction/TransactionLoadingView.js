import React from "react"
import BLOCKCHAIN_INFO from "../../../../env"

const TransactionLoadingView = (props) => {
  if (props.broadcasting) {
    var classPending = props.error === "" ? " pulse" : ""
    return (
      <div>
        <div class="frame">
          <div class="row">
            <div class="column small-11 medium-9 large-8 small-centered">
              <h1 class="title text-center">{props.translate("transaction.broadcast") || "Broadcast"}
                </h1>
              <div class="row">
                <div class="column medium-3 text-center">
                  <div className={"broadcast-animation animated infinite" + classPending}>
                    {props.error === "" ? <img src={require('../../../assets/img/broadcast.svg')}/> : <img src={require('../../../assets/img/finish.svg')} />}
                  </div>
                </div>
                <div class="column medium-9">
                  <ul class="broadcast-steps">
                    {props.error === "" &&
                      <li class="pending">{props.translate("transaction.broadcasting") || "Broadcasting your transaction to network"}</li>
                    }
                    {props.error !== "" &&
                      <li class="failed">
                        {props.translate("transaction.cound_not_broadcast") || "Couldn't broadcast your transaction to the blockchain"}
                                        <div class="reason">{props.error}</div>
                      </li>
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="column small-11 medium-10 large-9 small-centered text-center">
            <p class="note">{props.type == 'exchange' ? props.translate("transaction.close_browser_or_make_new_exchange") : props.translate("transaction.close_browser_or_make_new_transfer")}</p><a class="button accent" onClick={props.makeNewTransaction}>{props.type == 'exchange' ? "Exchange" : "Transfer"}</a>
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
          <div class="column small-11 medium-9 large-8 small-centered">
            <h1 class="title text-center">{props.translate("transaction.broadcast") || "Broadcast"}
                              <div class="info">{props.translate("transaction.transaction") || "Transaction"}&nbsp;
                          <br class="show-for-small-only"></br>
                <a class="hash has-tip top" data-tooltip title="View on Etherscan" href={BLOCKCHAIN_INFO.ethScanUrl + 'tx/' + props.txHash} target="_blank">
                  {props.txHash.slice(0, 12)} ... {props.txHash.slice(-10)}
                </a>
              </div>

            </h1>
            <div class="row">
              <div class="column medium-3 text-center">
                <div className={"broadcast-animation animated infinite" + classPending}>
                  {props.status == "pending" ? <img src={require('../../../assets/img/broadcast.svg')} /> : <img src={require('../../../assets/img/finish.svg')} />}
                </div>
              </div>
              <div class="column medium-9">
                <ul class="broadcast-steps">
                  {props.status === "success" &&
                    <li class={props.status}>
                      {props.translate("transaction.broadcasted_title") || "Broadcasted your transaction to the blockchain"}
                      <p class="note">{props.translate("transaction.current_address_balance") || "Current address balance"}</p>
                      {props.type === "exchange" &&
                        <ul class="address-balances">
                          <li>
                            <span class="name">{props.balanceInfo.sourceTokenName}</span>
                            <span class="balance" title={props.balanceInfo.sourceAmount.value}>{props.balanceInfo.sourceAmount.roundingValue} {props.balanceInfo.sourceTokenSymbol}</span>
                          </li>
                          <li>
                            <span class="name">{props.balanceInfo.destTokenName}</span>
                            <span class="balance" title={props.balanceInfo.destAmount.value}>{props.balanceInfo.destAmount.roundingValue} {props.balanceInfo.destTokenSymbol}</span>
                          </li>
                        </ul>
                      }
                      {props.type === "transfer" &&
                        <ul class="address-balances">
                          <li>
                            <span class="name">{props.balanceInfo.tokenName}</span>
                            <span class="balance" title={props.balanceInfo.amount.value}>{props.balanceInfo.amount.roundingValue} {props.balanceInfo.tokenSymbol}</span>
                          </li>
                        </ul>
                      }
                    </li>
                  }
                  {props.status === "failed" &&
                    <li class={props.status}>
                      {props.translate("transaction.transaction_error") || "Transaction error"}
                      <div class="reason">{props.error}</div>
                    </li>
                  }
                  {props.status === "pending" &&
                    <li class={props.status}>{props.translate("transaction.waiting_transaction") || "Waiting for your transaction to be mined"}</li>
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="column small-11 medium-10 large-9 small-centered text-center">
          <p class="note">{props.type == 'exchange' ? props.translate("transaction.close_browser_or_make_new_exchange") : props.translate("transaction.close_browser_or_make_new_transfer")}</p><a className={"button accent new-transaction" + (props.status != "pending" ? " animated infinite pulse" : "")} onClick={props.makeNewTransaction}>{props.type == 'exchange' ? props.translate("transaction.exchange") : props.translate("transaction.transfer")}</a>
        </div>
      </div>
    </div>
  )
}


export default TransactionLoadingView
