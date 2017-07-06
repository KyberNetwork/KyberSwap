import React from "react";
import { connect } from "react-redux";


@connect((store) => {
  return {
    address: store.exchangeForm.selectedAccount,
  }
})
export default class Credential extends React.Component {

  render() {
    return (
      <div>
        <label>
          Please enter your passphrase:
          <input id="passphrase" type="password"/>
        </label>
      </div>
    )
  }
}
