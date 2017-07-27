import React from "react"
import { connect } from "react-redux"
import Select from 'react-select'

import { specifyRecipient } from "../../actions/exchangeFormActions"
import constants from "../../services/constants"


@connect((store, props) => {
  var exchangeForm = store.exchangeForm[props.exchangeFormID]
  exchangeForm = exchangeForm || {...constants.INIT_EXCHANGE_FORM_STATE}
  return {
    accounts: Object.keys(store.accounts.accounts).map((key) => {
      return {
        address: store.accounts.accounts[key].address,
        name: store.accounts.accounts[key].name,
      };
    }),
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

  render() {
    var userOptions = this.props.accounts.map((acc, index) => {
      return <option key={acc.address} value={acc.address}>{acc.name}</option>
    })
    var error
    if (this.props.error && this.props.error != "") {
      error = (<div class="error">
        <i class="k-icon k-icon-error"></i>
        Selected address is {this.props.error}
      </div>)
    }
    return (
      <div class="input-group-item input-account">
        <label>Send to</label>
        <div class="input-item">
          <input type="text" value={this.props.destAddress} onChange={this.specifyDestAddress.bind(this)} value={this.props.destAddress} />
          <div class="select-wrapper">
            <select class="selectric" id="to-account" value={this.props.destAddress} onChange={this.selectAccount.bind(this)}>
              <option key="1" value="">No account selected</option>
              {userOptions}
            </select>
          </div>
        </div>
        { error }
      </div>
    )
  }
}
