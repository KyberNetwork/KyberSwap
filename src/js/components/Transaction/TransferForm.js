import React from "react"
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { filterInputNumber, restrictInputNumber } from "../../utils/validators";

const TransferForm = (props) => {
  function handleChangeAmount(e) {
    var check = filterInputNumber(e, e.target.value, props.input.amount.value)
    if(check) props.input.amount.onChange(e)
  }

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
                    <span className="transaction-label">{props.translate("transaction.address") || "Receiving Address"}</span>
                    <input className="hashAddr" value={props.input.destAddress.value} onChange={props.input.destAddress.onChange}>
                    </input>
                    {props.errors.destAddress &&
                      <span class="error-text">{props.translate(props.errors.destAddress)}</span>
                    }
                  </label>
                </div>

                <div class="column small-12 medium-5">
                  <label>
                    <span className="transaction-label">
                      {props.translate("transaction.token_amount") || "Token & Amount To Send"}
                    </span>

                    <div className={props.errors.amountTransfer !== '' ? "error select-token-panel" : "select-token-panel"}>
                      {props.tokenTransferSelect}
                      <input type="text" min="0" step="0.000001" placeholder="0"
                        value={props.input.amount.value} className="amount-input"
                        onChange={handleChangeAmount}
                        maxLength="50" autoComplete="off"
                      />
                    </div>
                    {props.errors.amountTransfer &&
                      <span class="error-text">{props.translate(props.errors.amountTransfer)}</span>
                    }
                  </label>
                  <div class="address-balance clearfix">
                    <span class="note">{props.translate("transaction.address_balance") || "Address Balance"}</span>
                    <a className="value" onClick={props.setAmount}>
                      <span title={props.balance.value}>
                        {props.balance.roundingValue} {props.tokenSymbol}
                      </span>
                      <span class="k k-info k-2x ml-3" data-tip={props.translate('transaction.click_to_transfer_all_balance') || 'Click to transfer all balance'} data-for="balance-notice-tip" currentitem="false"></span>
                      <ReactTooltip place="bottom" id="balance-notice-tip" type="light" />
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {props.gasConfig}
      {props.transferButton}
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
