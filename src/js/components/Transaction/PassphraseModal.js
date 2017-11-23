import React from "react"

const PassphraseModal = (props) => {
  function submitTransaction(e) {
    e.preventDefault();
    let password = document.querySelector('#passphrase').value;
    props.onClick(password);
  }

  function submit(e){
    if ( e.key === 'Enter' ) {
      submitTransaction(e)
    }
  }

  return (
    <div >
      <div className="title text-center">Enter Password</div>
      <a className="x" onClick={() => props.onCancel()}>&times;</a>
      <div className="content with-overlap">
        <div className="row">
          <div className="column">
            <center>
              {/* <p>You are about to transfer<br/><strong>1.234567 ETH</strong>&nbsp;to&nbsp;<strong>0xde0b29 ... 697bae</strong></p> */}
              {props.recap}
              
                <label className={!!props.passwordError ? "error" : ""}>
                  <input className="text-center" id="passphrase" type="password" placeholder="Enter your password to confirm"
                    onChange={(e) => props.onChange(e)} autoFocus onKeyPress = {(e) => submit(e)}/>
                  {!!props.passwordError &&
                    <span className="error-text">{props.passwordError}</span>
                  }
                </label>
             
            </center>
          </div>
        </div>
      </div>
      <div className="overlap">
        <a className="button accent process-submit"
          onClick={(e) => submitTransaction(e)}>
          Confirm
        </a>
      </div>
    </div>
  )
}

export default PassphraseModal
