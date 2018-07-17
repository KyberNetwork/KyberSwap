import React from "react"
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { filterInputNumber, restrictInputNumber } from "../../utils/validators";

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
      <div class="frame">
        <div className="transfer-detail grid-x">
          <div className="cell small-12 large-9 transfer-col transfer-col-1">

          {props.networkError !== "" && (
              <div className="network_error"> 
                <span>
                  <img src={require("../../../assets/img/warning.svg")} />
                </span>
                <span>
                  {props.networkError}
                </span>
                {/* <span>
                  <img src={require("../../../assets/img/loading.svg")} />
                </span> */}
              </div>
  )}

            <div className="title main-title">{props.translate("transaction.transfer") || "Transfer"}</div>
            <div className="grid-x">
              <div className="cell small-12 medium-7">
                <div className={props.errors.destAddress !== '' ? "error" : ""}>
                  <span className="transaction-label">{props.translate("transaction.address") || "Receiving Address"}</span>
                  <input className="hashAddr" value={props.input.destAddress.value} onChange={props.input.destAddress.onChange}>
                  </input>
                  {props.errors.destAddress &&
                    <span class="error-text">{props.translate(props.errors.destAddress)}</span>
                  }
                </div>
              </div>
              <div className="cell small-12 medium-5 transfer-col-1-2">
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
                {/* <div class="address-balance">
                  <p class="note">{props.translate("transaction.address_balance") || "Address Balance"}</p>
                  <div>
                    <span>{props.translate("transaction.click_to_transfer_all_balance") || "Click to transfer all balance"}</span>
                    <span className="balance" title={props.balance.value} onClick={() => {
                      props.setAmount()
                      setTimeout(moveCursor, 0);
                    }}>
                      {props.balance.roundingValue}
                    </span>
                  </div>
                </div> */}
              </div>

            </div>

          </div>
          <div className="cell small-12 large-3 transfer-col transfer-advanced medium-5 medium-offset-7 large-offset-0">
            {props.advanceLayout}
          </div>
        </div>
        <div className="grid-x transfer-col transfer-col-3">
          <div className={props.errors.amountTransfer !== '' ? "cell transfer-btn small-12 large-9 error" : "cell transfer-btn small-12 large-9"}>
            <div className="grid-x">
              <div className="cell medium-5 medium-offset-7 transfer-col-3-1">
                {props.transferButton}
              </div>
            </div>

          </div>
        </div>

        {/* <div>
          <div class="grid-x transfer-detail">
            <div class="cell small-12 medium-7">

              <div className={props.errors.destAddress !== '' ? "error" : ""}>
                <span className="transaction-label">{props.translate("transaction.address") || "Receiving Address"}</span>
                <input className="hashAddr" value={props.input.destAddress.value} onChange={props.input.destAddress.onChange}>
                </input>
                {props.errors.destAddress &&
                  <span class="error-text">{props.translate(props.errors.destAddress)}</span>
                }
              </div>
            </div>

            <div class="cell small-12 medium-5 change-amount">
              <div>
                <span className="transaction-label">
                  {props.translate("transaction.exchange_from") || "From"}
                </span>
                <div className={props.errors.amountTransfer !== '' ? "error select-token-panel" : "select-token-panel"}>
                  {props.tokenTransferSelect}

                  <div className={props.focus === "transfer" ? "amount-input focus" : "amount-input"}>
                    <input type="text" min="0" step="0.000001" placeholder="0"
                      id="inputTransfer"
                      value={props.input.amount.value} className="transfer-input"
                      onChange={handleChangeAmount}
                      onBlur={props.onBlur}
                      onFocus={props.onFocus}
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
                <p class="note">{props.translate("transaction.address_balance") || "Address Balance"}</p>
                <div>
                  <span>Click to transfer all balance</span>
                  <span className="balance" title={props.balance.value} onClick={() => {
                    props.setAmount()
                    setTimeout(moveCursor, 0);
                  }}>
                    {props.balance.roundingValue}
                  </span>
                </div>
              </div>
              {props.transferButton}
            </div>
          </div>
          <div>
            {props.advanceLayout}
          </div>
        </div> */}

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
