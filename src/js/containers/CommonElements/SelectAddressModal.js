import React from "react"

import { Modal } from '../../components/CommonElement'


export default class SelectAddressModal extends React.Component {

    render() {
        return (
            <Modal
                isOpen={this.props.open}
                onRequestClose={this.props.onRequestClose}
                contentLabel="Select Address"
                content={this.props.content}
            />

        )
    }
}
