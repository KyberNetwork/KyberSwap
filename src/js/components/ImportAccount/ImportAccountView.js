import React from "react"
// import { Modal } from "../../components/CommonElement"

const ImportAccountView = (props) => {
  return (
    <div id="import-account">
    	<div className="landing-background">
      </div>
      <div className="frame">
        <div className="container">
          <div className="small-centered" id="import-acc">
            <h1 className="title">{props.translate("address.import_address") || "Import address"}</h1>

            <div className="import-account">
              <div className="import-account__item">
                {props.firstKey}
              </div>
              <div className="import-account__item">
                {props.secondKey}
              </div>
              <div className="import-account__item">
                {props.thirdKey}
              </div>
              <div className="import-account__item">
                {props.fourthKey}
              </div>
              <div className="import-account__item">
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