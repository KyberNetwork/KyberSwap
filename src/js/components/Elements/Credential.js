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
        <label>Passphrase</label>
        <div class="input-space">
          <input name="random" id={this.props.passphraseID} type="password" placeholder="Type in your passphrase"/>
        </div>
        {error}
      </div>
    )
  }
}
