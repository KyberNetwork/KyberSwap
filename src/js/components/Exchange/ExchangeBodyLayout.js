import React from "react"
import { NavLink } from 'react-router-dom'
import { roundingNumber } from "../../utils/converter"
import { Link } from 'react-router-dom'
import constants from "../../services/constants"
import ReactTooltip from 'react-tooltip'
import { filterInputNumber } from "../../utils/validators";

const ExchangeBodyLayout = (props) => {

  function handleChangeSource(e) {
    var check = filterInputNumber(e, e.target.value, props.input.sourceAmount.value)
    if (check) props.input.sourceAmount.onChange(e)
  }

  function handleChangeDest(e) {
    var check = filterInputNumber(e, e.target.value, props.input.destAmount.value)
    if (check) props.input.destAmount.onChange(e)
  }

  function moveCursor() {
    let inp = document.getElementById('inputSource')
    //inp.focus();
    if (inp.createTextRange) {
      var part = inp.createTextRange();
      part.move("character", 0);
      part.select();
    } else if (inp.setSelectionRange) {
      inp.setSelectionRange(0, 0);
    }
  }

  var errorSelectSameToken = props.errors.selectSameToken !== '' ? props.translate(props.errors.selectSameToken) : ''
  var errorSelectTokenToken = props.errors.selectTokenToken !== '' ? props.translate(props.errors.selectTokenToken) : ''
  var errorToken = errorSelectSameToken + errorSelectTokenToken

  var maxCap = props.maxCap
  var errorSource = []
  var errorExchange = false
  if (props.errorNotPossessKgt !== "") {
    errorSource.push(props.errorNotPossessKgt)
    errorExchange = true
  } else {
    if (props.errors.exchange_enable !== "") {
      errorSource.push(props.translate(props.errors.exchange_enable))
      errorExchange = true
    } else {
      if (errorToken !== "") {
        errorSource.push(errorToken)
        errorExchange = true
      }
      if (props.errors.sourceAmount !== "") {
        if (props.errors.sourceAmount === "error.source_amount_too_high_cap") {
          if (props.sourceTokenSymbol === "ETH") {
            errorSource.push(props.translate("error.source_amount_too_high_cap", { cap: maxCap }))
          } else {
            errorSource.push(props.translate("error.dest_amount_too_high_cap", { cap: maxCap * constants.MAX_CAP_PERCENT }))
          }
        } else {
          errorSource.push(props.translate(props.errors.sourceAmount))
        }
        errorExchange = true
      }
      if (props.errors.rateSystem !== "") {
        errorSource.push(props.translate(props.errors.rateSystem))
        errorExchange = true
      }
    }
  }

  var errorShow = errorSource.map((value, index) => {
    return <span class="error-text" key={index}>{value}</span>
  })

  var classSource = "amount-input"
  if (props.focus === "source") {
    classSource += " focus"
  }
  if (errorExchange) {
    classSource += " error"
  }

  var render = (
    <div className="grid-x">
      <div className={errorExchange ? "cell medium-6 large-3 balance-wrapper error" : "cell medium-6 large-3 balance-wrapper"} id="balance-account-wrapper">
        {props.balanceList}
      </div>
      <div className="cell medium-6 large-9 swap-wrapper">
        {/* <div className="grid-x">
              <div>

              </div>
            </div> */}
        {/* <div> */}
        <div className="grid-x exchange-col">
          <div className="cell large-8 exchange-col-1">
            <div className="title main-title">{props.translate("transaction.swap") || "Swap"}</div>
            <div className="grid-x">
              <div className="cell large-5">
                <span className="transaction-label">
                  {props.translate("transaction.exchange_from").toUpperCase() || "FROM"}
                </span>
                <div className={errorExchange ? "error select-token-panel" : "select-token-panel"}>
                  {props.tokenSourceSelect}
                  <div className={classSource}>
                    <div>
                      <input id="inputSource" className="source-input" min="0" step="0.000001"
                        placeholder="0" autoFocus
                        type="text" maxLength="50" autoComplete="off"
                        value={props.input.sourceAmount.value}
                        onFocus={props.input.sourceAmount.onFocus}
                        onBlur={props.input.sourceAmount.onBlur}
                        onChange={handleChangeSource}
                      />
                    </div>
                    <div>
                      <span>{props.sourceTokenSymbol}</span>
                    </div>
                  </div>
                </div>
                <div className={errorExchange ? "error" : ""}>
                  {errorShow}
                </div>
              </div>

              <div class="cell large-2 exchange-icon">
                <span data-tip={props.translate('transaction.click_to_swap') || 'Click to swap'} data-for="swap" currentitem="false">
                  <i className="k k-exchange k-3x cur-pointer" onClick={(e) => props.swapToken(e)}></i>
                </span>
                <ReactTooltip place="bottom" id="swap" type="light" />
              </div>

              <div className="cell large-5 exchange-col-1-2">
                <span className="transaction-label">
                  {props.translate("transaction.exchange_to").toUpperCase() || "TO"}
                </span>
                <div className="select-token-panel">

                  {props.tokenDestSelect}

                  <div className={props.focus === "dest" ? "amount-input focus" : "amount-input"}>
                  <div>
                    <input className="des-input" step="0.000001" placeholder="0" min="0"
                      type="text" maxLength="50" autoComplete="off"
                      value={props.input.destAmount.value}
                      onFocus={props.input.destAmount.onFocus}
                      onBlur={props.input.destAmount.onBlur}
                      onChange={handleChangeDest} />
                      </div>
                      <div>
                    <span>{props.destTokenSymbol}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="address-balance large-6">
              <p class="note">{props.translate("transaction.address_balance") || "Address Balance"}</p>
              <div>
                <span>{props.translate("transaction.click_to_ex_all_balance") || "Click to swap all balance"}</span>
                <span className="balance" title={props.balance.value} onClick={() => {
                  props.setAmount()
                  setTimeout(moveCursor, 0);
                }}>
                  {props.balance.roundingValue}
                </span>
              </div>
            </div>
          </div>
          <div className="cell large-4 exchange-col-2">
            {props.advanceLayout}
          </div>
        </div>
        <div className="grid-x exchange-col-3">
          <div className="cell large-8">
            {props.exchangeButton}
          </div>
        </div>
        {/* </div> */}

        {/* <div class="row content-exchange-body">
                    <div class="column medium-5">
                      <div>
                        <span className="transaction-label">
                          {props.translate("transaction.exchange_from").toUpperCase() || "FROM"}
                        </span>
                        <div className={errorExchange ? "error select-token-panel" : "select-token-panel"}>
                          {props.tokenSourceSelect}
                          <div className={props.focus === "source"?"amount-input focus": "amount-input"}>
                            <input id="inputSource" className="source-input" min="0" step="0.000001"
                              placeholder="0" autoFocus
                              type="text" maxLength="50" autoComplete="off"
                              value={props.input.sourceAmount.value}
                              onFocus={props.input.sourceAmount.onFocus}
                              onBlur = {props.input.sourceAmount.onBlur}
                              onChange={handleChangeSource}
                            />
                            <span>{props.sourceTokenSymbol}</span>
                          </div>
                        </div>
                        <div className={errorExchange ? "error" : ""}>
                          {errorShow}
                        </div>
                      </div>
                      <div class="address-balance">
                        <p class="note">{props.translate("transaction.address_balance") || "Address Balance"}</p>
                        <div>
                          <span>Click to swap all balance</span>
                          <span className="balance" title={props.balance.value} onClick={() => {
                            props.setAmount()
                            setTimeout(moveCursor, 0);
                          }}>
                            {props.balance.roundingValue}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column medium-2 exchange-icon hide-for-small-only">
                      <span data-tip={props.translate('transaction.click_to_swap') || 'Click to swap'} data-for="swap" currentitem="false">
                        <i className="k k-exchange k-3x cur-pointer" onClick={(e) => props.swapToken(e)}></i>
                      </span>
                      <ReactTooltip place="bottom" id="swap" type="light" />
                    </div>
                    <div class="column medium-5">
                      <div>
                        <span className="transaction-label">
                          {props.translate("transaction.exchange_to").toUpperCase() || "TO"}
                        </span>
                        <div className="select-token-panel">

                          {props.tokenDestSelect}

                          <div className={props.focus==="dest"?"amount-input focus":"amount-input"}>
                            <input className="des-input" step="0.000001" placeholder="0" min="0"
                              type="text" maxLength="50" autoComplete="off"
                              value={props.input.destAmount.value}
                              onFocus={props.input.destAmount.onFocus}
                              onBlur = {props.input.destAmount.onBlur}
                              onChange={handleChangeDest} />
                            <span>{props.destTokenSymbol}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> 
                
              </div>
          {props.exchangeButton}
        </div> */}
      </div>
    </div>
  )
  return (

    <div id="exchange">
      {render}
      {props.transactionLoadingScreen}
    </div>
  )
}

export default ExchangeBodyLayout
