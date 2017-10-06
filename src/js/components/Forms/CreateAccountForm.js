import React from "react"

import {ReCredential} from "./Components"

const passphraseID = "create-pass"
const repassphraseID = "re-create-pass"

const CreateAccountForm = (props) => {  
 	function focusNext(value, event){         
    if(event.key === 'Enter'){
      event.preventDefault()
      if(document.getElementsByName(value)[0]){
        document.getElementsByName(value)[0].focus();        
      }      
    }
  }
  return (
    <div class="form">
      <div className="row">
        <div className="large-12 columns account-name">
          <label>Account Name</label>
          <input onKeyPress={(event) => focusNext('password', event)} value={props.value} onChange={props.onChange} type="text" placeholder="Give your account a name"/>                
        </div>
      </div>            
      <div className="row">
        <div className="large-12 columns account-name">
          <ReCredential onKeyPressRePassword={props.onKeyPressRePassword} onKeyPressPassword={(event) => focusNext('re_password', event)} passphraseID={passphraseID} repassphraseID={repassphraseID} error={props.error}/>
        </div>
      </div>            
      <div className="row">
        <div className="large-12 columns submit-button">
          <button class="button" onClick={props.action}>Create account</button>
        </div>
      </div>
    </div>
  )
}

export default CreateAccountForm
