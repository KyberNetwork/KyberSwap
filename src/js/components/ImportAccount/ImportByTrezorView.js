import React from "react"

const ImportByTrezorView = (props) => {
  return (
    <div>
      <div class="importer trezor" onClick={(e) => props.showLoading('trezor')}>
        <div className="importer__symbol">
          <img src={require('../../../assets/img/landing/trezor_active.svg')} />
          <div className="importer__name">{props.translate("import.from_trezor") || "TREZOR"}</div>
        </div>
        <div className="importer__button">
          {props.translate("import.swap_from_trezor") || "Swap from Trezor"}
        </div>
      </div>
    </div>
  )
}

export default ImportByTrezorView
