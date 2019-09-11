import React from "react"
import { Modal } from "../CommonElement"

const AdvanceAccount = (props) => {
  var getContent = () => {
    if (!props.isAdvanceActive) return ""
    return (
      <div className={`exchange-account__content`}>
        <div className="advance-close" onClick={props.toggleAdvanceContent}>
          <div className="advance-close_wrapper"></div>
        </div>
        {props.tradeType === "swap" ? props.getAccountTypeHtml(true) : ''}
        <div className={`exchange-account__balance exchange-account__content--open`}>{props.balanceLayout}</div>
        <div className={`exchange-account__adv-config exchange-account__content--open`}>{props.advanceLayout}</div>
      </div>
    )
  }

  var getMobileContent = () => {
    return (
      <Modal className={{
        base: 'reveal large advance-modal',
        afterOpen: 'reveal large advance-modal'
      }}
        isOpen={props.isAdvanceActive}
        onRequestClose={props.toggleAdvanceContent}
        contentLabel="advance modal"
        content={getContent()}
        size="large"
      />
    )
  }

  return (
    <div className="exchange-account">
      <div className="exchange-account__wrapper">
        <div className="exchange-account__container">
          {props.isOnMobile ? getMobileContent() :
            getContent()
          }
          {props.postWithKey}
          {!props.isOnDAPP && <div className={"exchange-account__wrapper--reimport"}>
            <div className={"reimport-msg"}>
              <div>
                {props.translate("import.connect_other_wallet") || "Connect other wallet"}
              </div>              

            </div>
          </div>}

        </div>
      </div>

    </div>
  )
}
export default AdvanceAccount
