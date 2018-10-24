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
    <div id="import-account">
    	<div className="landing-background">
      </div>
      <div className="frame">
        <div className="container">
          <div className="small-centered" id="import-acc">
            <h1 className="title">{props.translate("address.import_address") || "Import address"}</h1>

            <div className="import-account">
              <div className={`import-account__item ${isOnMobile ? "onmobile-only-wrapper" : ""}`}>
                {isOnMobile ? downloadOnMobile : props.firstKey}
              </div>
              {!isOnMobile && <div className="import-account__item">
                {props.secondKey}
              </div>}
              {!isOnMobile && <div className="import-account__item">
                {props.thirdKey}
              </div>}
              {!isOnMobile && <div className="import-account__item">
                {props.fourthKey}
              </div>}
              <div className="import-account__item">
                {props.fifthKey}
              </div>
              <div className="import-account__item">
                {props.sixthKey}
              </div>
            </div>
          </div>
        </div>
        {props.errorModal}
      </div>
    </div>
  )
}

export default ImportAccountView
