import React from "react"
import ReactTooltip from 'react-tooltip'
import { filterInputNumber } from "../../utils/validators";
import { ImportAccount } from "../../containers/ImportAccount";
import { PostTransfer } from "../../containers/Transfer";
import { AdvanceAccount } from "../../containers/TransactionCommon"
import { CSSTransition } from "react-transition-group";

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

  var errorDestAddr = []
  var isErrorDestAddr = false  
  Object.values(props.transfer.errors.destAddress).map(value => {
    isErrorDestAddr = true
    errorDestAddr.push(value)
  })

  var errorSourceTooltip = ""
  errorSource.map((value, index) => {
    errorSourceTooltip += `<span class="error-text" key=${index}>${value}</span>`
  })
  var errorSourceSelector = document.getElementById("transfer-amount-error")
  if (errorSourceSelector) errorSourceSelector.innerHTML = `<div>${errorSourceTooltip}</div>`


  var errorDestAddrTooltip = ""
  errorDestAddr.map((value, index) => {
    errorDestAddrTooltip += `<span class="error-text" key=${index}>${value}</span>`
  })
  var errorDestSelector = document.getElementById("transfer-address-error")
  if (errorDestSelector) errorDestSelector.innerHTML = `<div>${errorDestAddrTooltip}</div>`

  var importAccount = function () {
    if (props.account === false || (props.isChangingWallet && props.changeWalletType === "transfer")) {
      return (
        <ImportAccount
          tradeType="transfer"
          isChangingWallet={props.isChangingWallet}
          closeChangeWallet={props.closeChangeWallet}
          isAgreedTermOfService={props.isAgreedTermOfService}
          isAcceptConnectWallet={props.isAcceptConnectWallet}
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
          <div className={"exchange-content container"}>
            <div className={"exchange-content__item--wrapper"}>
              <div className={"exchange-item-label"}>{props.translate("transaction.exchange_from") || "From"}:</div>
              <div className={`exchange-content__item exchange-content__item--left exchange-content__item--transfer
                select-token ${props.account !== false ? 'has-account' : ''} ${isErrorSource ? "error" : ""}`}>
                <div className={`input-div-content`}>
                  <div className={"exchange-content__label-content"}>
                    <div className="exchange-content__select select-token-panel">{props.tokenTransferSelect}</div>
                  </div>
                  <div className={"exchange-content__input-container"}>
                    <div className={"main-input main-input__left"}>
                      <CSSTransition mountOnEnter unmountOnExit classNames="top-token-number"
                        in={!props.errors.amountTransfer && props.input.amount.value > 0 && props.isSelectTokenBalance}
                        appear={true}
                        timeout={{ enter: 500, exit: 500 }}>
                          <div className={`top-token-number`} onClick={props.onFocus}>100%</div>
                      </CSSTransition>
                      <div id="transfer-amount-error-trigger" className="input-tooltip-wrapper" data-tip={`<div>${errorSourceTooltip}</div>`} data-html={true} data-event='click focus' data-for="transfer-amount-error" data-scroll-hide="false"
                      >
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
                {isErrorSource &&
                  <ReactTooltip globalEventOff="click" html={true} place="bottom" className="select-token-error" id="transfer-amount-error" type="light" />
                }
              </div>
              {props.account !== false && !props.isAdvanceActive && (
                <div className="top-token">
                  <div className="top-token-more" onClick={props.toggleAdvanceContent}>{props.translate("market.more") || "more"}</div>
                </div>
              )}
            </div>

            <div className={"exchange-content__item--middle"}>
              <i className="k k-transfer k-3x"></i>
            </div>

            <div className={"exchange-content__item--wrapper"}>
              <div className={"exchange-item-label"}>{props.translate("transaction.address") || "To Address"}:</div>
              <div className={`exchange-content__item exchange-content__item--right select-token ${isErrorDestAddr ? "error" : ""}`}>
                <div className={`input-div-content`}>
                  <div className="exchange-content__input-container exchange-content__input-container--to exchange-content__transfer-addr">
                    <div id="transfer-address-error-trigger" className="input-tooltip-wrapper" data-tip={`<div>${errorDestAddrTooltip}</div>`} data-html={true} data-event='click focus' data-for="transfer-address-error" data-scroll-hide="false"
                    >
                      <input
                        className={`exchange-content__input theme__background-4 theme__text-4 exchange-content__input-address`}
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
                {isErrorDestAddr &&
                  <ReactTooltip globalEventOff="click" html={true} place="bottom" className="select-token-error" id="transfer-address-error" type="light" />
                }
              </div>
            </div>
          </div>

          <div className="exchange-rate-container">
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
          postWithKey={<PostTransfer />}
          screen={"transfer"}
        />
      )}
    </div>
  )
}

export default TransferForm
