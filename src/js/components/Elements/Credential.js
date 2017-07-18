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
    console.log('passphraseID: ', this.props.passphraseID)
    return (
      <div>
        <label class="title"><strong>Type in Your Passphrase to Exchange</strong></label>
        <div class="input-space">
          <span>
            <i class="k-icon k-icon-lock"></i>
          </span>
          <input id={this.props.passphraseID} type="password"/>
        </div>
        {error}
      </div>
    )
  }
}
