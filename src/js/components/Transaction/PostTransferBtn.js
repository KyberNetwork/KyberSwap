import React from "react"

const PostTransferBtn = (props) => {

    return (
        <div class="row">
            <div class="column small-11 medium-10 large-9 small-centered text-center">
            {props.accountType === "keystore" && <p class="note">Password is needed for each transfer transaction</p>}
                <a className={props.className} data-open="passphrase-modal" onClick={props.submit}>Transfer</a>
            </div>
            {props.modalPassphrase}
        </div>
    )
}

export default PostTransferBtn
