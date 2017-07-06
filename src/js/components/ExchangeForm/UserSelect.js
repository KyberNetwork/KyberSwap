import React from "react";
import { connect } from "react-redux";
import { selectAccount } from "../../actions/exchangeFormActions";


@connect((store, props) => {
  return {
    accounts: Object.keys(store.accounts.accounts).map((key) => {
      return {
        address: store.accounts.accounts[key].address,
        name: store.accounts.accounts[key].name,
      };
    }),
    selectedAccount: store.exchangeForm.selectedAccount,
  }
})
export default class UserSelect extends React.Component {

  selectAccount(event) {
    this.props.dispatch(selectAccount(
      event.target.value
    ))
  }

  render() {
    var userOptions = this.props.accounts.map((acc, index) => {
      return <option key={acc.address} value={acc.address}>{acc.name}</option>
    })
    return (
    <label>
      Send from:
      <select value={this.props.selectedAccount} onChange={this.selectAccount.bind(this)}>
        <option key="1" value="no">No account selected</option>
        {userOptions}
      </select>
      Selected: {this.props.selectedAccount}
    </label>)
  }
}
