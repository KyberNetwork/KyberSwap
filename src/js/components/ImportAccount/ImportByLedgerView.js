import React from "react"
//import ReactTooltip from 'react-tooltip'
import { getAssetUrl } from "../../utils/common";

const ImportByLedgerView = (props) => {
  return (
    <div>
      <div className="importer ledger" onClick={(e) => props.showLoading('ledger')}>
        <div className="importer__symbol">
					{/* <img src={require('../../../assets/img/landing/ledger_active.svg')} /> */}
					<img src={getAssetUrl('wallets/ledger.svg')} />
          <div className="importer__name">{props.translate("import.from_ledger") || "LEDGER"}</div>
        </div>
        <div className="importer__button">
          {props.translate("import.swap_from_ledger") || "Swap from Ledger"}
        </div>
      </div>
    </div>
  )
}

export default ImportByLedgerView
