import React from "react"
import { connect } from "react-redux"
import { selectAccount } from "../../actions/exchangeFormActions"
import constants from "../../services/constants"
import {sourceAccounts} from "../../utils/store"


@connect((store, props) => {
  var exchangeForm = store.exchangeForm[props.exchangeFormID]
  exchangeForm = exchangeForm || {...constants.INIT_EXCHANGE_FORM_STATE}
  return {
    accounts: sourceAccounts(store),
    selectedAccount: exchangeForm.selectedAccount,
    error: exchangeForm.errors["selectedAccountError"],
  }
})
export default class UserSelect extends React.Component {

  selectAccount(event) {
    this.props.dispatch(selectAccount(
      this.props.exchangeFormID,
      event.target.value
    ))
  }

  render() {
    var userOptions = this.props.accounts.map((acc, index) => {
      return <option key={acc.address} value={acc.address}>{acc.name}</option>
    })
    var error = ""
    if (this.props.error && this.props.error != "") {
      error = (<div class="error">
        <i class="k-icon k-icon-error"></i>
        Selected address is {this.props.error}
      </div>)
    }
    return (
      <div class="input-account">
        <div>
          <div>
            <label>From</label>
            <input value={this.props.selectedAccount} type="text" disabled />
          </div>
          {this.props.editable ?
            <select id="from-account" value={this.props.selectedAccount} onChange={this.selectAccount.bind(this)}>
              <option key="1" value="">No account selected</option>
              {userOptions}
            </select> : ""
          }
        </div>
        { error }
      </div>)
  }
}
