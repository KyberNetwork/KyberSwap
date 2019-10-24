import React from "react"


const ImportByTrezorView = (props) => {
  return (
    <div className="import-account__block theme__import-button" onClick={(e) => props.showLoading('trezor')}>
      <div className="import-account__icon trezor"/>
      <div className="import-account__name">{props.translate("import.from_trezor") || "TREZOR"}</div>
    </div>
  )
}

export default ImportByTrezorView
