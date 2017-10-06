import React from "react"
import { connect } from "react-redux"

//import Key from "./Elements/Key"
//import Modal from '../../components/Elements/Modal'
import {Modal} from '../CommonElements'

import { ModifyWalletForm } from "../../components/Forms"

import { closeModal } from "../../actions/utilActions"

import { specifyName, emptyForm } from "../../actions/modifyWalletActions"
import { modifyWallet } from "../../actions/walletActions"

@connect((store) => {
  return { ...store.modifyWallet }
})

export default class ModifyWalletModal extends React.Component {
  updateWallet = (event) => {
    event.preventDefault()
    var newName = document.getElementById("wallet-name").value
    this.props.dispatch(modifyWallet(this.props.address, newName))

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
            <i class="k-icon k-icon-account"></i>Modify wallet
          </div>
          <div class="right">
            <button onClick={this.closeModal}>
              <i class="k-icon k-icon-close"></i>
            </button>
          </div>
        </div>
        <div className="modal-body">
        <ModifyWalletForm 
          onChange={this.specifyName}
          value={this.props.name} 
          action = {this.updateWallet}
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
