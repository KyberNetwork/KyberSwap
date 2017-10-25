import React from "react"

const PassphraseModal = (props) => {  
  return (
    <div>
        <div>{props.recap}</div>
        <input type="password" id="passphrase" onChange={(e)=>props.onChange(e)} />
        <button onClick={(e) => props.onClick(e)}>Exchange</button>
        {props.passwordError}
      </div>
  )
}

export default PassphraseModal
