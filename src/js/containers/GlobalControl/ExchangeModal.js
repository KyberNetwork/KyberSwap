import React from "react"
import { connect } from "react-redux"

//import Modal from "../../components/Elements/Modal"
import {Modal} from '../CommonElements'
import {ExchangeForm} from "../ExchangeForm"
import { closeModal } from "../../actions/utilActions"


const quickExchangeModalID = "quick-exchange-modal"

@connect((store) => {
  return {}
})
export default class ExchangeModal extends React.Component {

  closeQuickExchangeModal = (event) => {
    this.props.dispatch(closeModal(quickExchangeModalID))
  }

  content = () => {
    return <ExchangeForm
      passphraseID="exchange-modal-passphrase"
      exchangeFormID={this.props.exchangeFormID}
      postExchangeHandler={this.closeQuickExchangeModal}
      hideSourceAddress={true}
      hideDestAddress={true}
      extraClass="k-icon-exchange-green"
      label={this.props.label}
    />
  }

  render() {
    return (
      <Modal
        modalIsOpen={this.props.modalIsOpen}
        content={this.content()}
        modalID={this.props.modalID}
        modalClass="modal-exchange"
        outsideCallback={this.onClose}
        label={this.props.label}>
      </Modal>
    )
  }
}
