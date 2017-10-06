import React from "react"
import {DropFile} from "./Components"


const ImportAccountForm = (props) => {  
  return (
    <div class="form">
      <div className="row">
        <div className="large-12 columns keystore">
          <label>JSON keystore file</label>
          <div className="dropzone">
            <DropFile 
            address={props.address}
            error ={props.error}
            keystring ={props.keystring}
            onDrop = {props.onDrop}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="large-12 columns account-name">
          <label>Account Name</label>
          <input value={props.value} onChange={props.onChange} type="text" placeholder="Give your account a name"/>                
        </div>
      </div>            
      <div className="row">
        <div className="large-12 columns submit-button">
          <button class="button" onClick={props.action}>Import account</button>
        </div>
      </div>
    </div>
  )
}

export default ImportAccountForm
