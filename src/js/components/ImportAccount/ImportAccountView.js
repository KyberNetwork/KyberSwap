import React from "react"

const ImportAccountView = (props) => {
  var downloadOnMobile = (
    <div class="onmobile-only">
      <div className="mobile-left">
        <div className="mobile-left-icon"></div>
        <div className="mobile-left-content">
          <div className="mobile-left-content-title">Coinbase Wallet</div>
          <div className="mobile-left-content-desc">Ethereum Wallet & DApp Browser</div>
        </div>
      </div>
      {props.onMobile.isIOS && <a className="mobile-btn" href="https://itunes.apple.com/us/app/coinbase-wallet/id1278383455?mt=8" target="_blank">{props.translate("address.download") || "Download"}</a>}
      {props.onMobile.isAndroid && <a className="mobile-btn" href="https://play.google.com/store/apps/details?id=org.toshi&hl=en" target="_blank">{props.translate("address.download") || "Download"}</a>}
    </div>
  )

  var isOnMobile = props.onMobile.isIOS || props.onMobile.isAndroid

  return (
    <div className="import-account">
      {/*{props.isChangingWallet && (*/}
        {/*<div className="close-change-wallet">*/}
          {/*<div>{props.translate("transaction.change_wallet") || "Change Wallet"}</div>*/}
          {/*<div></div>*/}
          {/*<div onClick={(e) => props.closeChangeWallet()}></div>*/}
        {/*</div>*/}
      {/*)}*/}

      <div className="import-account__choose-wallet-container container">
        <h1 className="import-account__title">{props.translate("address.import_address") || "Connect your Wallet to Swap"}</h1>

        <div className="import-account__content">
          <div className={`import-account__item ${isOnMobile ? "onmobile-only-wrapper" : ""}`}>
            {isOnMobile ? downloadOnMobile : props.metamaskImport}
          </div>

          {!isOnMobile &&
          <div className="import-account__item">
            {props.keystoreImport}
          </div>
          }

          {!isOnMobile &&
          <div className="import-account__item">
            {props.trezorImport}
          </div>
          }

          {!isOnMobile &&
          <div className="import-account__item">
            {props.ledgerImport}
          </div>
          }

          <div className="import-account__item">
            {props.privateKeyImport}
          </div>

          <div className="import-account__item">
            {props.promoCodeImport}
          </div>
        </div>
      </div>
      {props.errorModal}
    </div>
  )
}

export default ImportAccountView
