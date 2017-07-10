import React from "react"
import { connect } from "react-redux"
import { selectWallet } from "../../actions/paymentFormActions"


@connect((store, props) => {
  return {
    wallets: Object.keys(store.wallets.wallets).map((key) => {
      return {
        address: store.wallets.wallets[key].address,
        name: store.wallets.wallets[key].name,
      };
    }),
    selectedWallet: store.paymentForm.selectedWallet,
  }
})
export default class WalletSelect extends React.Component {

  selectWallet = (event) => {
    this.props.dispatch(selectWallet(
      event.target.value
    ))
  }

  render() {
    var walletOptions = this.props.wallets.map((acc, index) => {
      return <option key={acc.address} value={acc.address}>{acc.name}</option>
    })
    return (
    <label>
      Using wallet:
      <select value={this.props.selectedWallet} onChange={this.selectWallet}>
        <option key="1" value="no">No account selected</option>
        {walletOptions}
      </select>
      Selected: {this.props.selectedWallet}
    </label>)
  }
}
