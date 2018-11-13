import React from "react"
// import ReactTooltip from 'react-tooltip'
import { getAssetUrl } from "../../utils/common";


const ImportByTrezorView = (props) => {
  return (
    <div>
      <div class="importer trezor" onClick={(e) => props.showLoading('trezor')}>
        <div className="importer__symbol">
					{/* <img src={require('../../../assets/img/landing/trezor_active.svg')} /> */}
					<img src={getAssetUrl('wallets/trezor.svg')} />
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
