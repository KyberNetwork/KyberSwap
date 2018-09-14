import React from "react"

const ImportAccountView = (props) => {
  return (
    <div id="import-account">
      {props.isChangingWallet && (
        <div className="close-change-wallet">
          <div>{props.translate("transaction.change_wallet") || "Change Wallet"}</div>
          <div></div>
          <div onClick={(e) => props.closeChangeWallet()}></div>
        </div>
      )}
      <div className="frame">
        <div className="small-centered" id="import-acc">
          <div className="import-account">
            <div className="import-account__item">
              {props.firstKey}
            </div>
            <div className="import-account__item">
              {props.secondKey}
            </div>
            <div className="import-account__item">
              {props.thirdKey}
            </div>
            <div className="import-account__item">
              {props.fourthKey}
            </div>
            <div className="import-account__item">
              {props.fifthKey}
            </div>
          </div>
        </div>
        {props.errorModal}
      </div>
    </div>
  )
}

export default ImportAccountView
