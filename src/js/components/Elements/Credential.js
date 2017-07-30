import React from "react";


export default class Credential extends React.Component {
  render() {
    var error = ""
    if (this.props.error && this.props.error != "") {
      error = (<div class="error">
        <i class="k-icon k-icon-error"></i>
        Your password is {this.props.error}
      </div>)
    }
    return (
      <div>
        <label><strong>Type in your passphrase to sign your transaction</strong></label>
        <div class="input-space">
          <i class="k-icon k-icon-lock-white"></i>
          <input name="random" id={this.props.passphraseID} type="password"/>
        </div>
        {error}
      </div>
    )
  }
}
