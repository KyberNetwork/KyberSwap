import React from "react"

const ImportAccountView = (props) => {
  return (
    <div class="frame">
      <div className="row">
        <div class="column small-11 large-12 small-centered">
          <h1 class="title">Import address</h1>
          <div class="row">
            <div class="small-6 medium-6 large-3 column" style={{ padding: 0 }}>
              {props.importKeyStore}
            </div>
            <div class="small-6 medium-6 large-3 column" style={{ padding: 0 }}>
              {props.importByPrivateKey}
            </div>
            <div class="small-12 medium-12 large-6 column" style={{ padding: 0 }}>
              {props.importByDevice}
            </div>
          </div>
          {props.importByMetamask}
        </div>
      </div>
      {props.errorModal}
    </div>
  )
}

export default ImportAccountView