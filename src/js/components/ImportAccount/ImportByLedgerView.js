import React from "react"

const ImportByLedgerView = (props) => {
	return (
		<div>
			<div className="importer ledger">
				<div className="how-to-use">
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
		</div>
	)

}

export default ImportByLedgerView