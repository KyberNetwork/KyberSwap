import React from "react"

const PostExchangeBtn = (props) => {

    return (
        <div>
            <div class="row hide-on-choose-token-pair">
                <div class="column small-11 medium-10 large-9 small-centered text-center">
                    <p class="note">Passphrase is needed for each exchange transaction</p><a class="button accent" onClick={props.submit} data-open="passphrase-modal">Exchange</a>
                </div>
            </div>
            <div class="row show-on-choose-token-pair">
                <div class="column small-11 medium-10 large-9 small-centered text-center">
                    <p class="note">Passphrase is needed for each exchange transaction</p><a className={props.classNameNext} onClick={props.submit}>Next</a>
                </div>
            </div>

            {props.modalPassphrase}
            {props.modalConfirm}
            {props.modalApprove}
        </div>
    )
}

export default PostExchangeBtn
