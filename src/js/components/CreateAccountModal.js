import React from "react"
import { connect } from "react-redux"

//import Key from "./Elements/Key"
import DropFile from "./Elements/DropFile"
import Modal from './Elements/Modal'
import { closeModal } from "../actions/utilActions"
import ReCredential from "./Elements/ReCredential"

import { specifyName, specifyDesc, emptyForm,  throwError} from "../actions/importKeystoreActions"
import { addAccount } from "../actions/accountActions"
import { verifyAccount, verifyKey, verifyPassphrase, anyErrors } from "../utils/validators"
import { addressFromKey } from "../utils/keys"

const passphraseID = "create-pass"
const repassphraseID = "re-create-pass"
@connect((store) => {
  var importKeystore = {...store.importKeystore}
  importKeystore.ethereum = store.connection.ethereum
  return importKeystore
})
export default class CreateAccountModal extends React.Component {
  specifyName = (event) => {
    this.props.dispatch(specifyName(event.target.value))
  }

  createAccount = (event) => {
    event.preventDefault()   
    var errors = {}
    var ethereum = this.props.ethereum
    var keyString = ethereum.createNewAddress(this.props.passphraseID)
    var address = addressFromKey(keyString)
    errors["addressError"] = verifyAccount(address)
    errors["keyError"] = verifyKey(keyString)
    
    var password = document.getElementById(passphraseID).value
    var repassword = document.getElementById(repassphraseID).value
    errors["passwordError"] = verifyPassphrase(password, repassword)    
    if (anyErrors(errors)) {
      console.log(errors)
      this.props.dispatch(throwError("Cannot import invalid keystore file"))
    } else {
      this.props.dispatch(addAccount(
      address, keyString,
      this.props.name, this.props.desc))
      this.props.dispatch(emptyForm())
     
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
                <input value={this.props.name} onChange={this.specifyName} type="text" placeholder="Give your account a name"/>                
              </div>
            </div>            
            <div className="row">
              <div className="large-12 columns account-name">
                <ReCredential passphraseID={passphraseID} repassphraseID={repassphraseID} error={this.props.passwordError}/>
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
