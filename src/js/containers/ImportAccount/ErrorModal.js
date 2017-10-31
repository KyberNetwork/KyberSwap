import React from "react"
import { connect } from "react-redux"
import { Modal } from "../../components/CommonElement"
import { closeErrorModal } from "../../actions/accountActions"

@connect((store) => {
    return { ...store.account }
})

export default class ErrorModal extends React.Component {
    closeModal = () => {
        this.props.dispatch(closeErrorModal())
    }
    content = () => {
        return (
            <div>
                <div class="title text-center">{this.props.title? this.props.title: "Error occurred"}</div><a class="x" onClick={this.closeModal}>&times;</a>
                <div class="content">
                    <div class="row">
                        <div class="column">
                            <center>
                                <p>{this.props.error}</p>
                            </center>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    render() {
        return (
            <Modal
                className={{
                    base: 'reveal tiny',
                    afterOpen: 'reveal tiny'
                }}
                isOpen={this.props.showError}
                onRequestClose={this.closeModal}
                contentLabel="error modal"
                content={this.content()}
                size="tiny"
            />
        )
    }
}