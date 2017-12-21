import React from "react"

const ImportByLedgerView = (props) => {
  return (
    <div className="importer ledger">
      <a onClick={() => props.showLoading('ledger')}>
        <img src={require('../../../assets/img/ledger.svg')} />
        <div class="description">{props.translate("import.from_ledger") || <span>Import from<br />ledger wallet</span>}</div>
      </a>
    </div>
  )

}

export default ImportByLedgerView