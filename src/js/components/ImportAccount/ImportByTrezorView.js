import React from "react"
// import ReactTooltip from 'react-tooltip'

const ImportByTrezorView = (props) => {
  return (
  	<div>
		  <div class="importer trezor">
				{/*<div className="how-to-use" data-for="trezor-tip" data-tip="How to use"></div>*/}
        <div className="importer__symbol">
          <img src={require('../../../assets/img/landing/trezor_active.svg')} />
          <div className="importer__name">{props.translate("import.from_trezor") || "TREZOR"}</div>
        </div>
				<button className="importer__button" onClick={(e) => props.showLoading('trezor')}>{props.translate("import.swap_from_trezor") || "Swap from Trezor"}</button>
		  </div>
			{/* <ReactTooltip place="top" id="trezor-tip" type="dark" /> */}
  	</div>
  )
}

export default ImportByTrezorView
