import React from "react"

const ImportByWalletLinkView = (props) => {
  return (
    <div className="import-account__block theme__import-button" onClick={(e) => props.connect(e)}>
      <div className="import-account__icon wallet-link"/>
      <div className="import-account__name">WALLETLINK</div>
    </div>
  )
};

export default ImportByWalletLinkView
