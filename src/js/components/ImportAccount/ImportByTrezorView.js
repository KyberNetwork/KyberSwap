import React from "react"

const ImportByTrezorView = (props) => {
  return (
    <div class="importer trezor">
      <a onClick={() => props.showLoading('trezor')}>
        <img src="/assets/img/trezor.svg" />
        <div class="description">{props.translate("import.from_trezor") || <span>Import from<br />trezor</span>}</div>
      </a>
    </div>
  )
}

export default ImportByTrezorView