import React from "react";
import { Modal } from "../../components/CommonElement"

const ErrorModalView = (props) => {
    const content = (
        <div className={"p-a-20px"}>
          <div class="title text-center">{props.title ? props.title : props.translate("error.error_occurred") || "Error occurred"}</div>
          <div class="x" onClick={props.onRequestClose}>&times;</div>
          <div className="content error-modal">
            <center>
              <p>{props.error}</p>
            </center>
          </div>
        </div>
    )
    return (
        <Modal
            className={{
                base: 'reveal tiny',
                afterOpen: 'reveal tiny'
            }}
            isOpen={props.isOpen}
            contentLabel="error modal"
            content={content}
            onRequestClose={props.onRequestClose}
        />
    )

}

export default ErrorModalView
