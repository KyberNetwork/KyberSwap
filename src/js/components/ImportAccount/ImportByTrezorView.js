import React from "react"

const ImportByTrezorView = (props) => {
  return (
    <div class="small-6 medium-4 column" key="trezor">
      <div class="column column-block">
        <div class="importer trezor">
          <a onClick={() => props.showLoading('trezor')}>
            <img src="/assets/img/trezor.svg" />
            <div class="description">Import from<br />trezor</div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default ImportByTrezorView