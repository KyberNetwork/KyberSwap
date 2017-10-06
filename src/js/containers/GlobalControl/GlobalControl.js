import React from "react"

//import ModalLink from "../../components/Elements/ModalLink"
import {ModalLink, ToggleButton} from "../CommonElements"

//import ToggleButton from "../../components/Elements/ToggleButton"

import {CreateAccountModal, ImportKeystoreModal, DeployWalletModal} from "../../containers/GlobalControl"

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
       <div class="import-wallet">
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
          <DeployWalletModal passphraseID="payment-passphrase" modalID={walletModalID}/>
           <ImportKeystoreModal modalID={accountModalID} />
           <CreateAccountModal modalID={accountCreateModalID}/>
        </div>
      </div>
    )
  }
}
