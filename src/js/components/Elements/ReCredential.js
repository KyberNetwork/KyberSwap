import React from "react";
import ReactPasswordStrength from "react-password-strength";

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
            <ReactPasswordStrength
              ref="passComponent"
              minLength={6}
              scoreWords={['weak', 'okay', 'good', 'strong', 'stronger']}            
              inputProps={{ id: this.props.passphraseID, onKeyPress: this.props.onKeyPressPassword, placeholder: "Type in your passphrase"}}            
            />	          
	        </div>
      	</div>

        <div>
        	<label>Retype Passphrase</label>
	        <div class="input-space">
	          <input onKeyPress={this.props.onKeyPressRePassword} id={this.props.repassphraseID} name="re_password" type="password" placeholder="Retype your passphrase"/>
	        </div>
        </div>
        {error}
      </div>
    )
  }
}
