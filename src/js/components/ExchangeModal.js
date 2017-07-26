import React from "react"
import { connect } from "react-redux"

import Modal from "./Elements/Modal"


export default class ExchangeModal extends React.Component {
  content = () => {
    return <ExchangeForm passphraseID="exchange-modal-passphrase" />
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
