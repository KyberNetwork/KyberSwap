import React from "react"
import { Link } from 'react-router-dom'

const TransferForm = (props) => {
  var render = (
    <div id="transfer-screen">
      <div class="frame">
        <div class="row small-11 medium-12 large-12">
          <div class="column">
            <h1 class="title">
              <Link to="/exchange">{props.translate("transaction.exchange") || "Exchange"}</Link>
              <Link to="/transfer" className="disable">{props.translate("transaction.transfer") || "Transfer"}</Link>
            </h1>
            <form action="#" method="get">
              <div class="row">
                <div class="column small-12 medium-7">

                  <label className={props.errors.destAddress !== '' ? "error" : ""}>
                    <span className="transaction-label">{props.translate("address.address") ||  "Address"}</span>
                    <textarea className="hash" value={props.input.destAddress.value} onChange={props.input.destAddress.onChange}>
                    </textarea>
                    {props.errors.destAddress &&
                      <span class="error-text">{props.translate(props.errors.destAddress)}</span>
                    }
                  </label>
                </div>

                <div class="column small-12 medium-5">
                  <label>
                    <span className="transaction-label">
                      {props.translate("transaction.token_amount") || "Token/Amount"}
                    </span>

                    <div className={props.errors.amountTransfer !== '' ? "error select-token-panel" : "select-token-panel"}>
                      {props.tokenTransferSelect}
                      <input type="number" min="0" step="0.000001" placeholder="0" value={props.input.amount.value} className="amount-input" onChange={props.input.amount.onChange} />
                    </div>
                    {props.errors.amountTransfer &&
                      <span class="error-text">{props.translate(props.errors.amountTransfer)}</span>
                    }
                  </label>
                  <div class="address-balance clearfix">
                    <span class="note">{props.translate("transaction.address_balance") || "Address Balance"}</span>
                    <a className="value" onClick={props.setAmount} title={props.balance.value}>
                      {props.balance.roundingValue} {props.tokenSymbol}
                    </a>
                  </div>
                </div>
              </div>


              {/* <div class="row">
                <div class="column medium-6">
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
                </div>
              </div> */}
            </form>
          </div>
        </div>
      </div>

      {props.gasConfig}
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
