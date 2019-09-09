import React from "react"

const ImportByLedgerView = (props) => {
  return (
    <div className="import-account__block theme__import-button" onClick={(e) => props.showLoading('ledger')}>
      <div className="import-account__icon ledger"/>
      <div className="import-account__name theme__text-4">
          <h3>{props.translate("import.from_ledger") || "LEDGER"}</h3>
        </div>
    </div>
  )
}

export default ImportByLedgerView
