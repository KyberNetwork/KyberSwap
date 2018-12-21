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

const TransferForm = (props) => {
  function handleChangeAmount(e) {
    var check = filterInputNumber(e, e.target.value, props.input.amount.value)
    if (check) props.input.amount.onChange(e)
  }

  function getWalletName() {
    if (props.walletName === "") {
      switch(props.account.type) {
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
              <div className={"exchange-content__item exchange-content__item--left exchange-content__item--transfer"}>
                <div className={`input-div-content ${props.errors.amountTransfer ? "error" : ""}`}>
                  <div className={"exchange-content__label-content"}>
                    <div className="exchange-content__label exchange-content__label--wide">
                      {props.translate("transaction.exchange_from") || "From"}
                    </div>
                    <div className="exchange-content__select select-token-panel">{props.tokenTransferSelect}</div>
                  </div>
                  <div className={`exchange-content__input-container ${props.errors.amountTransfer ? "error" : ""}`}>
                    {/* <BigInput
                      value={props.input.amount.value}
                      onFocus={props.onFocus}
                      onBlur={props.onBlur}
                      handleChangeValue={handleChangeAmount}
                      tokenSymbol={props.sourceActive}
                      type={"transfer"}
                      errorExchange={isError()}
                      errorShow={errorShow}
                      isChangingWallet={props.isChangingWallet}
                    /> */}
                    <div className={"main-input main-input__left"}>
                      <input
                        className={`exchange-content__input ${isError() ? "error" : ""}`}
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
                      <div className={`exchange-content__label ${props.errors.amountTransfer ? "error" : ""}`}>{props.sourceActive}</div>
                      {props.qcCode}
                    </div>
                    {props.focus === "source" && props.errors.amountTransfer && <div className={props.errors.amountTransfer ? "error-msg error-msg-source" : ""}>
                      {/* {!props.isChangingWallet ? props.errorShow : ''} */}
                      {props.translate(props.errors.amountTransfer)}
                    </div>}
                  </div>
                </div>
                {props.focus !== "ssource" && props.errors.amountTransfer && <div className={props.errors.amountTransfer ? "mobile-error__show" : ""}>
                  {props.translate(props.errors.amountTransfer)}
                </div>}
              </div>

              <div className={"exchange-content__item--absolute"}>
                <i className="k k-transfer k-3x"></i>
              </div>

              <div className={"exchange-content__item exchange-content__item--right"}>
                <div className={`input-div-content ${isError() ? "error" : ""}`}>
                  <div className={"exchange-content__label-content"}>
                    <div className="exchange-content__label exchange-content__label--toaddr exchange-content__label--wide exchange-content__label--transfer">To Address</div>
                  </div>
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
                    </div>
                    {props.focus === "to-addr" && props.errors.destAddress && <div className={props.errors.destAddress ? "error-msg" : ""}>
                      {/* {!props.isChangingWallet ? props.errorShow : ''} */}
                      {props.translate(props.errors.destAddress)}
                    </div>}
                    {/* <BigInput
                      value={props.input.destAddress.value}
                      onFocus={(e) => analytics.trackClickInputRecieveAddress()}
                      handleChangeValue={props.input.destAddress.onChange}
                      type={"recieve-addr"}
                      errorExchange={isError()}
                      errorShow={errorShow}
                      // isChangingWallet={props.isChangingWallet}
                    /> */}
                    {/*{props.errors.destAddress && !props.isChangingWallet &&*/}
                      {/*<span class="error-text">{props.translate(props.errors.destAddress)}</span>*/}
                    {/*}*/}
                  </div>
                </div>
                {props.focus === "to-addr" && props.errors.destAddress && <div className={props.errors.destAddress ? "mobile-error__show" : ""}>
                  {props.translate(props.errors.destAddress)}
                </div>}
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

          {(props.account === false || (props.isChangingWallet && props.changeWalletType === "transfer")) &&
          <ImportAccount
            tradeType="transfer"
            isChangingWallet={props.isChangingWallet}
            closeChangeWallet={props.closeChangeWallet}
          />
          || (
            <div className="import-account">
              <div className={"import-account__wallet-container container"}>
                <div className="import-account__wallet-connect"
                  onClick={(e) => props.clearSession(e)}>
                  Connect your Wallet to Swap
                </div>
                <div className="import-account__wallet-type">
                  <img className="import-account__wallet-image" src={getAssetUrl(`wallets/${getWalletIconName(props.account.type, props.walletName)}.svg`)}/>
                  <div className="import-account__wallet-content">
                    <span className="import-account__wallet-title">Your Wallet - </span>
                    <span className="import-account__wallet-name">{getWalletName()}</span>
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

              <PostTransferWithKey isChangingWallet={props.isChangingWallet} />
            </div>
          </div>
        )}
      </div>

      {props.transactionLoadingScreen}
    </div>
  )
}

export default TransferForm
