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

const TransferForm = (props) => {
  function handleChangeAmount(e) {
    var check = filterInputNumber(e, e.target.value, props.input.amount.value)
    if (check) props.input.amount.onChange(e)
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
              <div className={"exchange-content__item exchange-content__item--left"}>
                <div className="exchange-content__label">{props.translate("transaction.exchange_from") || "From"}</div>
                <div className="exchange-content__select select-token-panel">{props.tokenTransferSelect}</div>
                <div className="exchange-content__input-container">
                  <input
                    className="exchange-content__input"
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
                  {/*{props.errors.amountTransfer && !props.isChangingWallet &&*/}
                    {/*<span class="error-text">{props.translate(props.errors.amountTransfer)}</span>*/}
                  {/*}*/}
                </div>
                <div className="exchange-content__label">{props.sourceActive}</div>
              </div>

              <div className={"exchange-content__item--absolute"}>
              <span data-tip={props.translate('transaction.click_to_swap') || 'Click to swap'} data-for="swap" currentitem="false">
                <i className="k k-exchange k-3x cur-pointer" onClick={(e) => props.swapToken(e)}></i>
              </span>
                <ReactTooltip place="bottom" id="swap" type="light"/>
              </div>

              <div className={"exchange-content__item exchange-content__item--right"}>
                <div className="exchange-content__label">To Address</div>
                <div className="exchange-content__input-container exchange-content__input-container--to">
                  <input
                    className="exchange-content__input"
                    value={props.input.destAddress.value}
                    onChange={props.input.destAddress.onChange}
                    placeholder="0x0de..."
                    onFocus={(e) => analytics.trackClickInputRecieveAddress()}
                  />
                  {/*{props.errors.destAddress && !props.isChangingWallet &&*/}
                    {/*<span class="error-text">{props.translate(props.errors.destAddress)}</span>*/}
                  {/*}*/}
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

          {(props.account === false || (props.isChangingWallet && props.changeWalletType === "transfer")) &&
          <ImportAccount
            tradeType="transfer"
            isChangingWallet={props.isChangingWallet}
            closeChangeWallet={props.closeChangeWallet}
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
