import React from "react";
import {
  ImportKeystore,
  ImportByDevice,
  ImportByPrivateKey,
  ImportByMetamask,
  ImportByDeviceWithLedger,
  ImportByDeviceWithTrezor,
  ImportByPromoCode
} from "../../containers/ImportAccount";

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

        <div className={`import-account__content ${isOnMobile ? ' import-account__content--mobile' : ''}`}>
          {!isOnMobile &&
          <div className="import-account__item">
            <ImportByMetamask/>
          </div>
          }

          {!isOnMobile &&
          <div className="import-account__item">
            <ImportKeystore/>
          </div>
          }

          {!isOnMobile &&
          <div className="import-account__item">
            <ImportByDeviceWithTrezor/>
          </div>
          }

          {!isOnMobile &&
          <div className="import-account__item">
            <ImportByDeviceWithLedger/>
          </div>
          }

          {isOnMobile &&
          <div class="import-account__item">
            <div className={"import-account__block"}>
              <div className={"import-account__block-left"}>
                <div className="import-account__icon coinbase"/>
                <div>
                  <div className="import-account__name">Coinbase Wallet</div>
                  <div className="import-account__desc">Ethereum Wallet & DApp Browser</div>
                </div>
              </div>
              <a
                className="import-account__block-right"
                href={props.onMobile.isIOS ? "https://itunes.apple.com/us/app/coinbase-wallet/id1278383455?mt=8" : "https://play.google.com/store/apps/details?id=org.toshi&hl=en"}
                target="_blank"
              >
                {props.translate("address.download") || "Download"}
              </a>
            </div>
          </div>
          }

          <div className={"import-account__item"}>
            <ImportByPrivateKey isOnMobile={isOnMobile}/>
          </div>

          <div className={"import-account__item"}>
            <ImportByPromoCode isOnMobile={isOnMobile}/>
          </div>
        </div>
      </div>
      {props.errorModal}
    </div>
  )
}

export default ImportAccountView
