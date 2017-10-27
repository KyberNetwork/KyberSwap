import React from "react"

import { Modal } from '../../components/CommonElement'


export default class SelectAddressModal extends React.Component {

    render() {

        const customStyles = {
            addresses: {
                overflowY: 'auto',
                height: 700
            },
        }
        return (

            <Modal
                className={{ base: 'reveal large', afterOpen: 'reveal large' }}
                isOpen={this.props.open}
                onRequestClose={this.props.onRequestClose}
                contentLabel="Select Address"
                content={
                    <div style={customStyles.addresses}>
                        <div class="title">Select Address</div><a class="x" onClick={this.props.onRequestClose}>&times;</a>
                        <div class="content">
                            <div class="row tokens small-up-2 medium-up-3 large-up-4">
                                {this.props.content}
                            </div>
                        </div>
                    </div>

                }
            />

        )
    }
}
