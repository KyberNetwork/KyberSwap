import React from "react"
import { connect } from "react-redux"

import Modal from '../Elements/Modal'
import ModalButton from "../Elements/ModalButton"
import Credential from "../Elements/Credential"
import TransactionConfig from "../Elements/TransactionConfig"
import UserSelect from "../Payment/UserSelect"

import { throwError, emptyForm } from "../../actions/joinPaymentFormActions"
import { specifyGasLimit, specifyGasPrice } from "../../actions/joinPaymentFormActions"
import { deployKyberWallet } from "../../services/payment"
import { updateAccount, joiningKyberWallet } from "../../actions/accountActions"
import { addTx } from "../../actions/txActions"
import Tx from "../../services/tx"

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
    nonce: (account == undefined ? 0 : account.getUsableNonce()),
    passwordError: state.joinPaymentForm.errors["passwordError"]
  }
})
export default class JoinPaymentForm extends React.Component {

  specifyGas = (event) => {
    this.props.dispatch(specifyGasLimit(event.target.value));
  }

  specifyGasPrice = (event) => {
    this.props.dispatch(specifyGasPrice(event.target.value));
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
      var hash = deployKyberWallet(
        ethereum, this.props.account, this.props.nonce, this.props.gas,
        this.props.gasPrice, this.props.account.key, password)
      const tx = new Tx(
        hash, this.props.account.address, this.props.gas, this.props.gasPrice,
        this.props.nonce, "pending", "join kyber wallet")
      this.props.dispatch(updateAccount(ethereum, this.props.account))
      this.props.dispatch(joiningKyberWallet(this.props.account, hash))
      this.props.dispatch(addTx(tx))
      document.getElementById(this.props.passphraseID).value = ''
      this.props.dispatch(emptyForm())
    } catch (e) {
      console.log(e)
      errors["passwordError"] = "incorrect"
      this.props.dispatch(throwError(errors))
    }    
  }

  content = () => {
    return (
      <div className="import-account">
        <div className="modal-title text-gradient">
          Deploy your Kyber Wallet contract
        </div>
        <div className="modal-body">
          <form >
            <div className="row">
              <div className="large-12 columns">
                <UserSelect />
              </div>
            </div>
            <div className="row">
              <div className="large-12 columns">
                <TransactionConfig gas={this.props.gas} gasPrice={this.props.gasPrice} gasHandler={this.specifyGas} gasPriceHandler={this.specifyGasPrice} />
              </div>
            </div>
            <div className="row">
              <div className="large-12 columns">
                <Credential passphraseID={this.props.passphraseID} error={this.props.passwordError}/>
              </div>
            </div>
            <div className="row">
              <div className="large-12 columns submit-button">
                <button class="button" onClick={this.joinKyberNetwork} >Join KyberNetwork</button>
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
        modalID={this.props.modalID}
        isOpen={this.props.modalIsOpen}
        content={this.content()}
        modalClass="modal-payment"
        label="Import wallet from keystore JSON file">
      </Modal>
    )
  }
}
