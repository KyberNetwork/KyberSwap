import React from "react"

const ModifyWalletForm = (props) => {  
  return (
    <div class="form">
      <div className="row">
        <div className="large-12 columns account-name">
          <label>Wallet Name</label>
          <input id="wallet-name" onChange={props.onChange} value={props.value} type="text" placeholder="Give your account a name"/>                
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

export default ModifyWalletForm
