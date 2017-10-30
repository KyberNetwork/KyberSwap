import React from "react"

const PassphraseModal = (props) => {  
  function submitTransaction(e) {    
      if (e.key == "Enter") {
        props.onClick(e)
      }
  }
  return (
    <div >
      <div class="title text-center">Enter Passphrase</div>
      <a class="x" onClick={(e)=>props.onCancel(e)}>&times;</a>
      <div class="content with-overlap">
        <div class="row">
          <div class="column">
            <center>
              {/* <p>You are about to transfer<br/><strong>1.234567 ETH</strong>&nbsp;to&nbsp;<strong>0xde0b29 ... 697bae</strong></p> */}
              {props.recap}
              <label className={!!props.passwordError?"error":""}>
                <input class="text-center" id="passphrase" type="password" placeholder="Enter your passphrase to confirm" 
                       onChange={(e)=>props.onChange(e)} 
                       onKeyPress={submitTransaction}/>
                {!!props.passwordError &&
                  <span className="error-text">{props.passwordError}</span>              
                }                
              </label>
            </center>
          </div>
        </div>
      </div>
      <div class="overlap"><a class="button accent" onClick={(e) => props.onClick(e)}>Confirm</a></div>
    </div>


    // <div>
    //   <div>{props.recap}</div>
    //   <input type="password" id="passphrase" onChange={(e)=>props.onChange(e)} />
    //   <button onClick={(e) => props.onClick(e)}>Exchange</button>
    //   {props.passwordError}
    // </div>
  )
}

export default PassphraseModal
