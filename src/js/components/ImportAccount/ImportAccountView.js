import React from "react"
import { Modal } from "../../components/CommonElement"

const ImportAccountView = (props) => {
  var contentRender = (
    <div id="import-account">
      <div className="frame">
        <div className="row">
          <div className="column small-11 large-12 small-centered" id="import-acc">
            <h1 className="title">{props.translate("address.import_address") || "Import address"}</h1>
            <h3 className="sub-title">{props.translate("address.exchange_from") || "Exchange from"}</h3>
            <div className="row import-account">
              <div className="small-6 medium-4 large-2dot4 column">
                {props.firstKey}
              </div>
              <div className="small-6 medium-4 large-2dot4 column">
                {props.secondKey}
              </div>
              <div className="small-6 medium-4 large-2dot4 column">
                {props.thirdKey}
              </div>
              <div className="small-6 medium-4 large-2dot4 column">
                {props.fourthKey}
              </div>
              <div className="small-6 medium-4 large-2dot4 column">
                {props.fifthKey}
              </div>
            </div>
          </div>
        </div>
        {props.errorModal}
      </div>
    </div>
  )

  return <Modal
  className={{
    base: 'reveal large',
    afterOpen: 'reveal large import-account-modal'
  }}
  isOpen={props.isOpen}
  onRequestClose={props.closeModal}
  contentLabel="import modal"
  content={contentRender}
  size="medium"
/>

}

export default ImportAccountView