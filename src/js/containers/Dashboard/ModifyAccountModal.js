import React from "react"
import { connect } from "react-redux"

//import Key from "./Elements/Key"
//import Modal from '../../components/Elements/Modal'
import {Modal} from '../CommonElements'

import { ModifyAccountForm } from "../../components/Forms"

import { closeModal } from "../../actions/utilActions"

import { specifyName, emptyForm } from "../../actions/modifyAccountActions"
import { modifyAccount } from "../../actions/accountActions"

@connect((store) => {
  return { ...store.modifyAccount }
})

export default class ModifyAccountModal extends React.Component {
  updateAccount = (event) => {
    event.preventDefault()
    var newName = document.getElementById("account-name").value
    this.props.dispatch(modifyAccount(this.props.address, newName))

    this.props.dispatch(emptyForm())
    this.props.dispatch(closeModal(this.props.modalID))
  }

  closeModal = (event) => {
    this.props.dispatch(closeModal(this.props.modalID))
  }

  specifyName = (event) => {
    this.props.dispatch(specifyName(event.target.value))
  }
  
  content = () => {
    return (
      <div className="import-account">
        <div className="modal-title">
          <div class="left">
            <i class="k-icon k-icon-account"></i>Modify account
          </div>
          <div class="right">
            <button onClick={this.closeModal}>
              <i class="k-icon k-icon-close"></i>
            </button>
          </div>
        </div>
        <div className="modal-body">
          <ModifyAccountForm 
          onChange={this.specifyName}
          value={this.props.name} 
          action = {this.updateAccount}
          />          
          </div>
      </div>
    )
  }

  render() {
    return (
      <Modal
        modalIsOpen={this.props.modalIsOpen}
        content={this.content()}
        modalID={this.props.modalID}
        modalClass="modal-modify"
        label="Modify account">
      </Modal>
    )
  }
}
