import React from "react"
import { connect } from "react-redux"

import { specifyRecipient } from "../../actions/paymentFormActions"


@connect((store) => {
  return {
    destAddress: store.paymentForm.destAddress,
  }
})
export default class RecipientSelect extends React.Component {

  specifyDestAddress = (event) => {
    this.props.dispatch(specifyRecipient(event.target.value))
  }

  render() {
    return (
    <label>
      Recipient address:
      <div>
        <input type="text" value={this.props.destAddress} onChange={this.specifyDestAddress} value={this.props.destAddress} />
      </div>
      Specified recipient address: {this.props.destAddress}
    </label>)
  }
}
