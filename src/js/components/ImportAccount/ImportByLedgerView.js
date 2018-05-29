import React from "react"

const ImportByLedgerView = (props) => {
  return (
  	<div>
	    <div className="importer ledger">
	      <a onClick={() => props.showLoading('ledger')}>
	        <img src={require('../../../assets/img/ledger.svg')} />
	      </a>
	    </div>
	    <div class="description">{props.translate("import.from_ledger") || <span>Ledger</span>}</div>
    </div>
  )

}

export default ImportByLedgerView