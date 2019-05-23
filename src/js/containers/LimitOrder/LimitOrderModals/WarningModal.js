import React from "react"
import { Modal } from "../../../components/CommonElement"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'

import constants from "../../../services/constants"
import BLOCKCHAIN_INFO from "../../../../../env"
import * as converters from "../../../utils/converter"

@connect((store, props) => {
    const account = store.account.account
    const translate = getTranslate(store.locale)
    const tokens = store.tokens.tokens
    const limitOrder = store.limitOrder
    const ethereum = store.connection.ethereum

    return {
        translate, limitOrder, tokens, account, ethereum

    }
})

export default class WarningModal extends React.Component {


    contentModal = () => {
        return (
            <div className="approve-modal">
                <div className="title">Confirm remove pending orders</div>
                <a className="x" onClick={this.props.onCancel}>&times;</a>
                <div className="content with-overlap">
                    <div className="row">
                        <div>You confirm to remove pending order</div>
                    </div>
                </div>
                <div className="overlap">
                    <div className="input-confirm grid-x">
                        <a className={"button process-submit cancel-process"} onClick={this.props.onCancel}>
                            {this.props.translate("modal.cancel" || "Cancel")}
                        </a>
                        <a className={"button process-submit next"} onClick={this.props.onSubmit.bind(this)}>{this.props.translate("modal.confirm").toLocaleUpperCase() || "Confirm".toLocaleUpperCase()}</a>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <Modal className={{
                base: 'reveal medium confirm-modal',
                afterOpen: 'reveal medium confirm-modal'
            }}
                isOpen={true}
                onRequestClose={this.props.onCancel}
                contentLabel="approve modal"
                content={this.contentModal()}
                size="medium"
            />
        )


    }
}
