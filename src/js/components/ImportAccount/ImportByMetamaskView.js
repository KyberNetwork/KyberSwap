import React from "react"

const ImportByMetamaskView = (props) => {
  return (
    <div className="import-account__block theme__import-button" onClick={(e) => props.connect(e)}>
      <div className="import-account__icon metamask"/>
      <div className="import-account__name theme__text-4">
          <h3>
            {props.translate("import.from_metamask") || "METAMASK"}
          </h3>
        </div>
    </div>
  )
}

export default ImportByMetamaskView
