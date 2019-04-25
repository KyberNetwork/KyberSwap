import React from "react"
// import { NavLink } from 'react-router-dom'
import { roundingNumber, toEther } from "../../utils/converter"
// import { Link } from 'react-router-dom'
import constants from "../../services/constants"
import ReactTooltip from 'react-tooltip'
import { filterInputNumber } from "../../utils/validators";
import { ImportAccount } from "../../containers/ImportAccount";
import { PostExchangeWithKey } from "../../containers/Exchange";
// import BLOCKCHAIN_INFO from "../../../../env";
import { RateBetweenToken } from "../../containers/Exchange";
import * as converters from "../../utils/converter";
import { getAssetUrl, getFormattedDate } from "../../utils/common";
// import { TermAndServices } from "../../containers/CommonElements";
// import { AdvanceAccount } from "../TransactionCommon"

import { AdvanceAccount } from "../../containers/TransactionCommon";
import { CSSTransition } from "react-transition-group";

const ExchangeBodyLayout = (props) => {
  const { isOnMobile } = props.global;
  function handleChangeSource(e) {
    var check = filterInputNumber(e, e.target.value, props.input.sourceAmount.value)
    if (check) props.input.sourceAmount.onChange(e)
  }

  function handleChangeDest(e) {
    var check = filterInputNumber(e, e.target.value, props.input.destAmount.value)
    if (check) props.input.destAmount.onChange(e)
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
        } else if (props.errors.sourceAmount === "error.source_amount_too_small") {
          errorSource.push(props.translate("error.source_amount_too_small", { minAmount: toEther(constants.EPSILON) }))
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
  if (errorExchange && props.defaultShowTooltip) {
    setTimeout(() => {
      ReactTooltip.show(document.getElementById("swap-error-trigger"))
      props.setDefaulTooltip(false)
    }, 300)
  }

  if (!errorExchange && !props.defaultShowTooltip) {
    setTimeout(() => {
      props.setDefaulTooltip(true)
    }, 300)
  }

  var errorTooltip = ""
  var errorShow = errorSource.map((value, index) => {
    errorTooltip += `<span class="error-text" key=${index}>${value}</span>`
  })
  var errorSelector = document.getElementById("swap-error")
  if (errorSelector) errorSelector.innerHTML = `<div>${errorTooltip}</div>`


  var importAccount = function () {
    if (props.account === false || (props.isChangingWallet && props.changeWalletType === "swap")) {
      return (
        <ImportAccount
          tradeType="swap"
          isChangingWallet={props.isChangingWallet}
          closeChangeWallet={props.closeChangeWallet}
          isAgreedTermOfService={props.isAgreedTermOfService}
          isAcceptConnectWallet={props.isAcceptConnectWallet}
          acceptTerm={props.acceptTerm}
        />
      )
    }
  }

  let expiredDate = new Date().getFullYear() + 1;
  if (props.account.info) {
    const date = new Date(props.account.info.expiredDate);
    expiredDate = getFormattedDate(date);
  } 
  
  return (
    <div>
      <div>
        <div>
          {props.account && props.account.type === "promo" && props.account.info.description !== ""
            && <div className={"promo-description"}>
              <div className="promo-description--icon">
                <img src={require("../../../assets/img/exchange/tick.svg")} />
              </div>
              <div className="promo-description--message">
                <div>{props.account.info.description}</div>
                <div>
                  <span>{props.translate("transaction.please_swap_before") || "Please swap before"}</span>{' '}
                  <span className="promo-description--expired-date">{expiredDate}</span>
                </div>
              </div>
              
            </div>}
          <div className="exchange-content-wrapper">
            {props.networkError !== "" && (
              <div className="network_error">
                <img src={require("../../../assets/img/warning.svg")} />
                {props.networkError}
              </div>
            )}
            <div className={"exchange-content container"}>
              <div className={"exchange-content__item--wrapper"}>
                <div className={"exchange-item-label"}>{props.translate("transaction.exchange_from") || "From"}:</div>
                <div className={`exchange-content__item exchange-content__item--left select-token ${props.account !== false ? 'has-account' : ''} ${errorExchange ? "error" : ""}`}
                >
                  <div className={`input-div-content`}>
                    <div className={"exchange-content__label-content"}>
                      <div className="exchange-content__select select-token-panel">{props.tokenSourceSelect}</div>
                    </div>
                    <div className={`exchange-content__input-container`}>
                      <div className={"main-input main-input__left"}>
                        <CSSTransition mountOnEnter unmountOnExit classNames="top-token-number" 
                          in={!errorExchange && props.input.sourceAmount.value > 0 && props.isSelectTokenBalance}
                          appear={true}
                          timeout={{ enter: 300, exit: 500 }}>
                            <div className={`top-token-number`} onClick={props.input.sourceAmount.onFocus}>100%</div>
                        </CSSTransition>
                        <div id="swap-error-trigger" className="input-tooltip-wrapper" data-tip={`<div>${errorTooltip}</div>`} data-html={true} data-event='click focus' data-for="swap-error" data-scroll-hide="false">
                          <input
                            className={`exchange-content__input ${props.account !== false ? 'has-account' : ''}`}
                            min="0"
                            step="0.000001"
                            placeholder="0" autoFocus
                            type={isOnMobile ? "number" : "text"} maxLength="50" autoComplete="off"
                            value={props.input.sourceAmount.value}
                            onFocus={props.input.sourceAmount.onFocus}
                            onBlur={props.input.sourceAmount.onBlur}
                            onChange={handleChangeSource}
                          />
                        </div>
                        {/* {props.account !== false && (
                          <div className={`exchange-content__label exchange-content__label--right trigger-swap-modal ${errorExchange ? "error" : ""}`}>{props.swapBalance}</div>
                        )} */}
                      </div>
                    </div>
                    
                  </div>
                  {errorExchange &&
                    <ReactTooltip globalEventOff="click" html={true} place="bottom" className="select-token-error" id="swap-error" type="light" />
                  }
                </div>
                {props.account !== false && !props.isAdvanceActive && (
                  <div>{props.topBalance}</div>
                )}
              </div>
              <div className={"exchange-content__item--middle"}>
                <span data-tip={props.translate('transaction.click_to_swap') || 'Click to swap'} data-for="swap-icon" currentitem="false">
                  <i className="k k-exchange k-3x cur-pointer" onClick={(e) => props.swapToken(e)}></i>
                </span>
                <ReactTooltip place="bottom" id="swap-icon" className={"common-tooltip common-tooltip--bottom"} type="dark" />
              </div>
              <div className={"exchange-content__item--wrapper"}>
                <div className={"exchange-item-label"}>{props.translate("transaction.exchange_to") || "To"}:</div>
                <div className={"exchange-content__item exchange-content__item--right"}>
                  <div className={`input-div-content`}>
                    <div className={"exchange-content__label-content"}>
                      <div className="exchange-content__select select-token-panel">{props.tokenDestSelect}</div>
                    </div>
                    <div className={`exchange-content__input-container`}>
                      <div className={"main-input main-input__right"}>
                        <input
                          className={`exchange-content__input`}
                          step="0.000001"
                          placeholder="0"
                          min="0"
                          type={isOnMobile ? "number" : "text"}
                          maxLength="50"
                          autoComplete="off"
                          value={props.input.destAmount.value}
                          onFocus={props.input.destAmount.onFocus}
                          onBlur={props.input.destAmount.onBlur}
                          onChange={handleChangeDest}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="exchange-rate-container container">
                  <div className={"exchange-rate-container__left"}>
                    <RateBetweenToken
                      isSelectToken={props.exchange.isSelectToken}
                      exchangeRate={{
                        sourceToken: props.sourceTokenSymbol,
                        rate: converters.toT(props.exchange.offeredRate),
                        destToken: props.destTokenSymbol
                      }}
                    />
                  </div>
                </div>

              </div>
            </div>



          </div>

          {props.account === false && importAccount()}
        </div>

        {props.account !== false && (
          <AdvanceAccount
            clearSession={props.clearSession}
            toggleAdvanceContent={props.toggleAdvanceContent}
            balanceLayout={props.balanceLayout}
            isAdvanceActive={props.isAdvanceActive}
            advanceLayout={props.advanceLayout}
            isOpenAdvance={props.isOpenAdvance}
            clearIsOpenAdvance={props.clearIsOpenAdvance}
            postWithKey={<PostExchangeWithKey isChangingWallet={props.isChangingWallet} />}
            screen={"swap"}
            selectTokenBalance={props.selectTokenBalance}
          />
        )}
      </div>

      {props.transactionLoadingScreen}
    </div>
  )
}

export default ExchangeBodyLayout
