import React from "react"

const ImportAccountView = (props) => {
  var isOnMobile = props.onMobile.isIOS || props.onMobile.isAndroid;

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
          {!isOnMobile &&
          <div className="import-account__item">
            {props.metamaskImport}
          </div>
          }

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

          {isOnMobile &&
          <div class="import-account__item import-account__item--mobile">
            <div></div>
            <div>
              <div>Coinbase Wallet</div>
              <div>Ethereum Wallet & DApp Browser</div>
            </div>
            <a href={props.onMobile.isIOS ? "https://itunes.apple.com/us/app/coinbase-wallet/id1278383455?mt=8" : "https://play.google.com/store/apps/details?id=org.toshi&hl=en"} target="_blank">
              {props.translate("address.download") || "Download"}
            </a>
          </div>
          }

          <div className={"import-account__item" + isOnMobile ? " import-account__item--mobile" : ""}>
            {props.privateKeyImport}
          </div>

          <div className={"import-account__item" + isOnMobile ? " import-account__item--mobile" : ""}>
            {props.promoCodeImport}
          </div>
        </div>
      </div>
      {props.errorModal}
    </div>
  )
}

export default ImportAccountView
