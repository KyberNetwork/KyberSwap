import React, { Fragment } from "react";
import {
  ImportKeystore,
  ImportByPrivateKey,
  ImportByMetamask,
  ImportByDeviceWithLedger,
  ImportByDeviceWithTrezor,
  ImportByPromoCode,
  ImportByOther
} from "../../containers/ImportAccount";

const ImportAccountView = (props) => {
  const isOnMobile = props.onMobile.isIOS || props.onMobile.isAndroid;
  const { isIOS: isIos, isAndroid } = props.onMobile;
  const isLimitOrder = props.tradeType === "limit_order";

  let importAccountTitle = props.translate("address.connect_your_wallet_to_swap") || "Connect your Wallet to Swap";
  if (props.tradeType === "transfer") {
    importAccountTitle = props.translate("address.connect_your_wallet_to_transfer") || "Connect your Wallet to Transfer";
  } else if (props.tradeType === "limit_order") {
    importAccountTitle = props.translate("address.connect_your_wallet_to_limit_order") || "You must sign in and import your wallet to submit limit order";
  }

  return (
    <div className={`import-account ${isLimitOrder ? 'theme__background-2' : ''}`}>
      <div className="import-account__choose-wallet-container container">
        {props.isAgreedTermOfService && props.tradeType !== "limit_order" && (
          <h1 className="import-account__title">
            {importAccountTitle}
          </h1>
        )}

        {props.tradeType === "limit_order" && (
          <h1 className="import-account__title">
            {importAccountTitle}
          </h1>
        )}

        {!isLimitOrder && (
          <div className="import-account__title--inactive">
            <div className="import-account__title-separator theme__border-2"/>
            <div className="import-account__title-content theme__background-2 theme__text-4">
              {props.translate("address.or_connect_with") || "Or Connect with"}
            </div>
          </div>
        )}

        <div className={`import-account__content ${props.isAcceptConnectWallet ? "import-account__content--animation" : ""} ${isOnMobile ? ' import-account__content--mobile' : ''}`}>
          {!isOnMobile &&
            <Fragment>
              <div className={`import-account__item`}>
                <ImportByMetamask />
              </div>
              <div className={`import-account__item import-account__item-ledger`}>
                <ImportByDeviceWithLedger />
              </div>
              <div className={`import-account__item import-account__item-trezor`}>
                <ImportByDeviceWithTrezor />
              </div>
              <div className={`import-account__item`}>
                <ImportKeystore />
              </div>
              {!isLimitOrder && (
                <div className={`import-account__item`}>
                  <ImportByPromoCode isOnMobile={isOnMobile} />
                </div>
              )}
              <div className={`import-account__item`}>
                <ImportByOther isOnMobile={isOnMobile} />
              </div>
            </Fragment>
          }
          
          {isOnMobile &&
            <Fragment>
              <div className={`import-account__item`}>
                <ImportByPrivateKey isOnMobile={isOnMobile} closeParentModal={props.closeModal}/>
              </div>
  
              {!isLimitOrder && (
                <div className={`import-account__item`}>
                  <ImportByPromoCode isOnMobile={isOnMobile} />
                </div>
              )}
              
              <div className="import-account__item download-app">
                <div className={"import-account__block"}>
                  <div className={"import-account__block-left"}>
                    <div className="import-account__icon kyberapp" />
                    <div>
                      <div className="import-account__name">KYBERSWAP APP</div>
                      <div className="import-account__desc">Ethereum Wallet & DApp</div>
                    </div>
                  </div>
                  {isIos && <a
                    className="import-account__block-right import-account__block-right--download"
                    href={"https://itunes.apple.com/us/app/kyberswap/id1453691309?ls=1&mt=8"}
                    target="_blank"
                    onClick={() => props.viewKyberSwapApp('IOS')}
                  >
                    {props.translate("address.download") || "Download"}
                  </a>}
                  {isAndroid && <a
                    className="import-account__block-right import-account__block-right--download"
                    href={"https://play.google.com/store/apps/details?id=com.kyberswap.android"}
                    target="_blank"
                    onClick={() => props.viewKyberSwapApp('Android')}
                  >
                    {props.translate("address.download") || "Download"}
                  </a>}
                </div>
              </div>
            </Fragment>
          }
        </div>
      </div>
      {props.errorModal}
    </div>
  )
}

export default ImportAccountView
