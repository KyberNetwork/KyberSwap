import React from "react"

import ModalLink from "./Elements/ModalLink"
import ToggleButton from "./Elements/ToggleButton"

import JoinPaymentForm from "./Payment/JoinPaymentForm"
import ExchangeModal from "./ExchangeModal"
import ImportKeystoreModal from "./ImportKeystoreModal"
import CreateAccountModal from "./CreateAccountModal"

import { connect } from "react-redux"

const quickExchangeModalID = "quick-exchange-modal"
const accountCreateModalID = "new_account_create_modal"
const accountModalID = "new_account_modal"
const walletModalID = "new_wallet_modal"

@connect((store) => {
  return {
    utils: store.utils,
  }
})

export default class GlobalControl extends React.Component {
  render() {
    var linkCreateAccount = (
      <div class="link">
        <i class="k-icon k-icon-import"></i>
        <label>Create Account</label>
      </div>
    )
    var linkAccount = (
      <div class="link">
        <i class="k-icon k-icon-import"></i>
        <label>Import Account</label>
      </div>
    )
    var linkWallet = (
      <div class="link">
        <i class="k-icon k-icon-import"></i>
        <label>Deploy Kyber Wallet</label>
      </div>
    )
    var linkExchange = (
      <div class="link">
        <i class="k-icon k-icon-exchange-white"></i>
        <label>Exchange</label>
      </div>
    )
    var className=this.props.utils.showControl?"control-account":"control-account hide"    
    return (
      <div>
       <div class="import-wallet button-green">
          <ToggleButton />
        </div>
        <div className={className}>
          <ul>
            <li>
              <ModalLink  modalID={accountCreateModalID} content={linkCreateAccount}/>
            </li>
            <li>
              <ModalLink  modalID={accountModalID} content={linkAccount}/>
            </li>
            <li>
              <ModalLink  modalID={walletModalID} content={linkWallet}/>
            </li>
            {/*
            <li>
              <ModalLink  modalID={quickExchangeModalID} content={linkExchange}/>
            </li>
            */}
          </ul>
        </div>
        <div class="modals">
          <ExchangeModal exchangeFormID="quick-exchange" modalID={quickExchangeModalID} label="Quick Exchange" />
          <JoinPaymentForm passphraseID="payment-passphrase" modalID={walletModalID}/>
          <ImportKeystoreModal modalID={accountModalID} />
          <CreateAccountModal modalID={accountCreateModalID}/>
        </div>
      </div>
    )
  }
}
