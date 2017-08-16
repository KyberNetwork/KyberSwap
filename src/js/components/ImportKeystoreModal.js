import React from "react"
import { connect } from "react-redux"

//import Key from "./Elements/Key"
import DropFile from "./Elements/DropFile"
import Modal from './Elements/Modal'
import { closeModal } from "../actions/utilActions"

import { specifyName, specifyDesc, emptyForm,  throwError } from "../actions/importKeystoreActions"
import { addAccount } from "../actions/accountActions"
import { verifyAccount, verifyKey, anyErrors } from "../utils/validators"


@connect((store) => {
  return {...store.importKeystore}
})
export default class ImportKeystoreModal extends React.Component {
  specifyName = (event) => {
    this.props.dispatch(specifyName(event.target.value))
  }

  specifyDesc = (event) => {
    this.props.dispatch(specifyDesc(event.target.value))
  }

  lowerCaseKey = (keystring) => {
    var keyObject = JSON.parse(keystring)
    var keyLowerCase = {}
    //lowercase all key
    Object.keys(keyObject).map(function (key) {
      keyLowerCase[key.toLowerCase()]= keyObject[key]
    })
    return JSON.stringify(keyLowerCase)
  }

  importAccount = (event) => {
    event.preventDefault()
    var keystring = this.lowerCaseKey(this.props.keystring)
    var errors = {}
    errors["addressError"] = verifyAccount(this.props.address)
    errors["keyError"] = verifyKey(keystring)
    if (anyErrors(errors)) {
      console.log(errors)
      this.props.dispatch(throwError("Cannot import invalid keystore file"))
    } else {
      this.props.dispatch(addAccount(
      this.props.address, keystring,
      this.props.name, this.props.desc))
      this.props.dispatch(emptyForm())

      //this.props.onClose()
      this.props.dispatch(closeModal(this.props.modalID))
    }
  }

  closeModal = (event) => {
    this.props.dispatch(closeModal(this.props.modalID))
  }
  content = () => {
    return (
      <div className="import-account text-green">
        <div className="modal-title">
          <div class="left">
            <i class="k-icon k-icon-account"></i>Import account
          </div>
          <div class="right">
            <button onClick={this.closeModal}>
              <i class="k-icon k-icon-close"></i>
            </button>
          </div>
        </div>
        <div className="modal-body">
          <div class="form">
            <div className="row">
              <div className="large-12 columns keystore">
                <label>JSON keystore file</label>
                <div className="dropzone">
                  <DropFile address={this.props.address}/>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="large-12 columns account-name">
                <label>Account Name</label>
                <input value={this.props.name} onChange={this.specifyName} type="text" placeholder="Give your account a name"/>                
              </div>
            </div>            
            <div className="row">
              <div className="large-12 columns submit-button">
                <button class="button" onClick={this.importAccount}>Import account</button>
              </div>
            </div>
          </div>
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
        modalClass="modal-import"
        label="Import account from keystore JSON file">
      </Modal>
    )
  }
}
