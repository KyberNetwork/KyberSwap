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
    background: 'rgba(139, 87, 42, 0.55)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}

@connect((store, props) => {
  var p = store.utils[props.modalID] || {}
  return {...p}
})

export default class KyberModal extends React.Component {

  componentWillUpdate(nextProps) {
      if (!nextProps.modalIsOpen && this.props.modalIsOpen) {
          var app = document.getElementById("app")
          app.style.height = "auto"
          app.style.overflow = "initial"
      }
  }

  onClose = () => {
    this.props.dispatch(closeModal(this.props.modalID))    
  }  

  afterOpenModal = () => {
    //get height of window    
    var screenHeight = window.innerHeight
    //get height of modal
    var modalContentInstance = document.getElementsByClassName("react-modal")[0]
    var modalInstance = modalContentInstance.parentNode
    var modalHeight = modalContentInstance.clientHeight;    

    if(modalHeight > screenHeight) {
      modalInstance.style.position = 'absolute'
      modalInstance.style.height = (modalHeight + 100) + "px"

      app.style.height = (modalHeight + 100) + "px"
      app.style.overflow = "hidden"
    }
  }

  render() {
    var content = this.props.content
    return (
      <Modal
        style={customStyles}
         className={{
          base: this.props.modalClass + " react-modal",
          afterOpen: 'modal-open',
        }}
        isOpen={this.props.modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.props.onClose || this.onClose}
        contentLabel={this.props.label}>
        {content}
      </Modal>
    )
  }
}
