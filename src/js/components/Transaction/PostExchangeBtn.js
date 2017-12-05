import React from "react"
import { PendingOverlay } from "../../components/CommonElement"

const PostExchangeBtn = (props) => {

    return (
        <div>
            {props.step == 2 ? 
            <div class="row">
                <div class="column small-11 medium-10 large-9 small-centered text-center">
                    {props.accountType === "keystore" && <p class="note">{props.translate("trasaction.password_needed_exchange") || "Password is needed for each exchange transaction"}</p>}                    
                    <a class={props.className} onClick={props.submit} data-open="passphrase-modal">{props.translate("trasaction.exchange") || "Exchange"}</a>
                </div>
            </div>
            :
            <div class="row">
                <div class="column small-11 medium-10 large-9 small-centered text-center">
                {props.accountType === "keystore" && <p class="note">{props.translate("trasaction.password_needed_exchange") || "Password is needed for each exchange transaction"}</p>}
                    <a className={'submit ' + props.className} onClick={props.submit}>{props.translate("trasaction.next") || "Next"}</a>
                </div>
            </div>
            }
            {props.modalPassphrase}   
            {props.modalConfirm}
            {props.modalApprove}
            <PendingOverlay isEnable={props.isConfirming || props.isApproving}/>
        </div>
    )
}

export default PostExchangeBtn
