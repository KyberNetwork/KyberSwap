import React from "react"
import { Modal } from "../../components/CommonElement"

const ImportAccountView = (props) => {
  return (
    <div id="import-account">
      <div className="frame">
        <div className="grid-x">
          <div className="column small-11 large-12 small-centered" id="import-acc">
            <h1 className="title">{props.translate("address.import_address") || "Import address"}</h1>
            <div className="grid-x import-account">
              <div className="small-6 medium-4 large-2 column">
                {props.firstKey}
              </div>
              <div className="small-6 medium-4 large-2 column">
                {props.secondKey}
              </div>
              <div className="small-6 medium-4 large-2 column">
                {props.thirdKey}
              </div>
              <div className="small-6 medium-4 large-2 column">
                {props.fourthKey}
              </div>
              <div className="small-6 medium-4 large-2 column">
                {props.fifthKey}
              </div>
            </div>
          </div>
        </div>
        {props.errorModal}
      </div>
    </div>
  )

  // return contentRender

//   return <Modal
//   className={{
//     base: 'reveal large',
//     afterOpen: 'reveal large import-account-modal'
//   }}
//   isOpen={props.isOpen}
//   onRequestClose={props.closeModal}
//   contentLabel="import modal"
//   content={contentRender}
//   size="medium"
// />

}

export default ImportAccountView