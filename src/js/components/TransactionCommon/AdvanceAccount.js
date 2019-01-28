
import React from "react"
import * as analytics from "../../utils/analytics"

const AdvanceAccount = (props) => {
  
  return (
    <div className="exchange-account">
      <div className="exchange-account__wrapper">
        {!props.isOnDAPP && <div className={"exchange-account__wrapper--reimport"}>
          <div className={"reimport-msg"} onClick={(e) => props.clearSession(e)}>Connect other wallet</div>
        </div>}
        <div className="exchange-account__container container">
          <div className={`exchange-account__content`}>
            {props.tradeType === "swap" ? props.getAccountTypeHtml(true) : ''}
            <div className={`exchange-account__balance ${props.isBalanceActive ? 'exchange-account__content--open' : ''}`}>{props.balanceLayout}</div>
            <div className={`exchange-account__adv-config ${props.isAdvanceActive ? 'exchange-account__content--open' : ''}`}>{props.advanceLayout}</div>
          </div>

          {props.postWithKey}
        </div>
      </div>
    </div>
  )
}
export default AdvanceAccount