import React from "react"
import ReactTooltip from 'react-tooltip'
import { filterInputNumber } from "../../utils/validators";
import { ImportAccount } from "../../containers/ImportAccount";
import { AdvanceAccount } from "../../containers/TransactionCommon"
import { PostTransfer } from "../../containers/Transfer";
import BalancePercentage from "../TransactionCommon/BalancePercentage";

const TransferForm = (props) => {
  const { isOnMobile } = props.global;

  function handleChangeAmount(e) {
    var check = filterInputNumber(e, e.target.value, props.input.amount.value)
    if (check) props.input.amount.onChange(e)
  }

  var errorSource = []
  var isErrorSource = false  
  Object.values(props.transfer.errors.sourceAmount).map(value => {
    isErrorSource = true
    errorSource.push(value)
  })
  if(props.global.eligibleError) {
    isErrorSource = true
    errorSource.push(props.global.eligibleError)
  }

  var errorDestAddr = []
  var isErrorDestAddr = false  
  Object.values(props.transfer.errors.destAddress).map(value => {
    isErrorDestAddr = true
    errorDestAddr.push(value)
  })

  const sourceErrors = errorSource.map((value, index) => {
    return <div className={"exchange__error-item"} key={index}>{value}</div>
  });

  const destErrors = errorDestAddr.map((value, index) => {
    return <div className={"exchange__error-item"} key={index}>{value}</div>
  });

  var importAccount = function () {
    if (props.account === false || (props.isChangingWallet && props.changeWalletType === "transfer")) {
      return (
        <ImportAccount
          tradeType="transfer"
          isChangingWallet={props.isChangingWallet}
          closeChangeWallet={props.closeChangeWallet}
          isAgreedTermOfService={props.isAgreedTermOfService}
          acceptTerm={props.acceptTerm}
        />
      )
    }
  }

  return (
    <div className={"exchange__form theme__background-2"}>
      <div>
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
              <div className={`exchange-content__item exchange-content__item--left theme__background-4 exchange-content__item--transfer select-token ${props.account !== false ? 'has-account' : ''} ${isErrorSource ? "error" : ""}`}>
                <div className={`input-div-content`}>
                  <div className={"exchange-content__label-content"}>
                    <div className="exchange-content__select select-token-panel">{props.tokenTransferSelect}</div>
                  </div>
                  <div className={"exchange-content__input-container"}>
                    <div className={"main-input main-input__left"}>
                      <div className="input-tooltip-wrapper">
                        <input
                          className={`exchange-content__input theme__background-4 theme__text-4 ${props.account !== false ? 'has-account' : ''}`}
                          type={isOnMobile ? "number" : "text"}
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
                    </div>
                  </div>
                </div>
              </div>

              {isErrorSource &&
                <div className={"exchange__error"}>{sourceErrors}</div>
              }

              {props.account !== false && (
                <div className={"common__flexbox"}>
                  <div className={"exchange__balance"}>
                    <div>{props.tokenSymbol} Balance</div>
                    <div>{props.addressBalance.roundingValue} {props.tokenSymbol}</div>
                  </div>

                  <BalancePercentage
                    addressBalance={props.addressBalance.value}
                    gas={props.transfer.gas}
                    gasPrice={props.transfer.gasPrice}
                    sourceTokenSymbol={props.tokenSymbol}
                    changeSourceAmount={props.changeSourceAmount}
                  />
                </div>
              )}
            </div>

            <div className={"exchange-content__item--middle"}>
              <i className={"transfer__arrow"}/>
            </div>

            <div className={"exchange-content__item--wrapper"}>
              <div className={"exchange-item-label"}>{props.translate("transaction.address") || "To Address"}:</div>
              <div className={`exchange-content__item exchange-content__item--right theme__background-4 select-token ${isErrorDestAddr ? "error" : ""}`}>
                <div className={`input-div-content`}>
                  <div className="exchange-content__input-container exchange-content__input-container--to exchange-content__transfer-addr">
                    <div className="input-tooltip-wrapper">
                      <input
                        className={`exchange-content__input theme__background-4 theme__text-4 exchange-content__input-address ${props.global.isOnMobile && "p-l-50px" }`}
                        value={props.input.destAddress.value}
                        onChange={props.input.destAddress.onChange}
                        placeholder="0x0de..."
                        onFocus={props.onFocusAddr}
                        onBlur={props.onBlur}
                      />
                    </div>
                    {props.qcCode}
                  </div>
                </div>
              </div>

              {isErrorDestAddr &&
                <div className={"exchange__error"}>{destErrors}</div>
              }

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
        <PostTransfer destAddress={props.input.destAddress.value}/>
      }
    </div>
  )
}

export default TransferForm
