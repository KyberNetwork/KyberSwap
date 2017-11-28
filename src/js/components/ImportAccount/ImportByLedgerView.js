import React from "react"

const ImportByLedgerView = (props) => {
  return (
    <div class="small-6 medium-4 medium-offset-2 column" key="ledger">
      <div class="column column-block">
        <div class="importer ledger">
          <a onClick={() => props.showLoading('ledger')}>
            <img src="/assets/img/ledger.svg" />
            <div class="description">Import from<br />ledger wallet</div>
          </a>
        </div>
      </div>
    </div>
  )

}

export default ImportByLedgerView