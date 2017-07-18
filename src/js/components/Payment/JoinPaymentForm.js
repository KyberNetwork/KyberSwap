import React from "react"
import { connect } from "react-redux"

import Credential from "../Elements/Credential"
import TransactionConfig from "../Elements/TransactionConfig"
import UserSelect from "../Payment/UserSelect"

import { throwError, emptyForm } from "../../actions/joinPaymentFormActions"
import { specifyGasLimit, specifyGasPrice } from "../../actions/joinPaymentFormActions"
import { deployKyberWallet } from "../../services/payment"
import { updateAccount, joiningKyberWallet } from "../../actions/accountActions"
import { addTx } from "../../actions/txActions"
import Tx from "../../services/tx"


@connect((state, props) => {
  var selectedAccount = state.joinPaymentForm.selectedAccount
  var account = state.accounts.accounts[selectedAccount]
  return {
    account: account,
    ethereum: state.connection.ethereum,
    gas: state.joinPaymentForm.gas,
    gasPrice: state.joinPaymentForm.gasPrice,
    nonce: (account == undefined ? 0 : account.getUsableNonce()),
    error: state.joinPaymentForm.error
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
    try {
      var ethereum = this.props.ethereum
      var password = document.getElementById(this.props.passphraseID).value
      if (password == undefined || password == "") {
        throw new Error("Empty password")
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
      this.props.dispatch(throwError(e.message))
    }
  }

  render() {
    return (
      <div>
        <UserSelect />
        <TransactionConfig gas={this.props.gas} gasPrice={this.props.gasPrice} gasHandler={this.specifyGas} gasPriceHandler={this.specifyGasPrice} />
        <Credential passphraseID={this.props.passphraseID} />
        <p>Error: {this.props.error}</p>
        <button class="button" onClick={this.joinKyberNetwork} >Join KyberNetwork</button>
      </div>
    )
  }
}
