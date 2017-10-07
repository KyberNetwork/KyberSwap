import React from "react"
import { connect } from "react-redux"

//import Key from "./Elements/Key"
import { Modal } from '../CommonElements'
import { closeModal } from "../../actions/utilActions"


@connect((store) => {
  return {}
})
export default class ConfirmModal extends React.Component {

  closeModal = (event) => {
    this.props.dispatch(closeModal(this.props.modalID))
  }
  confirmAction = (event) => {
  	this.props.action()
  	this.props.dispatch(closeModal(this.props.modalID))	
  }
  content = () => {
    return (
      <div>        
        <div className="modal-message">
          {this.props.message}        	
        </div>          
        <div className="modal-control">
          <button className="cancel" onClick={this.closeModal}>No</button>
          <button className="ok" onClick={this.confirmAction}>Yes</button>
    	</div>        	
      </div>
    )
  }

  render() {
    return (
      <Modal
        content={this.content()}
        modalID={this.props.modalID}
        modalClass="confirm-modal"
        label="Confirm modal">
      </Modal>
    )
  }
}
