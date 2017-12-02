import React from "react"

const ImportByTrezorView = (props) => {
  return (
    <div class="importer trezor">
      <a onClick={() => props.showLoading('trezor')}>
        <img src="/assets/img/trezor.svg" />
        <div class="description">Import from<br />trezor</div>
      </a>
    </div>
  )
}

export default ImportByTrezorView