import React from "react"
import { connect } from "react-redux"

//import Key from "./Elements/Key"
import DropFile from "./Elements/DropFile"
import Modal from 'react-modal';

import { specifyName, specifyDesc, emptyForm,  throwError } from "../actions/importKeystoreActions"
import { addAccount } from "../actions/accountActions"
import { verifyAccount, verifyKey, anyErrors } from "../utils/validators"

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

  render() {
    return (
      <Modal
        style={customStyles}
        isOpen={this.props.modalIsOpen}
        onRequestClose={this.props.onClose}
        contentLabel="Import account from keystore JSON file">
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
      </Modal>
    )
  }
}
