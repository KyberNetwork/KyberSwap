import React from "react"
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { filterInputNumber, restrictInputNumber, anyErrors } from "../../utils/validators";
import { ImportAccount } from "../../containers/ImportAccount";
import { AccountBalance } from "../../containers/TransactionCommon";
import { PostTransferWithKey } from "../../containers/Transfer";
import BLOCKCHAIN_INFO from "../../../../env";
import * as analytics from "../../utils/analytics"

const TransferForm = (props) => {
  function handleChangeAmount(e) {
    var check = filterInputNumber(e, e.target.value, props.input.amount.value)
    if (check) props.input.amount.onChange(e)
  }

  function getStatusClasses(className) {
    let classes = '';

    classes += (props.global.isIos || props.global.isAndroid) ? ' ' + className + '--mobile' : '';
    classes += props.isAgreed ? ' ' + className + '--agreed' : '';
    classes += props.account !== false ? ' ' + className + '--imported' : '';
    classes += props.isChangingWallet ? ' ' + className + '--imported__change-wallet' : '';

    return classes;
  }

  var classSource = "amount-input"
  if (props.focus === "source") {
    classSource += " focus"
  }
  if (props.errors.amountTransfer && !props.isChangingWallet) {
    classSource += " error"
  }
  var render = (
    <div id="transfer-screen">
      <div className="grid-x">
        <div className={"cell medium-6 large-3 balance-wrapper-normal " + (props.isOpenLeft ? "balance-wrapper-opened" : "balance-wrapper-closed") + (anyErrors(props.errors) ? " error" : "")} id="balance-account-wrapper">
          {/* <AccountBalance
            chooseToken = {props.chooseToken}
            sourceActive = {props.tokenSymbol}
            destTokenSymbol='ETH'
            isChartActive={props.isChartActive}
            chartTimeRange={props.chartTimeRange}
            onChangeChartRange={props.onChangeChartRange}
            onToggleChartContent={props.onToggleChartContent}
          /> */}
          {props.isOpenLeft && (
            <div className="close-indicator close-wallet" onClick={(e) => props.toggleLeftPart(false)}>
              <div>{props.translate("transaction.close") || "Close"}</div>
              <div className="wings-dropdown"></div>
            </div>
          )}

          {props.balanceLayout}
        </div>
        <div class={"cell medium-6 large-9 swap-wrapper swap-wrapper--transfer" + getStatusClasses("swap-wrapper")}>
          {!props.isOpenLeft &&
            (
              <div className="toogle-side toogle-wallet" onClick={(e) => {props.toggleLeftPart(true)}}>
                <div className="toogle-content toogle-content-wallet">
                  <div>{props.translate("transaction.wallet") || "Wallet"}</div>
                </div>
                <div className="wings-dropdown"></div>
              </div>
            )
            // return <div><button onClick={(e) => this.toggleLeftPart(true) }>Open left</button></div>
          }
          <div className="transfer-detail grid-x exchange-col">
            <div className="cell small-12 large-8 transfer-col transfer-col-1">
              <div className={"swap-content swap-content--transfer" + getStatusClasses("swap-content")}>
                {props.networkError !== "" && (
                  <div className="network_error">
                    <span>
                      <img src={require("../../../assets/img/warning.svg")} />
                    </span>
                    <span>
                      {props.networkError}
                    </span>
                  </div>
                )}

                {/* <div className="title main-title">{props.translate("transaction.transfer") || "Transfer"}</div> */}
                <div className="grid-x">
                  <div className="cell small-12">
                    <div className={props.errors.destAddress !== '' && !props.isChangingWallet ? "error receiveAddress" : "receiveAddress"}>
                      <span className="transaction-label">{props.translate("transaction.address") || "Receiving Address"}</span>
                      <input className="hashAddr" value={props.input.destAddress.value} onChange={props.input.destAddress.onChange} placeholder="0x0de..." onFocus={(e) => analytics.trackClickInputRecieveAddress()} >
                      </input>
                      {props.errors.destAddress && !props.isChangingWallet &&
                        <span class="error-text">{props.translate(props.errors.destAddress)}</span>
                      }
                    </div>
                  </div>
                  <div className="cell small-12 transfer-col-1-2">
                    <div>
                      <span className="transaction-label">
                        {props.translate("transaction.exchange_from") || "From"}
                      </span>
                      <div className={props.errors.amountTransfer !== '' ? "error select-token-panel transfer-select grid-x" : "select-token-panel transfer-select grid-x"}>
                        <div className="cell small-12 medium-12 large-6">
                          {props.tokenTransferSelect}
                        </div>

                        <div className="cell small-12 medium-12 large-6">
                          <div className={classSource}>
                            <div>
                              <input type="text" min="0" step="0.000001" placeholder="0"
                                id="inputSource"
                                value={props.input.amount.value} className="transfer-input"
                                onChange={handleChangeAmount}
                                onBlur={props.onBlur}
                                onFocus={props.onFocus}
                                maxLength="50" autoComplete="off"
                              />
                            </div>
                            {/* <div>
                              <span>{props.tokenSymbol}</span>
                            </div> */}
                          </div>
                        </div>
                      </div>
                      {props.errors.amountTransfer && !props.isChangingWallet &&
                        <span class="error-text">{props.translate(props.errors.amountTransfer)}</span>
                      }
                    </div>
                    {!props.isChangingWallet ? props.addressBalanceLayout : ''}
                  </div>
                </div>

                <div className="swap-button-wrapper">
                  <div className="transfer-btn">
                    <PostTransferWithKey isChangingWallet={props.isChangingWallet} />
                  </div>

                  {(props.account === false || (props.isChangingWallet && props.changeWalletType === "transfer") ) && (
                    <ImportAccount tradeType="transfer" isChangingWallet={props.isChangingWallet} closeChangeWallet={props.closeChangeWallet} />
                  )}
                </div>
              </div>
            </div>
            <div className={"cell small-12 large-4 transfer-col transfer-advanced large-offset-0 " + (props.isOpenRight ? "advance-layout" : "advance-layout-closed") }>
              {props.isOpenRight && (
                <div onClick={(e) => props.toggleRightPart(false)}>
                  <div className="close-indicator close-advance">
                    <div>{props.translate("transaction.close") || "Close"}</div>
                  </div>
                  <div className="advance-title-mobile open-advance title">
                    <div>
                      {props.translate("transaction.advanced") || "Advanced"}
                      {/* <img src={require("../../../assets/img/exchange/arrow-down-swap.svg")} id="advance-arrow" /> */}
                      <div id="advance-arrow"></div>
                    </div>
                  </div>
                </div>
              )}
              {props.advanceLayout}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  return (

    <div>
      {render}
      {props.transactionLoadingScreen}
    </div>
  )
}

export default TransferForm
