import React from "react"

const ImportByMetamaskView = (props) => {
  return (
    <div className="import-account__block theme__import-button" onClick={(e) => props.connect(e)}>
      <div className="import-account__icon metamask"/>
      <div className="import-account__name">{props.translate("import.from_metamask") || "METAMASK"}</div>
    </div>
  )
}

export default ImportByMetamaskView
