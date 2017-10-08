import React from "react"


const ModifyAccountForm = (props) => {  
  return (
    <div class="form">
      <div className="row">
        <div className="large-12 columns account-name">
          <label>Account Name</label>
          <input id="account-name" onChange={props.onChange} value={props.value} type="text" placeholder="Give your account a name"/>                
        </div>
      </div>                                 
      <div className="row">
        <div className="large-12 columns submit-button">
          <button class="button" onClick={props.action}>Update</button>
        </div>
      </div>
    </div>
  )
}

export default ModifyAccountForm
