import React from "react"
import { connect } from "react-redux"
import Modal from 'react-modal'

import { closeModal } from "../../actions/utilActions"


const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 10, 0.45)'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px'
  }
}

@connect((store, props) => {
  var p = store.utils[props.modalID] || {}
  return {...p}
})
export default class KyberModal extends React.Component {
  onClose = () => {
    this.props.dispatch(closeModal(this.props.modalID))
  }

  render() {
    var content = this.props.content
    return (
      <Modal
        style={customStyles}
        isOpen={this.props.modalIsOpen}
        onRequestClose={this.onClose}
        contentLabel={this.props.label}>
        {content()}
      </Modal>
    )
  }
}
