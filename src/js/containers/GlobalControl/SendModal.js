import React from "react"
import { connect } from "react-redux"

//import Modal from "../../components/Elements/Modal"
import {Modal} from '../CommonElements'

import {ExchangeForm} from "../ExchangeForm"
import { closeModal } from "../../actions/utilActions"


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
      label={this.props.label}
      hideSourceAddress={true}
      extraClass="k-icon-send-green"
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
