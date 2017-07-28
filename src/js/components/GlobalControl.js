import React from "react"

import ModalLink from "./Elements/ModalLink"
import ToggleButton from "./Elements/ToggleButton"


import ExchangeModal from "./ExchangeModal"

import { connect } from "react-redux"

const quickExchangeModalID = "quick-exchange-modal"
const accountModalID = "new_account_modal"
const walletModalID = "new_wallet_modal"

@connect((store) => {
  return {
    utils: store.utils,    
  }
})

export default class GlobalControl extends React.Component {  
  render() {
  	var linkAccount = (
      <div class="link">
        <i class="k-icon k-icon-import"></i>
        <label>Import Account</label>
      </div>      
    )
    var linkWallet = (
      <div class="link">
        <i class="k-icon k-icon-import"></i>
        <label>Import Wallet</label>
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
                <ModalLink  modalID={accountModalID} content={linkAccount}/>                
              </li>              
              <li>
                <ModalLink  modalID={walletModalID} content={linkWallet}/>                
              </li>                             
              <li>
                <ModalLink  modalID={quickExchangeModalID} content={linkExchange}/>                
              </li>
            </ul>
          </div>
          <div class="modals">            
            <ExchangeModal exchangeFormID="quick-exchange" modalID={quickExchangeModalID} label="Quick Exchange" />
          </div>
        </div>
	)
  }
}