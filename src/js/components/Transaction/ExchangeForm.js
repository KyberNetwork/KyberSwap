import React from "react"
import { NavLink } from 'react-router-dom'
import { roundingNumber } from "../../utils/converter"
import { Link } from 'react-router-dom'
import constants from "../../services/constants"
import ReactTooltip from 'react-tooltip'
import { filterInputNumber } from "../../utils/validators";

const ExchangeForm = (props) => {

  function handleChangeSource(e) {
    var check = filterInputNumber(e, e.target.value, props.input.sourceAmount.value)
    if(check) props.input.sourceAmount.onChange(e)
  }

  function handleChangeDest(e) {
    var check = filterInputNumber(e, e.target.value, props.input.destAmount.value)
    if(check) props.input.destAmount.onChange(e)
  }

  function moveCursor() {
    let inp = document.getElementById('inputSource')
    inp.focus();
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
  if (props.errorNotPossessKgt !== ""){
    errorSource.push(props.errorNotPossessKgt)
    errorExchange = true
  }else{
    if (props.errors.exchange_enable !== ""){
      errorSource.push(props.translate(props.errors.exchange_enable))
      errorExchange = true
    }else{
      if (errorToken !== "") {
        errorSource.push(errorToken)
        errorExchange = true
      }
      if (props.errors.sourceAmount !== "") {
        errorSource.push(props.translate(props.errors.sourceAmount, { cap: maxCap }))
        errorExchange = true
      }
      //if (props.errors.rateAmount !== "") errorSource.push(<span class="error-text">{props.errors.rateAmount}</span>)
      if (props.errors.rateSystem !== "") {
        errorSource.push(props.translate(props.errors.rateSystem))
        errorExchange = true
      }
    }
  }
  // if (props.errorNotPossessKgt !== "" ) {
  //   errorSource.push(props.errorNotPossessKgt)
  // }else{
  //   if (errorToken !== "") errorSource.push(<span class="error-text">{errorToken}</span>)
  //   if (props.errors.sourceAmount !== "") errorSource.push(props.translate(props.errors.sourceAmount, { cap: maxCap }))
  //   //if (props.errors.rateAmount !== "") errorSource.push(<span class="error-text">{props.errors.rateAmount}</span>)
  //   if (props.errors.rateSystem !== "") errorSource.push(props.translate(props.errors.rateSystem))
  // }

  var errorShow = errorSource.map((value, index) => {
    return <span class="error-text" key={index}>{value}</span> 
  })  

  //var maxCap = props.sourceTokenSymbol === "ETH"?props.maxCap: props.maxCap*constants.MAX_CAP_PERCENT

  var render = (
    <div>
      <div class="frame">
        <div class="row small-11 medium-12 large-12">
          <div class="column">
            <h1 class="title">
              <Link to="/exchange" className="disable">{props.translate("transaction.exchange") || "Exchange"}</Link>
              <Link to="/transfer">{props.translate("transaction.transfer") || "Transfer"}</Link>
            </h1>
            <form action="#" method="get">
              <div class="row">
                <div class="column medium-5">
                  <label>
                    <span className="transaction-label">
                      {props.translate("transaction.exchange_from") || "From"}
                    </span>

                    <div className={errorExchange ? "error select-token-panel" : "select-token-panel"}>
                      {props.tokenSourceSelect}
                      <input id="inputSource" className="source-input" min="0" step="0.000001"
                        placeholder="0" autoFocus
                        type="text" maxLength="50" autoComplete="off"
                        value={props.input.sourceAmount.value}
                        onFocus={props.input.sourceAmount.onFocus}
                        onChange={handleChangeSource}
                      />
                    </div>
                    <div className={errorExchange ? "error" : ""}>
                      {errorShow}
                    </div>
                  </label>
                  <div class="address-balance">
                    <span class="note">{props.translate("transaction.address_balance") || "Address Balance"}</span>
                    <a className="value" onClick={() => {
                      props.setAmount()
                      setTimeout(moveCursor, 0);
                    }}>
                      <span title={props.balance.value}>
                        {props.balance.roundingValue} {props.sourceTokenSymbol}
                      </span>
                      <span class="k k-info k-2x ml-3" data-tip={props.translate('transaction.click_to_ex_all_balance') || 'Click to exchange all balance'} data-for="balance-notice-tip" currentitem="false"></span>
                      <ReactTooltip place="right" id="balance-notice-tip" type="light" />
                    </a>
                  </div>
                </div>
                <div class="column medium-2 exchange-icon hide-for-small-only">
                  <span data-tip={props.translate('transaction.click_to_swap') || 'Click to swap'} data-for="swap" currentitem="false">
                    <i className="k k-exchange k-3x cur-pointer" onClick={(e) => props.swapToken(e)}></i>
                  </span>
                  <ReactTooltip place="bottom" id="swap" type="light" />
                </div>
                <div class="column medium-5">
                  <label>
                    <span className="transaction-label">
                      {props.translate("transaction.exchange_to") || "To"}
                    </span>
                    <div className="select-token-panel">
                      {props.tokenDestSelect}
                      <input className="des-input" step="0.000001" placeholder="0" min="0"
                        type="text" maxLength="50" autoComplete="off"
                        value={props.input.destAmount.value}
                        onFocus={props.input.destAmount.onFocus}
                        onChange={handleChangeDest} />
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {props.gasConfig}
      {props.exchangeButton}
      {/* {props.selectTokenModal} */}
    </div>
  )
  return (

    <div className={props.step === 1 ? "choose-token-pair" : ""} id="exchange">
      {props.step !== 3 ? render : ''}
      <div class="page-3">
        {props.step == 3 ? props.transactionLoadingScreen : ''}
      </div>
    </div>
  )
}

export default ExchangeForm
