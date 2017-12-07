import React from "react"

const ImportByLedgerView = (props) => {
  return (
    <div className="importer ledger">
      <a onClick={() => props.showLoading('ledger')}>
        <img src="/assets/img/ledger.svg" />
        <div class="description">Import from<br />ledger wallet</div>
      </a>
    </div>
  )

}

export default ImportByLedgerView