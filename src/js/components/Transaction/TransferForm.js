import React from "react"
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { filterInputNumber, restrictInputNumber } from "../../utils/validators";

const TransferForm = (props) => {
  function handleChangeAmount(e) {
    var check = filterInputNumber(e, e.target.value, props.input.amount.value)
    if(check) props.input.amount.onChange(e)
  }

  function moveCursor() {
    let inp = document.getElementById('inputTransfer')
    inp.focus();
    if (inp.createTextRange) {
      var part = inp.createTextRange();
      part.move("character", 0);
      part.select();
    } else if (inp.setSelectionRange) {
      inp.setSelectionRange(0, 0);
    }
  }

  var render = (
    <div id="transfer-screen">
      <div class="frame">
        <div className="title main-title exchange-pd">Transfer</div>
        <div class="small-11 medium-12 large-12">
          <div class="column exchange-pd">
            {/* <h1 class="title">
              <Link to="/exchange">{props.translate("transaction.exchange") || "Exchange"}</Link>
              <Link to="/transfer" className="disable">{props.translate("transaction.transfer") || "Transfer"}</Link>
            </h1> */}
            <form action="#" method="get">
              <div class="row">
                <div class="column small-12 medium-7">

                  <div className={props.errors.destAddress !== '' ? "error" : ""}>
                    <span className="transaction-label">{props.translate("transaction.address") || "Receiving Address"}</span>
                    <input className="hashAddr" value={props.input.destAddress.value} onChange={props.input.destAddress.onChange}>
                    </input>
                    {props.errors.destAddress &&
                      <span class="error-text">{props.translate(props.errors.destAddress)}</span>
                    }
                  </div>
                </div>

                <div class="column small-12 medium-5">
                  <div>
                    <span className="transaction-label">                      
                      {props.translate("transaction.exchange_from") || "From"}
                    </span>
                    <div className={props.errors.amountTransfer !== '' ? "error select-token-panel" : "select-token-panel"}>
                      {props.tokenTransferSelect}
                      
                      <div className={props.focus === "transfer"?"amount-input focus": "amount-input"}>
                        <input type="text" min="0" step="0.000001" placeholder="0"
                          id="inputTransfer"
                          value={props.input.amount.value} className="transfer-input"
                          onChange={handleChangeAmount}
                          onBlur = {props.onBlur}
                          onFocus = {props.onFocus}
                          maxLength="50" autoComplete="off"
                        />  
                         <span>{props.tokenSymbol}</span>
                      </div>
                    </div>
                    {props.errors.amountTransfer &&
                      <span class="error-text">{props.translate(props.errors.amountTransfer)}</span>
                    }
                  </div>
                  <div class="address-balance">
                        <div className="balance-intro">
                          <div class="info-up">{props.translate("transaction.address_balance") || "Address Balance"}</div>
                          <div class="info-down">Click to exchange all balance</div>
                        </div>
                        <div className="balance-amount">
                          <span title={props.balance.value} onClick={() => {
                            props.setAmount()
                            setTimeout(moveCursor, 0);
                          }}>
                            {props.balance.roundingValue}
                          </span>
                        </div>
                      </div>

                  {/* <div class="address-balance clearfix">
                    <span class="note">{props.translate("transaction.address_balance") || "Address Balance"}</span>
                    <a className="value" onClick={props.setAmount}>
                      <span title={props.balance.value}>
                        {props.balance.roundingValue} {props.tokenSymbol}
                      </span>
                      <span class="k k-info k-2x ml-3" data-tip={props.translate('transaction.click_to_transfer_all_balance') || 'Click to transfer all balance'} data-for="balance-notice-tip" currentitem="false"></span>
                      <ReactTooltip place="bottom" id="balance-notice-tip" type="light" />
                    </a>
                  </div> */}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

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
