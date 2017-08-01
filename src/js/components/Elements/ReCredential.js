import React from "react";


export default class ReCredential extends React.Component {
  render() {
    var error = ""
    if (this.props.error && this.props.error != "") {
      error = (<div class="error">
        <i class="k-icon k-icon-error"></i>
        {this.props.error}
      </div>)
    }
    return (
      <div>      	
      	<div>	
      		<label>Passphrase</label>
	        <div class="input-space">
	          <input id={this.props.passphraseID} type="password" placeholder="Type in your passphrase"/>
	        </div>
      	</div>
        <div>
        	<label>Retype Passphrase</label>
	        <div class="input-space">
	          <input id={this.props.repassphraseID} type="password" placeholder="Retype your passphrase"/>
	        </div>
        </div>
        {error}
      </div>
    )
  }
}
