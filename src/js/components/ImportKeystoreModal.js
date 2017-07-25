import React from "react"
import { connect } from "react-redux"

//import Key from "./Elements/Key"
import DropFile from "./Elements/DropFile"
import Modal from './Elements/Modal'

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

  importAccount = (event) => {
    event.preventDefault()
    var errors = {}
    errors["addressError"] = verifyAccount(this.props.address)
    errors["keyError"] = verifyKey(this.props.keystring)
    if (anyErrors(errors)) {
      console.log(errors)
      this.props.dispatch(throwError("Cannot import invalid keystore file"))
    } else {
      this.props.dispatch(addAccount(
      this.props.address, this.props.keystring,
      this.props.name, this.props.desc))
      this.props.dispatch(emptyForm())

      this.props.onClose()
    }
  }

  content = () => {
    return (
      <div className="import-account text-green">
        <div className="modal-title">
          Import account
        </div>
        <div className="modal-body">
          <form >
            <div className="row">
              <div className="large-12 columns">
                <label>Name
                  <input value={this.props.name} onChange={this.specifyName} type="text" />
                </label>
              </div>
            </div>
            <div className="row">
              <div className="large-12 columns">
                <label>JSON keystore file</label>
                <div className="dropzone">
                  <DropFile address={this.props.address}/>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="large-12 columns submit-button">
                <button class="button success" onClick={this.importAccount}>Import account</button>
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
        content={this.content}
        modalID={this.props.modalID}
        label="Import account from keystore JSON file">
      </Modal>
    )
  }
}
