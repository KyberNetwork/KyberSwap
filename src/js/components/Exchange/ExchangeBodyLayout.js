import React from "react"
import ReactTooltip from 'react-tooltip'
import { filterInputNumber } from "../../utils/validators";
import { ImportAccount } from "../../containers/ImportAccount";
import { PostExchange } from "../../containers/Exchange";
import { RateBetweenToken } from "../../containers/Exchange";
import * as converters from "../../utils/converter";
import { getFormattedDate } from "../../utils/common";
import { AdvanceAccount } from "../../containers/TransactionCommon";
import BalancePercentage from "../TransactionCommon/BalancePercentage";

const ExchangeBodyLayout = (props) => {
  const { isOnMobile, campaign } = props.global;

  function handleChangeSource(e) {
    var check = filterInputNumber(e, e.target.value, props.input.sourceAmount.value)
    if (check) props.input.sourceAmount.onChange(e)
  }

  function handleChangeDest(e) {
    var check = filterInputNumber(e, e.target.value, props.input.destAmount.value)
    if (check) props.input.destAmount.onChange(e)
  }

  var errorSource = []
  var errorExchange = false

  Object.values(props.exchange.errors.sourceAmount).map(value => {
    errorExchange = true
    errorSource.push(value)
  });

  if(props.global.eligibleError) {
    errorExchange = true
    errorSource.push(props.global.eligibleError)
  }

  const errorShow = errorSource.map((value, index) => {
    return <div className={"exchange__error-item"} key={index}>{value}</div>
  });

  var importAccount = function () {
    if (props.account === false || (props.isChangingWallet && props.changeWalletType === "swap")) {
      return (
        <ImportAccount
          tradeType="swap"
          isChangingWallet={props.isChangingWallet}
          closeChangeWallet={props.closeChangeWallet}
          isAgreedTermOfService={props.isAgreedTermOfService}
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
    <div className={"exchange__form theme__background-2"}>
      {(campaign !== null && (props.sourceTokenSymbol === campaign.tokenSymbol || props.destTokenSymbol === campaign.tokenSymbol)) && (
        <div className="common__text-center">
          <p className="common__notification theme__border-3 theme__background-11" dangerouslySetInnerHTML={{ __html: campaign.link }}/>
        </div>
      )}

      <div>
        {props.account && props.account.type === "promo" && props.account.info.description !== ""
          && <div className={"promo-description theme__text-3"}>
            <div className="promo-description--icon">
              <img src={require("../../../assets/img/exchange/tick.svg")} />
            </div>
            <div className="promo-description--message">
              <div>{props.account.info.description}</div>
              <div>
                {props.account.info.promoType === "swap" && <span>{props.translate("transaction.please_swap_and_send_before") || "Please swap and send to your personal wallet before"}</span>}
                {props.account.info.promoType === "payment" && <span>{props.translate("transaction.please_swap_before") || "Please swap before"}</span>}
                {' '}
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
          <div className={"exchange-content"}>
            <div className={"exchange-content__item--wrapper"}>
              <div className={"exchange-item-label"}>{props.translate("transaction.exchange_from") || "From"}:</div>
              <div className={`exchange-content__item exchange-content__item--left theme__background-4 select-token ${props.account !== false ? 'has-account' : ''} ${errorExchange ? "error" : ""}`}>
                <div className={`input-div-content`}>
                  <div className={"exchange-content__label-content"}>
                    <div className="exchange-content__select select-token-panel">{props.tokenSourceSelect}</div>
                  </div>
                  <div className={`exchange-content__input-container`}>
                    <div className={"main-input main-input__left"}>
                      <div id="swap-error-trigger" className="input-tooltip-wrapper">
                        <input
                          className={`exchange-content__input theme__background-4 theme__text-4 ${props.account !== false ? 'has-account' : ''}`}
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
                    </div>
                  </div>
                </div>
              </div>

              {errorExchange &&
                <div className={"exchange__error"}>{errorShow}</div>
              }

              {props.account !== false && (
                <div className={"common__flexbox"}>
                  <div className={"exchange__balance"}>
                    <div>{props.sourceTokenSymbol} Balance</div>
                    <div>{props.addressBalance.roundingValue} {props.sourceTokenSymbol}</div>
                  </div>

                  <BalancePercentage
                    addressBalance={props.addressBalance.value}
                    gas={props.exchange.gas}
                    gasPrice={props.exchange.gasPrice}
                    sourceTokenSymbol={props.sourceTokenSymbol}
                    changeSourceAmount={props.changeSourceAmount}
                  />
                </div>
              )}
            </div>
            <div className={"exchange-content__item--middle"}>
              <span data-tip={props.translate('transaction.click_to_swap') || 'Click to swap'} data-for="swap-icon" currentitem="false">
                <i className="exchange__swap-icon" onClick={(e) => props.swapToken(e)}/>
              </span>
              <ReactTooltip place="bottom" id="swap-icon" className={"common-tooltip common-tooltip--bottom"} type="light"/>
            </div>
            <div className={"exchange-content__item--wrapper"}>
              <div className={"exchange-item-label"}>{props.translate("transaction.exchange_to") || "To"}:</div>
              <div className={"exchange-content__item exchange-content__item--right theme__background-4"}>
                <div className={`input-div-content`}>
                  <div className={"exchange-content__label-content"}>
                    <div className="exchange-content__select select-token-panel">{props.tokenDestSelect}</div>
                  </div>
                  <div className={`exchange-content__input-container`}>
                    <div className={"main-input main-input__right"}>
                      <input
                        className={`exchange-content__input theme__background-4 theme__text-4`}
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

              <div className="exchange-rate-container">
                <div className={"exchange-rate-container__left"}>
                  <RateBetweenToken
                    isSelectToken={props.exchange.isSelectToken}
                    exchangeRate={{
                      sourceToken: props.sourceTokenSymbol,
                      rate: converters.toT(props.exchange.expectedRate),
                      destToken: props.destTokenSymbol
                    }}
                  />
                </div>
              </div>

              {props.account !== false && (
                <div className="top-token">
                  <div className="top-token-more" onClick={props.toggleAdvanceContent}>{props.translate("transaction.advanced") || "Advanced"}</div>
                  <div className={`top-token__arrow common__triangle theme__border-top ${props.isAdvanceActive ? 'up' : ''}`}/>
                </div>
              )}

              {(props.account !== false && props.isAdvanceActive) && (
                <AdvanceAccount
                  advanceLayout={props.advanceLayout}
                  isOpenAdvance={props.isOpenAdvance}
                />
              )}
            </div>
          </div>
        </div>

        {props.account === false && importAccount()}
      </div>

      {props.account !== false &&
        <PostExchange/>
      }
    </div>
  )
}

export default ExchangeBodyLayout
