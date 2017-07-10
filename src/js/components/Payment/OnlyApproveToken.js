import React from "react";
import { connect } from "react-redux";

import { specifyOnlyApproveToken } from "../../actions/paymentFormActions"


@connect((store) => {
  return {
    onlyApproveToken: store.paymentForm.onlyApproveToken,
  }
})
export default class OnlyApproveToken extends React.Component {

  specifyOnlyApproveToken = (event) => {
    this.props.dispatch(specifyOnlyApproveToken(event.target.checked))
  }

  render() {
    return (
      <label>
        <input type="checkbox" checked={this.props.onlyApproveToken} onChange={this.specifyOnlyApproveToken} />
        Only approve tokens
      </label>
    )
  }
}
