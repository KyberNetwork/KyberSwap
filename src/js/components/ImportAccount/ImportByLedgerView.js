import React from "react"

const ImportByLedgerView = (props) => {
  return (
    <div>
      <div className="import-account__block" onClick={(e) => props.showLoading('ledger')}>
        <div className="import-account__icon ledger"/>
        <div className="import-account__name">{props.translate("import.from_ledger") || "LEDGER"}</div>
      </div>
    </div>
  )
}

export default ImportByLedgerView
