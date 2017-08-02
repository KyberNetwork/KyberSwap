import React from "react"
import { connect } from "react-redux"

//import Key from "./Elements/Key"
import DropFile from "./Elements/DropFile"
import Modal from './Elements/Modal'
import { closeModal } from "../actions/utilActions"
import ReCredential from "./Elements/ReCredential"

<<<<<<< HEAD
import { specifyName, specifyDesc, emptyForm,  throwError} from "../actions/importKeystoreActions"
import { addAccount } from "../actions/accountActions"
import { verifyAccount, verifyKey, verifyPassphrase, anyErrors } from "../utils/validators"
import { addressFromKey } from "../utils/keys"
=======
import { specifyName, specifyDesc, emptyForm,  throwError} from "../actions/createKeystoreActions"
import { createAccount } from "../actions/accountActions"
import { verifyAccount, verifyKey, verifyPassphrase, anyErrors } from "../utils/validators"
//import { addressFromKey } from "../utils/keys"
>>>>>>> master

const passphraseID = "create-pass"
const repassphraseID = "re-create-pass"
@connect((store) => {
  var createKeyStore = {...store.createKeyStore}
  createKeyStore.ethereum = store.connection.ethereum
  return createKeyStore
})
export default class CreateAccountModal extends React.Component {
  specifyName = (event) => {
    this.props.dispatch(specifyName(event.target.value))
  }

  createAccount = (event) => {
    event.preventDefault()
    var errors = {}
    var ethereum = this.props.ethereum
    var password = document.getElementById(passphraseID).value
    var repassword = document.getElementById(repassphraseID).value
    errors["passwordError"] = verifyPassphrase(password, repassword)        
    if (anyErrors(errors)) {
      this.props.dispatch(throwError("Retype password is not match"))
    } else {
      this.props.dispatch(createAccount(password, this.props.name, this.props.desc, ethereum))
      this.props.dispatch(emptyForm())
      this.props.dispatch(closeModal(this.props.modalID))
    }
  }

  closeModal = (event) => {
    this.props.dispatch(closeModal(this.props.modalID))
  }

  focusNext = (value, event) => {         
    if(event.key === 'Enter'){
      event.preventDefault()
      if(document.getElementsByName(value)[0]){
        document.getElementsByName(value)[0].focus();        
      }      
    }
  }

  pressRePassword = (event) => {
    if(event.key === 'Enter'){
      event.preventDefault()
      this.createAccount(event)
    }
  }

  content = () => {
    return (
      <div className="import-account text-green">
        <div className="modal-title">
          <div class="left">
            <i class="k-icon k-icon-account"></i>Create account
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
                <input onKeyPress={(event) => this.focusNext('password', event)} value={this.props.name} onChange={this.specifyName} type="text" placeholder="Give your account a name"/>                
              </div>
            </div>            
            <div className="row">
              <div className="large-12 columns account-name">
                <ReCredential onKeyPressRePassword={(event) => this.pressRePassword(event)} onKeyPressPassword={(event) => this.focusNext('re_password', event)} passphraseID={passphraseID} repassphraseID={repassphraseID} error={this.props.error}/>
              </div>
            </div>            
            <div className="row">
              <div className="large-12 columns submit-button">
                <button class="button" onClick={this.createAccount}>Create account</button>
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
        modalClass="modal-import"
        label="Import account from keystore JSON file">
      </Modal>
    )
  }
}
