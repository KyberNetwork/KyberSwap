import React from "react"
import { connect } from "react-redux"

//import DropFile from "../../components/Elements/DropFile"
//import Modal from '../../components/Elements/Modal'
import {Modal} from '../CommonElements'

import {ImportAccountForm} from "../../components/Forms"

import { closeModal } from "../../actions/utilActions"

import { specifyName, specifyDesc, emptyForm,  throwError, uploadKey } from "../../actions/importKeystoreActions"
import { addAccount } from "../../actions/accountActions"

import { verifyAccount, verifyKey, anyErrors } from "../../utils/validators"
import { addressFromKey } from "../../utils/keys"

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

      this.props.dispatch(closeModal(this.props.modalID))
    }
  }
  onDrop = (files) => {
    var file = files[0]
    var fileReader = new FileReader()
    fileReader.onload = (event) => {
      var keystring = event.target.result
      try {
        console.log("keystring: ", keystring)
        var address = addressFromKey(keystring)
        this.props.dispatch(uploadKey(
          address, keystring))
      } catch (e) {
        this.props.dispatch(throwError(e.message))
      }
    }
    try {
      fileReader.readAsText(file)
    } catch (e) {
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
          <ImportAccountForm 
            address = {this.props.address}
            value = {this.props.name}
            error={this.props.error}
            keystring={this.props.keystring}
            onChange = {this.specifyName}
            action={this.importAccount}
            onDrop = {this.onDrop}
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
        modalClass="modal-import"
        label="Import account from keystore JSON file">
      </Modal>
    )
  }
}
