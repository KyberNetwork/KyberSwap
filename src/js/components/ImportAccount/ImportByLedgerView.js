import React from "react"
//import ReactTooltip from 'react-tooltip'

const ImportByLedgerView = (props) => {
	return (
		<div>
			<div className="importer ledger">
				{/*<div className="how-to-use" data-for="ledger-tip" data-tip="How to use"></div>*/}
        <div className="importer__symbol">
          <img src={require('../../../assets/img/landing/ledger_active.svg')} />
          <div className="importer__name">{props.translate("import.from_ledger") || "LEDGER"}</div>
        </div>
				<button className="importer__button" onClick={(e) => props.showLoading('ledger')}>{props.translate("import.swap_from_ledger") || "Swap from Ledger"}</button>
			</div>
			{/* <ReactTooltip place="top" id="ledger-tip" type="dark" /> */}
		</div>
	)
}

export default ImportByLedgerView
