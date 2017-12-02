import React from "react";
import { Modal } from "../../components/CommonElement"

const ErrorModalView = (props) => {
    const content = (
        <div>
            <div class="title text-center">{props.title ? props.title : "Error occurred"}</div><a class="x" onClick={props.onRequestClose}>&times;</a>
            <div class="content">
                <div class="row">
                    <div class="column">
                        <center>
                            <p>{props.error}</p>
                        </center>
                    </div>
                </div>
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