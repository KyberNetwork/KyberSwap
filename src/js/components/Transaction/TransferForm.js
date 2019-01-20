import React from "react"
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { filterInputNumber, restrictInputNumber, anyErrors } from "../../utils/validators";
import { ImportAccount } from "../../containers/ImportAccount";
import { AccountBalance } from "../../containers/TransactionCommon";
import { PostTransferWithKey } from "../../containers/Transfer";
import BLOCKCHAIN_INFO from "../../../../env";
import * as analytics from "../../utils/analytics";
import { RateBetweenToken } from "../../containers/Exchange";
import { getAssetUrl } from "../../utils/common";
import BigInput from "../Exchange/BigInput";
import { TermAndServices } from "../../containers/CommonElements";

const TransferForm = (props) => {
  function handleChangeAmount(e) {
    var check = filterInputNumber(e, e.target.value, props.input.amount.value)
    if (check) props.input.amount.onChange(e)
  }

  function getWalletName() {
    if (props.walletName === "") {
      switch (props.account.type) {
        case "metamask":
          return "METAMASK"
        case "keystore":
          return "JSON"
        case "ledger":
          return "LEDGER"
        case "trezor":
          return "TREZOR"
        case "privateKey":
          return "PRIVATE KEY"
        case "promoCode":
          return "PROMO CODE"
        default:
          return "WALLET"
      }
    } else {
      return props.walletName
    }
  }

  if (props.errors.amountTransfer && props.defaultShowAmountErrorTooltip) {
    setTimeout(() => {
      ReactTooltip.show(document.getElementById("transfer-amount-error-trigger"))
      props.setDefaulAmountErrorTooltip(false)
    }, 300)
  }

  if (!props.errors.amountTransfer && !props.defaultShowAmountErrorTooltip) {
    setTimeout(() => {
      props.setDefaulAmountErrorTooltip(true)
    }, 300)
  }

  function isError() {
    if (props.errors.amountTransfer || props.errors.destAddress) {
      return true
    }
    return false
  }

  var errorShow = (
    <div>
      {props.errors.amountTransfer && <div>{props.translate(props.errors.amountTransfer)}</div>}
      {props.errors.destAddress && <div>{props.translate(props.errors.destAddress)}</div>}
    </div>
  )
  function getWalletIconName(type, walletName) {
    if (walletName === "PROMO CODE") {
      return "promo_code";
    }

    return type;
  }

  var importAccount = function () {
    if (props.account === false || (props.isChangingWallet && props.changeWalletType === "transfer")) {
      return (<ImportAccount
        tradeType="transfer"
        isChangingWallet={props.isChangingWallet}
        closeChangeWallet={props.closeChangeWallet}
      />)
    }
  }

  return (
    <div>
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
              <div className={"exchange-content__item--wrapper"}>
                <div className={"exchange-item-label"}>{props.translate("transaction.exchange_from") || "From"}:</div>
                <div className={`exchange-content__item exchange-content__item--left exchange-content__item--transfer  select-token ${props.errors.amountTransfer ? "error" : ""}`}>
                  <div className={`input-div-content`}>
                    <div className={"exchange-content__label-content"}>
                      <div className="exchange-content__select select-token-panel">{props.tokenTransferSelect}</div>
                    </div>
                    <div className={"exchange-content__input-container"}>
                      <div className={"main-input main-input__left"}>
                        <div id="transfer-amount-error-trigger" className="input-tooltip-wrapper" data-tip={`<div>${props.translate(props.errors.amountTransfer)}</div>`} data-html={true} data-event='click focus' data-for="transfer-amount-error" data-scroll-hide="false"
                          >
                          <input
                            className={`exchange-content__input ${props.account !== false ? 'has-account' : ''}`}
                            type="text"
                            min="0"
                            step="0.000001"
                            placeholder="0"
                            id="inputSource"
                            value={props.input.amount.value}
                            onChange={handleChangeAmount}
                            onBlur={props.onBlur}
                            onFocus={props.onFocus}
                            maxLength="50"
                            autoComplete="off"
                          />
                        </div>
                        {props.account !== false && (
                          <div className={`exchange-content__label exchange-content__label--right trigger-swap-modal`}>{props.transferBalance}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  {props.errors.amountTransfer &&
                    <ReactTooltip globalEventOff="click" html={true} place="bottom" className="select-token-error" id="transfer-amount-error" type="light" />
                  }
                </div>

              </div>

              <div className={"exchange-content__item--middle"}>
                <i className="k k-transfer k-3x"></i>
              </div>

              <div className={"exchange-content__item--wrapper"}>
                <div className={"exchange-item-label"}>To Address:</div>
                <div className={"exchange-content__item exchange-content__item--right"}>
                  <div className={`input-div-content ${isError() ? "error" : ""}`}>
                    <div className="exchange-content__input-container exchange-content__input-container--to">
                      <div className={`main-input main-input__right main-input__right--transfer ${props.errors.destAddress && props.focus === "to-addr" ? "error" : ''}`}>
                        <input
                          className={`exchange-content__input exchange-content__input-address ${props.errors.destAddress ? "error" : ''}`}
                          value={props.input.destAddress.value}
                          onChange={props.input.destAddress.onChange}
                          placeholder="0x0de..."
                          onFocus={props.onFocusAddr}
                          onBlur={props.onBlur}
                        />
                        {props.qcCode}
                      </div>
                      {props.focus === "to-addr" && props.errors.destAddress && <div className={props.errors.destAddress ? "error-msg" : ""}>
                        {props.translate(props.errors.destAddress)}
                      </div>}
                    </div>
                  </div>
                  {props.focus === "to-addr" && props.errors.destAddress && <div className={props.errors.destAddress ? "mobile-error__show" : ""}>
                    {props.translate(props.errors.destAddress)}
                  </div>}
                </div>
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
            </div>
          </div>

          {!props.isAgreedTermOfService &&
            <div className={"exchange-content__accept-term"}>
              <div className={"accept-buttom"} onClick={(e) => props.acceptTerm()}>Transfer Now</div>
              <TermAndServices tradeType="transfer" />

              <div className={"list-wallet"}>
                <div className={"list-wallet__item"}>
                  <div className={"item-icon item-icon__metamask"}></div>
                  <div className={"wallet-name"}>METAMASK</div>
                </div>
                <div className={"list-wallet__item"}>
                  <div className={"item-icon item-icon__ledger"}></div>
                  <div className={"wallet-name"}>LEDGER</div>
                </div>
                <div className={"list-wallet__item"}>
                  <div className={"item-icon item-icon__trezor"}></div>
                  <div className={"wallet-name"}>TREZOR</div>
                </div>
                <div className={"list-wallet__item"}>
                  <div className={"item-icon item-icon__keystore"}></div>
                  <div className={"wallet-name"}>KEYSTORE</div>
                </div>
                <div className={"list-wallet__item"}>
                  <div className={"item-icon item-icon__privatekey"}></div>
                  <div className={"wallet-name"}>PRIVATE KEY</div>
                </div>
                <div className={"list-wallet__item"}>
                  <div className={"item-icon item-icon__promocode"}></div>
                  <div className={"wallet-name"}>PROMOCODE</div>
                </div>
              </div>
            </div>
          }

          {props.isAgreedTermOfService && importAccount()}
        </div>

        {/* {props.account !== false && (
          <div className="exchange-account">
            <div className="exchange-account__container container">
              <div className="exchange-account__content">
                <div className="exchange-account__balance">{props.balanceLayout}</div>
                <div className="exchange-account__adv-config">{props.advanceLayout}</div>
              </div>

              <PostTransferWithKey isChangingWallet={props.isChangingWallet} />
            </div>
          </div>
        )} */}

        {props.account !== false && (
          <div className="exchange-account">
            <div className="exchange-account__wrapper">
              <div className={"exchange-account__wrapper--reimport"}>
                <div className={"reimport-msg"} onClick={(e) => props.clearSession(e)}>Connect other wallet</div>
              </div>
              <div className="exchange-account__container container">
                <div className={`exchange-account__content ${props.isBalanceActive ? 'exchange-account__content--open' : ''}`}>
                  <div className="exchange-account__balance">{props.balanceLayout}</div>
                  <div className="exchange-account__adv-config">{props.advanceLayout}</div>
                </div>

                <PostTransferWithKey isChangingWallet={props.isChangingWallet} />
              </div>
            </div>
          </div>
        )}
      </div>

      {props.transactionLoadingScreen}
    </div>
  )
}

export default TransferForm
