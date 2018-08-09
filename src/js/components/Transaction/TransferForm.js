import React from "react"
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { filterInputNumber, restrictInputNumber , anyErrors} from "../../utils/validators";

const TransferForm = (props) => {
  function handleChangeAmount(e) {
    var check = filterInputNumber(e, e.target.value, props.input.amount.value)
    if (check) props.input.amount.onChange(e)
  }

  // function moveCursor() {
  //   let inp = document.getElementById('inputTransfer')
  //   //inp.focus();
  //   if (inp.createTextRange) {
  //     var part = inp.createTextRange();
  //     part.move("character", 0);
  //     part.select();
  //   } else if (inp.setSelectionRange) {
  //     inp.setSelectionRange(0, 0);
  //   }
  // }

  var classSource = "amount-input"
  if (props.focus === "source") {
    classSource += " focus"
  }
  if (props.errors.amountTransfer) {
    classSource += " error"
  }
  var render = (
    <div id="transfer-screen">
      <div className="grid-x">
        <div className={"cell medium-6 large-3 balance-wrapper" + (anyErrors(props.errors) ?" error": "") } id="balance-account-wrapper">
          {props.accountBalance}
        </div>
        <div class="cell medium-6 large-9 swap-wrapper">
          <div className="transfer-detail grid-x exchange-col">
            <div className="cell small-12 large-8 transfer-col transfer-col-1">

              {props.networkError !== "" && (
                <div className="network_error">
                  <span>
                    <img src={require("../../../assets/img/warning.svg")} />
                  </span>
                  <span>
                    {props.networkError}
                  </span>
                </div>
              )}

              <div className="title main-title">{props.translate("transaction.transfer") || "Transfer"}</div>
              <div className="grid-x">
                <div className="cell small-12">
                  <div className={props.errors.destAddress !== '' ? "error receiveAddress" : "receiveAddress"}>
                    <span className="transaction-label">{props.translate("transaction.address") || "Receiving Address"}</span>
                    <input className="hashAddr" value={props.input.destAddress.value} onChange={props.input.destAddress.onChange} placeholder="0x0de...">
                    </input>
                    {props.errors.destAddress &&
                      <span class="error-text">{props.translate(props.errors.destAddress)}</span>
                    }
                  </div>
                </div>
                <div className="cell small-12 transfer-col-1-2">
                  <div>
                    <span className="transaction-label">
                      {props.translate("transaction.exchange_from") || "From"}
                    </span>
                    <div className={props.errors.amountTransfer !== '' ? "error select-token-panel" : "select-token-panel"}>
                      {props.tokenTransferSelect}

                      <div className={classSource}>
                        <div>
                          <input type="text" min="0" step="0.000001" placeholder="0"
                            id="inputSource"
                            value={props.input.amount.value} className="transfer-input"
                            onChange={handleChangeAmount}
                            onBlur={props.onBlur}
                            onFocus={props.onFocus}
                            maxLength="50" autoComplete="off"
                          />
                        </div>
                        <div>
                          <span>{props.tokenSymbol}</span>
                        </div>
                      </div>
                    </div>
                    {props.errors.amountTransfer &&
                      <span class="error-text">{props.translate(props.errors.amountTransfer)}</span>
                    }
                  </div>
                  {props.addressBalanceLayout}
                </div>

              </div>

            </div>
            <div className="cell small-12 large-4 transfer-col transfer-advanced large-offset-0">
              {props.advanceLayout}
            </div>
          </div>
          <div className="grid-x transfer-col transfer-col-3">
            <div className={props.errors.amountTransfer !== '' ? "cell transfer-btn small-12 large-9 error" : "cell transfer-btn small-12 large-9"}>
              <div className="grid-x">
                <div className="cell transfer-col-3-1">
                  {props.transferButton}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
  return (

    <div>
      {render}
      {props.transactionLoadingScreen}
      {/* {props.step !== 2 ? render : ''}
      <div class="page-3">
        {props.step == 2 ? props.transactionLoadingScreen : ''}
      </div> */}
    </div>
  )
}

export default TransferForm
