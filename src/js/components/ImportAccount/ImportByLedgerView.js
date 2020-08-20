import React from "react"

const ImportByLedgerView = (props) => {
  return (
    <div className="import-account__block theme__import-button" onClick={(e) => props.showLoading('ledger')}>
      <div className="import-account__icon ledger"/>
      <div className="import-account__name">{props.translate("import.from_ledger") || "LEDGER"}</div>
    </div>
  )
}

export default ImportByLedgerView
