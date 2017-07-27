import React from "react"
import { connect } from "react-redux"

import Modal from "./Elements/Modal"
import ExchangeForm from "./ExchangeForm"
import { closeModal } from "../actions/utilActions"


const quickSendModalID = "quick-send-modal"

@connect((store) => {
  return {}
})
export default class SendModal extends React.Component {

  closeQuickSendModal = (event) => {
    this.props.dispatch(closeModal(quickSendModalID))
  }

  content = () => {
    return <ExchangeForm
      passphraseID="exchange-modal-passphrase"
      exchangeFormID={this.props.exchangeFormID}
      postExchangeHandler={this.closeQuickSendModal}
      hideSourceAddress={true}
      allowDirectSend={true}
    />
  }

  render() {
    return (
      <Modal
        modalIsOpen={this.props.modalIsOpen}
        content={this.content()}
        modalID={this.props.modalID}
        modalClass="modal-exchange"
        label={this.props.label}>
      </Modal>
    )
  }
}
