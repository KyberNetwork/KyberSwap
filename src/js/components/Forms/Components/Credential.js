import React from "react"

const Credential = (props)=> {
    var error = ""
    if (props.error && props.error != "") {
      error = (<div class="error">
        <i class="k-icon k-icon-error"></i>
        {props.error}
      </div>)
    }
    var classLabel = props.noLabel ?"hide":""
    return (
      <div>
        <label for={props.passphraseID} className={classLabel}>Passphrase</label>
        <div class="input-space">
          <input onKeyPress={props.onKeyPress} name="password" id={props.passphraseID} type="password" placeholder="Type in your passphrase"/>
        </div>
        {error}
      </div>
    )
}
export default Credential
