import React from "react"

const ImportByTrezorView = (props) => {
  return (
  	<div>
		  <div class="importer trezor">
		    <a onClick={() => props.showLoading('trezor')}>
		      <img src={require('../../../assets/img/trezor.svg')} />
		    </a>
		  </div>
		  <div class="description">{props.translate("import.from_trezor") || <span>Trezor</span>}</div>
  	</div>
  )
}

export default ImportByTrezorView