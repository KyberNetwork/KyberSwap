import React from "react"
import { Link } from 'react-router-dom'

const TransferForm = (props) => {
  var render = (
    <div id="transfer-screen">
      <div class="frame">
        <div class="row">
          <div class="column small-11 medium-10 large-8 small-centered">
            <h1 class="title">
              <Link to="/exchange">{props.translate("transaction.exchange") || "Exchange"}</Link>
              <Link to="/transfer" className="disable">{props.translate("transaction.transfer") || "Transfer"}</Link>
            </h1>
            <form action="#" method="get">
              <div class="row">
                <div class="column">

                  <label className={props.errors.destAddress !== '' ? "error" : "" }>{props.translate("transaction.transfer_to_address") || "Transfer to address"}
                    <input className="text-center hash" type="text" placeholder="Address Hash" value={props.input.destAddress.value} onChange={props.input.destAddress.onChange} />
                    {props.errors.destAddress  &&
                      <span class="error-text">{props.translate(props.errors.destAddress)}</span>
                    }
                  </label>
                </div>
              </div>
              <div class="row">
                <div class="column medium-6">
                  {/* {props.token} */}
                  {props.tokenTransferSelect}
                </div>
                <div class="column medium-6">
                  <label>{props.translate("transaction.amount") || "Amount"}
                    <div className={props.errors.amountTransfer !== '' ? "token-amount error" : "token-amount"}>
                      <input type="number" min="0" step="0.000001" placeholder="0" value={props.input.amount.value} className="amount-input" onChange={props.input.amount.onChange} /><span class="name">{props.tokenSymbol}</span>
                      {props.errors.amountTransfer &&
                        <span class="error-text">{props.translate(props.errors.amountTransfer)}</span>
                      }
                    </div>
                    <div class="address-balance clearfix">
                      <span class="note">{props.translate("transaction.address_balance") || "Address Balance"}</span>
                      <a className="value" onClick={props.setAmount} title={props.balance.value}>
                        {props.balance.roundingValue} {props.tokenSymbol}
                      </a>
                    </div>
                  </label>
                  {/* <span class="error-text">{props.errors.amountTransfer}</span> */}
                </div>
              </div>
            </form>
            <div class="row hide-on-choose-token-pair">
              <div class="column">
                <div class="clearfix">
                  <div class="advanced-switch base-line float-right">
                    <div class="switch accent">
                      <input class="switch-input" id="advanced" type="checkbox" />
                      <label class="switch-paddle" for="advanced"><span class="show-for-sr">Advanced Mode</span></label>
                    </div>

                    <label class="switch-caption" for="advanced">{props.translate("transaction.advanced") || "Advanced"}</label>
                  </div>
                </div>
                <div class="advanced-content" disabled>
                  {props.gasConfig}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {props.transferButton}
      {/* {props.tokenModal} */}
    </div>
  )
  return (

    <div>
      {props.step !== 2 ? render : ''}
      <div class="page-3">
        {props.step == 2 ? props.transactionLoadingScreen : ''}
      </div>
    </div>
  )
}

export default TransferForm
