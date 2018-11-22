import React from "react"
import { NavLink } from 'react-router-dom'
import { roundingNumber, toEther } from "../../utils/converter"
import { Link } from 'react-router-dom'
import constants from "../../services/constants"
import ReactTooltip from 'react-tooltip'
import { filterInputNumber } from "../../utils/validators";
import { ImportAccount } from "../../containers/ImportAccount";
import { PostExchangeWithKey } from "../../containers/Exchange";
import BLOCKCHAIN_INFO from "../../../../env";
import { RateBetweenToken } from "../../containers/Exchange";
import * as converters from "../../utils/converter";
import { getAssetUrl } from "../../utils/common";
import BigInput from "./BigInput";

const ExchangeBodyLayout = (props) => {

  function handleChangeSource(e) {
    var check = filterInputNumber(e, e.target.value, props.input.sourceAmount.value)
    if (check) props.input.sourceAmount.onChange(e)
  }

  function handleChangeDest(e) {
    var check = filterInputNumber(e, e.target.value, props.input.destAmount.value)
    if (check) props.input.destAmount.onChange(e)
  }

  // function getStatusClasses(className) {
  //   let classes = '';
  //
  //   classes += (props.global.isIos || props.global.isAndroid) ? ' ' + className + '--mobile' : '';
  //   classes += props.isAgreed ? ' ' + className + '--agreed' : '';
  //   classes += props.account !== false ? ' ' + className + '--imported' : '';
  //   classes += props.isChangingWallet ? ' ' + className + '--imported__change-wallet' : ''
  //
  //   return classes;
  // }

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

  var errorShow = errorSource.map((value, index) => {
    return <span class="error-text" key={index}>{value}</span>
  })

  var render = (
    <div>
      <div>
        <div className="exchange-content-wrapper">
          {props.networkError !== "" && (
            <div className="network_error">
              <img src={require("../../../assets/img/warning.svg")} />
              {props.networkError}
            </div>
          )}
          <div className={"exchange-content container"}>
            <div className={"exchange-content__item exchange-content__item--left"}>
              <div className="exchange-content__label">{props.translate("transaction.exchange_from") || "From"}</div>
              <div className="exchange-content__select select-token-panel">{props.tokenSourceSelect}</div>
              <div className={`exchange-content__input-container ${errorExchange ? "error" : ""}`}>
                {/* <input
                  className="exchange-content__input"
                  min="0"
                  step="0.000001"
                  placeholder="0"
                  type="text" maxLength="50" autoComplete="off"
                  value={props.input.sourceAmount.value}
                  onFocus={props.input.sourceAmount.onFocus}
                  onBlur={props.input.sourceAmount.onBlur}
                  onChange={handleChangeSource}
                /> */}
                <BigInput 
                  value={props.input.sourceAmount.value}
                  onFocus={props.input.sourceAmount.onFocus}
                  onBlur={props.input.sourceAmount.onBlur}
                  handleChangeValue={handleChangeSource}
                  tokenSymbol={props.sourceTokenSymbol}
                  type={"source"}
                  focus={props.focus}
                  errorExchange={errorExchange}
                  errorShow={errorShow}
                  isChangingWallet={props.isChangingWallet}
                />
                {/* <div className={errorExchange ? "error" : ""}>
                  {!props.isChangingWallet ? errorShow : ''}
                </div> */}
              </div>
              <div className={`exchange-content__label ${errorExchange ? "error" : ""}`}>{props.sourceTokenSymbol}</div>
            </div>

            <div className={"exchange-content__item--absolute"}>
              <span data-tip={props.translate('transaction.click_to_swap') || 'Click to swap'} data-for="swap" currentitem="false">
                <i className="k k-exchange k-3x cur-pointer" onClick={(e) => props.swapToken(e)}></i>
              </span>
              <ReactTooltip place="bottom" id="swap" type="light"/>
            </div>

            <div className={"exchange-content__item exchange-content__item--right"}>
              <div className="exchange-content__label">{props.translate("transaction.exchange_to") || "To"}</div>
              <div className="exchange-content__select select-token-panel">{props.tokenDestSelect}</div>
              <div className={`exchange-content__input-container ${errorExchange ? "error" : ""}`}>
                {/* <input
                  className="exchange-content__input"
                  step="0.000001"
                  placeholder="0"
                  min="0"
                  type="text"
                  maxLength="50"
                  autoComplete="off"
                  value={props.input.destAmount.value}
                  onFocus={props.input.destAmount.onFocus}
                  onBlur={props.input.destAmount.onBlur}
                  onChange={handleChangeDest}
                /> */}
                <BigInput 
                  value={props.input.destAmount.value}
                  onFocus={props.input.destAmount.onFocus}
                  onBlur={props.input.destAmount.onBlur}
                  handleChangeValue={handleChangeDest}
                  tokenSymbol={props.destTokenSymbol}
                  type={"dest"}
                  focus={props.focus}
                  errorExchange={errorExchange}
                  errorShow={errorShow}
                  isChangingWallet={props.isChangingWallet}
                />
              </div>
              <div className={`exchange-content__label ${errorExchange ? "error" : ""}`}>{props.destTokenSymbol}</div>
            </div>
          </div>

          <div className="exchange-rate-container container">
            <div className="exchange-rate__balance">
              {(!props.isChangingWallet && props.account !== false) && (
                <span>
                  <span className="exchange-rate__balance-text">Balance: </span>
                  <span className="exchange-rate__balance-amount">{props.addressBalance.roundingValue}</span>
                </span>
              )}
            </div>

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

        {(props.account === false || (props.isChangingWallet && props.changeWalletType === "swap")) &&
          <ImportAccount
            tradeType="swap"
            isChangingWallet={props.isChangingWallet}
            closeChangeWallet={props.closeChangeWallet}
            isIos={props.isIos}
            isAndroid={props.isAndroid}
          />
        || (
          <div className="import-account">
            <div className={"import-account__wallet-container container"}>
              <div className="import-account__wallet-connect">Connect your Wallet to Swap</div>
              <div className="import-account__wallet-type">
                <img className="import-account__wallet-image" src={getAssetUrl(`wallets/${props.account.type}.svg`)}/>
                <div className="import-account__wallet-content">
                  <span className="import-account__wallet-title">Your Wallet - </span>
                  <span className="import-account__wallet-name">PRIVATE KEY</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {props.account !== false && (
        <div className="exchange-account">
          <div className="exchange-account__container container">
            <div className="exchange-account__content">
              <div className="exchange-account__balance">{props.balanceLayout}</div>
              <div className="exchange-account__adv-config">{props.advanceLayout}</div>
            </div>

            <PostExchangeWithKey isChangingWallet={props.isChangingWallet}/>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div>
      {render}
      {props.transactionLoadingScreen}
    </div>
  )
}

export default ExchangeBodyLayout
