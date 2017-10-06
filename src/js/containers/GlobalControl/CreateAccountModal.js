import React from "react"
import { connect } from "react-redux"

//import Key from "./Elements/Key"
//import Modal from '../../components/Elements/Modal'
import {Modal} from '../CommonElements'

import { closeModal } from "../../actions/utilActions"
// import ReCredential from "../../components/Elements/ReCredential"
import {CreateAccountForm} from "../../components/Forms"

import { specifyName, specifyDesc, emptyForm,  throwError} from "../../actions/createKeystoreActions"
import { createAccount } from "../../actions/accountActions"
import { verifyAccount, verifyKey, verifyPassphrase, anyErrors } from "../../utils/validators"
import { addressFromKey } from "../../utils/keys"

const passphraseID = "create-pass"
const repassphraseID = "re-create-pass"
@connect((store) => {
  var createKeyStore = { ...store.createKeyStore }
  createKeyStore.ethereum = store.connection.ethereum
  return createKeyStore
})
export default class CreateAccountModal extends React.Component {

  constructor(props) {
    super()
    this.state = { address: "", key: "", page: "1" }
  }
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
      var keyString = JSON.stringify(ethereum.createNewAddress(password))
      var address = addressFromKey(keyString)
      this.props.dispatch(createAccount(address, keyString, this.props.name, this.props.desc))
      this.props.dispatch(emptyForm())
      this.setState({ address: address, key: keyString, page: "2" })
      //this.props.dispatch(closeModal(this.props.modalID))
    }
  }

  closeModal = (event) => {
    this.setState({ address: "", key: "", page: "1" })
    this.props.dispatch(closeModal(this.props.modalID))
  }

  pressRePassword = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      this.createAccount(event)
    }
  }

  downloadKeyStore = () => {
    var keystore = this.state.key
    var address = this.state.address
    event.preventDefault()
    var element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(keystore))
    element.setAttribute('download', address)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
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
        <div className="modal-body" id="create-account-modal" data-page={this.state.page}>
          <div class="page-1">
            <CreateAccountForm 
            	value = {this.props.name}
            	onChange={this.specifyName}
            	onKeyPressRePassword={(event) => this.pressRePassword(event)}
            	error={this.props.error}
            	action = {this.createAccount}
            />
          </div>
          <div class="page-2">            
            <div class="title">Save your Keystore File.</div>
            <div>
              <button class="button" onClick={this.downloadKeyStore}>Download Keystore File</button>
            </div>            
            <div class="warning">Do not lose it! It cannot be recovered if you lose it.</div>
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
        onClose={this.closeModal}
        label="Import account from keystore JSON file">
      </Modal>
    )
  }
}
