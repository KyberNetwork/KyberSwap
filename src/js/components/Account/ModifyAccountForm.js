import React from "react"
import { connect } from "react-redux"

//import Key from "./Elements/Key"
import Modal from '../Elements/Modal'
import { closeModal } from "../../actions/utilActions"

import {specifyName, emptyForm} from "../../actions/modifyAccountActions"
import {modifyAccount} from "../../actions/accountActions"

@connect((store) => {
  return {...store.modifyAccount}  
})

export default class ModifyAccountForm extends React.Component {
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
          <form>
            <div className="row">
              <div className="large-12 columns account-name">
                <label>Account Name</label>
                <input id="account-name" onChange={this.specifyName} value={this.props.name} type="text" placeholder="Give your account a name"/>                
              </div>
            </div>                                 
            <div className="row">
              <div className="large-12 columns submit-button">
                <button class="button" onClick={this.updateAccount}>Update</button>
              </div>
            </div>
          </form>
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
