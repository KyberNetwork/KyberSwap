import React from "react"

const PassphraseModal = (props) => {
  function submitTransaction(e) {
    e.preventDefault();
    let password = document.querySelector('#passphrase').value;
    props.onClick(password);
  }

  function submit(e) {
    if (e.key === 'Enter') {
      submitTransaction(e)
    }
  }

  function toggleShowPw() {
    let input = document.getElementById('passphrase')
    if (input.type == 'password') {
      input.type = 'text'
      input.parentElement.classList.add('unlock')
    } else if (input.type == 'text') {
      input.type = 'password'
      input.parentElement.classList.remove('unlock')
    }
  }
  return (
    <div >
      <div className="title text-center">{props.translate("modal.enter_password") || "Enter Password"}</div>
      <a className="x" onClick={() => props.onCancel()}>&times;</a>
      <div className="content with-overlap">
        <div className="row">
          <div className="column">
            <center>
              {props.recap}
              <label className={!!props.passwordError ? "error" : ""}>
                <div className="input-reveal">
                  <input className="text-center" id="passphrase" type="password" placeholder={props.translate("modal.enter_password_placeholder") ||"Enter your password to confirm"}
                    onChange={(e) => props.onChange(e)} autoFocus onKeyPress={(e) => submit(e)} />
                    <a className="toggle" onClick={() => toggleShowPw()}></a>
                </div>
                {!!props.passwordError &&
                  <span className="error-text">{props.passwordError}</span>
                }
              </label>
            </center>
          </div>
        </div>
      </div>
      <div className="overlap">
        <a className="button accent process-submit next"
          onClick={(e) => submitTransaction(e)}>
          {props.translate("modal.confirm") || "Confirm"}
        </a>
      </div>
    </div>
  )
}

export default PassphraseModal
