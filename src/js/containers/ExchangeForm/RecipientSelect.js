import React from "react"
import { connect } from "react-redux"
import Select from 'react-select'

import { specifyRecipient } from "../../actions/exchangeFormActions"
import constants from "../../services/constants"
import { destAccounts } from "../../utils/store"


@connect((store, props) => {
  var exchangeForm = store.exchangeForm[props.exchangeFormID]
  exchangeForm = exchangeForm || {...constants.INIT_EXCHANGE_FORM_STATE}
  return {
    accounts: destAccounts(store),
    selectedAccount: exchangeForm.selectedAccount,
    destAddress: exchangeForm.destAddress,
    error: exchangeForm.errors["destAddressError"],
  }
})
export default class RecipientSelect extends React.Component {

  specifyDestAddress(event) {
    this.props.dispatch(
      specifyRecipient(this.props.exchangeFormID, event.target.value))
  }

  selectAccount(event) {
    this.props.dispatch(
      specifyRecipient(this.props.exchangeFormID, event.target.value))
  }

  removeTrailing  = (e) => {
    e.preventDefault();
    var pastedText = '';
    if (window.clipboardData && window.clipboardData.getData) { // IE
        pastedText = window.clipboardData.getData('Text');
      } else if (e.clipboardData && e.clipboardData.getData) {
        pastedText = e.clipboardData.getData('text/plain');
      }
    e.target.value = pastedText.trim();    
    this.specifyDestAddress(e)
  }

  render() {
    var userOptions = this.props.accounts.filter((acc) => {
      return acc.address !== this.props.selectedAccount;
    }).map((acc, index) => {
      return <option key={acc.address} value={acc.address}>{acc.name}</option>
    })
    var error
    if (this.props.error && this.props.error != "") {
      error = (<div class="error">
        <i class="k-icon k-icon-error"></i>
        Selected address is {this.props.error}
      </div>)
    }
    return(
      <div class="input-account">
        <div>
          <div>
            <label>To</label>
            <input onKeyPress={this.props.onKeyPress} onPaste={e => this.removeTrailing(e)} type="text" value={this.props.destAddress} onChange={this.specifyDestAddress.bind(this)} value={this.props.destAddress} />
          </div>
          <select class="selectric" id="to-account" value={this.props.destAddress} onChange={this.selectAccount.bind(this)}>
              <option key="1" value="">No account selected</option>
              {userOptions}
          </select>
        </div>
        { error }
      </div>)

  }
}
