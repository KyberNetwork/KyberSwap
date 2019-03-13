
import React from "react"
import * as analytics from "../../utils/analytics"

const AdvanceAccount = (props) => {

  return (
    <div className="exchange-account">

      <div className="exchange-account__wrapper">

        <div className="exchange-account__container container">
          {props.isAdvanceActive && (
            <div className={`exchange-account__content`}>
              <div className="advance-close" onClick={props.toggleAdvanceContent}>
                <div className="advance-close_wrapper"></div>
              </div>
              {props.tradeType === "swap" ? props.getAccountTypeHtml(true) : ''}
              <div className={`exchange-account__balance exchange-account__content--open`}>{props.balanceLayout}</div>
              <div className={`exchange-account__adv-config exchange-account__content--open`}>{props.advanceLayout}</div>
            </div>
          )}

          {props.postWithKey}

          {!props.isOnDAPP && <div className={"exchange-account__wrapper--reimport"}>
            <div className={"reimport-msg"} onClick={(e) => props.clearSession(e)}>
              {props.translate("import.connect_other_wallet") || "Connect other wallet"}
            </div>
          </div>}

        </div>
      </div>
    </div>
  )
}
export default AdvanceAccount