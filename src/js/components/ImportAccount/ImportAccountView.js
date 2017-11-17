import React from "react"

const ImportAccountView = (props) => {
  return (
    <div class="frame">
      <div className="row">
        <div class="column small-11 large-10 small-centered">
          <h1 class="title">Import address</h1>
          <div class="row">
            <div class="small-12 medium-4 column" style={{ padding: 0 }}>
              {props.importKeyStore}
            </div>
            <div class="small-12 medium-8 column" style={{ padding: 0 }}>
              {props.importByDevice}
            </div>
            <div>
              {props.importByPrivateKey}
            </div>
          </div>
        </div>
      </div>
      {props.errorModal}
    </div>
  )
}

export default ImportAccountView