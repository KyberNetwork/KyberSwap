import React from "react"

const ImportByLedgerView = (props) => {
  return (
    <div>
      <div className="import-account__block theme__import-button" onClick={(e) => props.showLoading('ledger')}>
        <div className="import-account__icon ledger"/>
        <div className="import-account__name">
            <h3>{props.translate("import.from_ledger") || "LEDGER"}</h3>
          </div>
      </div>
    </div>
  )
}

export default ImportByLedgerView
