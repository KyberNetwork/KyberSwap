import React from "react"

import ReactPasswordStrength from "react-password-strength"

const ReCredential = (props) => {  
 	var error = ""
  if (props.error && props.error != "") {
    error = (<div class="error">
      <i class="k-icon k-icon-error"></i>
      {props.error}
    </div>)
  }
  return (
    <div>      	
    	<div>	
    		<label>Passphrase</label>
        <div class="input-space">
          <ReactPasswordStrength              
            minLength={6}
            scoreWords={['weak', 'okay', 'good', 'strong', 'stronger']}            
            inputProps={{ id: props.passphraseID, onKeyPress: props.onKeyPressPassword, placeholder: "Type in your passphrase", name:"password"}}            
          />	          
        </div>
    	</div>

      <div>
      	<label>Retype Passphrase</label>
        <div class="input-space">
          <input onKeyPress={props.onKeyPressRePassword} id={props.repassphraseID} name="re_password" type="password" placeholder="Retype your passphrase"/>
        </div>
      </div>
      {error}
    </div>
  )
}

export default ReCredential
