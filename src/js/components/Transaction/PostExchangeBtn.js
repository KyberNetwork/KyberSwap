import React from "react"
import { PendingOverlay } from "../../components/CommonElement"

const PostExchangeBtn = (props) => {

    return (
        <div>
            {props.step == 2 ? 
            <div class="row">
                <div class="column small-11 medium-10 large-9 small-centered text-center">
                    {props.accountType === "keystore" && <p class="note">Password is needed for each exchange transaction</p>}                    
                    <a class={props.className} onClick={props.submit} data-open="passphrase-modal">Exchange</a>
                </div>
            </div>
            :
            <div class="row">
                <div class="column small-11 medium-10 large-9 small-centered text-center">
                {props.accountType === "keystore" && <p class="note">Password is needed for each exchange transaction</p>}
                    <a className={'submit ' + props.className} onClick={props.submit}>Next</a>
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
