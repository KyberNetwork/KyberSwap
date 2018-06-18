import React from "react"
import ReactTooltip from 'react-tooltip'

const ImportByLedgerView = (props) => {
	return (
		<div>
			<div className="importer ledger">
				<div className="how-to-use" data-for="ledger-tip" data-tip="How to use">
				</div>
				<div>
					<img src={require('../../../assets/img/landing/ledger_active.svg')} />
				</div>
				<div>
					TREZOR
				</div>
				<div>
					<button onClick={(e) => props.showLoading('ledger')}>Connect</button>
				</div>
			</div>
			<ReactTooltip place="top" id="ledger-tip" type="dark" />
		</div>
	)

}

export default ImportByLedgerView