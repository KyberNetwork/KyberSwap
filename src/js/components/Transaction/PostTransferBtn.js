import React from "react"
import { PendingOverlay } from "../../components/CommonElement"

const PostTransferBtn = (props) => {

    return (
        <div class="row">
            <div class="column small-11 medium-10 large-9 small-centered text-center">
            {props.accountType === "keystore" && <p class="note">{props.translate("trasaction.password_needed_transfer") || "Password is needed for each transfer transaction"}</p>}
                <a className={'submit-transfer ' + props.className} data-open="passphrase-modal" onClick={props.submit}>{props.translate("trasaction.transfer") || "Transfer"}</a>
            </div>
            {props.modalPassphrase}
            <PendingOverlay isEnable={props.isConfirming}/>
        </div>
    )
}

export default PostTransferBtn
