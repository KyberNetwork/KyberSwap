
import React from "react"
import * as analytics from "../../utils/analytics"
import { Modal } from "../CommonElement"
import ReactTooltip from 'react-tooltip'

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
  var confirmModal = () => {
    return (
      <div onClick={(e) => props.clearSession(e)}>Close modal</div>
    )
  }
  return (
    <div className="exchange-account">
      <div className="exchange-account__wrapper">
        <div className="exchange-account__container container">
          {props.isOnMobile ? getMobileContent() :
            getContent()
          }
          {props.postWithKey}
          {!props.isOnDAPP && <div className={"exchange-account__wrapper--reimport"}>
            <div className={"reimport-msg"}>
              <div data-for="connect-other-wallet" data-tip={confirmModal()} data-event='click focus' data-html={true}>
                {props.translate("import.connect_other_wallet") || "Connect other wallet"}
              </div>
              <ReactTooltip globalEventOff="click" html={true} place="top" id="connect-other-÷ " type="light" />
            </div>
          </div>}

        </div>
      </div>

    </div>
  )
}
export default AdvanceAccount