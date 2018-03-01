import React from "react"
import { gweiToEth, stringToBigNumber } from "../../utils/converter"

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
		if (input.classList.contains('security')) {
			input.classList.remove('security')
			input.parentElement.classList.add('unlock')
		} else if (input.type == 'text') {
			input.classList.add('security')
			input.parentElement.classList.remove('unlock')
		}
  }

  var gasPrice = stringToBigNumber(gweiToEth(props.gasPrice))
  var totalGas = gasPrice.multipliedBy(props.gas)
  return (
    <div >
      <div className="title text-center">{props.translate("modal.enter_password") || "Enter Password"}</div>
      <a className="x" onClick={() => props.onCancel()}>&times;</a>
      <div className="content with-overlap">
        <div className="row">
          <div className="column">
            <center>
            {props.recap}
              <div className="gas-configed text-light">
                <div class="d-flex justify-content-around">
                  <p>Gas Price</p>
                  <p>{props.gasPrice} Gwei</p>
                </div>
                <div class="d-flex justify-content-around">
                  <p>{props.translate("transaction.transaction_fee") || "Transaction Fee"}</p>
                  <p>{props.isFetchingGas ?
                    <img src={require('../../../assets/img/waiting-white.svg')} /> 
                    : <span>{totalGas.toString()}</span>
                  } ETH</p>
                </div>
              </div>
              <label className={!!props.passwordError ? "error" : ""}>
                <div className="input-reveal">
                  <input className="text-center security" id="passphrase" type="text" 
                    autoComplete="off" spellCheck="false"
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
        <a className={"button accent process-submit" + (props.isConfirming || props.isFetchingGas || props.isFetchingRate ? " waiting" : " next")}
          onClick={(e) => submitTransaction(e)}>
          {props.translate("modal.confirm") || "Confirm"}
        </a>
      </div>
    </div>
  )
}

export default PassphraseModal
