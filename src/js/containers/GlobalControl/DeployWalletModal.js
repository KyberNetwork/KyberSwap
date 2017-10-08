import React from "react"
import { connect } from "react-redux"

//import Modal from '../../components/Elements/Modal'
import {Modal, ModalButton} from '../CommonElements'

//import ModalButton from "../../components/Elements/ModalButton"

import { DeployWalletForm } from "../../components/Forms"

import { throwError, emptyForm } from "../../actions/joinPaymentFormActions"
import { specifyGasLimit, specifyGasPrice, specifyName } from "../../actions/joinPaymentFormActions"
import { verifyNonce } from "../../utils/validators"
import { numberToHex } from "../../utils/converter"
import { deployKyberWallet } from "../../services/payment"
import { updateAccount, joiningKyberWallet } from "../../actions/accountActions"
import { closeModal } from "../../actions/utilActions"
import { addTx } from "../../actions/txActions"

import Tx from "../../services/tx"

const importModalId = "new_wallet_modal"
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

@connect((state, props) => {
  var selectedAccount = state.joinPaymentForm.selectedAccount
  var account = state.accounts.accounts[selectedAccount]
  return {
    account: account,
    ethereum: state.connection.ethereum,
    gas: state.joinPaymentForm.gas,
    gasPrice: state.joinPaymentForm.gasPrice,
    name: state.joinPaymentForm.name,
    nonce: (account == undefined ? 0 : account.getUsableNonce()),
    passwordError: state.joinPaymentForm.errors["passwordError"]
  }
})
export default class DeployWalletModal extends React.Component {

  specifyGas = (event) => {
    this.props.dispatch(specifyGasLimit(event.target.value))
  }

  specifyGasPrice = (event) => {
    this.props.dispatch(specifyGasPrice(event.target.value))
  }

  specifyName = (event) => {
    console.log("xxx")
    console.log(event.target.value)
    this.props.dispatch(specifyName(event.target.value))
  }

  joinKyberNetwork = (event) => {
    event.preventDefault()
    var errors = {}
    try {
      var ethereum = this.props.ethereum
      var password = document.getElementById(this.props.passphraseID).value
      if (password == undefined || password == "") {
        errors["passwordError"] = "empty"
      }
      if (!this.props.account) {
        errors["selectedAccountError"] = "invalid"
      }
      // sending by wei
      var account = this.props.account
      var address = this.props.account.address
      var gas = numberToHex(this.props.gas)
      var gasPrice = numberToHex(this.props.gasPrice)
      var nonce = verifyNonce(this.props.nonce)
      var name = this.props.name
      var dispatch = this.props.dispatch
      deployKyberWallet(
        ethereum, account, nonce, gas,
        gasPrice, account.key, password, (ex) => {
          const tx = new Tx(
            ex, address, gas, gasPrice,
            nonce, "pending", "join kyber wallet", name)
          dispatch(updateAccount(ethereum, account))
          dispatch(joiningKyberWallet(account, ex))
          dispatch(addTx(tx))
        })
      document.getElementById(this.props.passphraseID).value = ''
      this.props.dispatch(emptyForm())
      this.props.dispatch(closeModal(this.props.modalID))
    } catch (e) {
      console.log(e)
      errors["passwordError"] = "incorrect"
      this.props.dispatch(throwError(errors))
    }
  }

  closeModal = (event) => {
    this.props.dispatch(closeModal(importModalId))
  }

  clickJoin = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      this.joinKyberNetwork(event)
    }
  }
  
  content = () => {
    return (
      <div className="import-account">
        <div className="modal-title">
          <div class="left">
            <i class="k-icon k-icon-account"></i>Create a Kyber Wallet
          </div>
          <div class="right">
            <button onClick={this.closeModal}>
              <i class="k-icon k-icon-close"></i>
            </button>
          </div>
        </div>
        <div className="modal-body">
          <DeployWalletForm 
          name = {this.props.name}
          onChange = {this.specifyName}
           gas={this.props.gas}
          gasPrice={this.props.gasPrice}
          gasHandler={this.specifyGas}
          gasPriceHandler={this.specifyGasPrice} 	
          action={this.joinKyberNetwork}         
          onKeyPress = {(event) => this.clickJoin(event)} 
          passphraseID = {this.props.passphraseID}
          passwordError = {this.props.passwordError}
          />
          </div>
      </div>
    )
  }
  render() {
    return (
      <Modal
        modalID={this.props.modalID}
        isOpen={this.props.modalIsOpen}
        content={this.content()}
        modalClass="modal-payment"
        label="Import wallet from keystore JSON file">
      </Modal>
    )
  }
}
