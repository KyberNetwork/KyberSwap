import React from "react"
import { gweiToEth, stringToBigNumber, calculateGasFee, roundingNumber } from "../../utils/converter"

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
  var totalGas = +calculateGasFee(props.gasPrice, props.gas)
  //var totalGas = gasPrice.multipliedBy(props.gas)
  return (
    <div >
      <a className="x" onClick={() => props.onCancel()}>&times;</a>
      <div className="content with-overlap">
        <div className="title">{props.title}</div>
        <div className="row">
          <div>
            <div>
            {props.recap}
              <div className="gas-configed">
                <div>{props.translate("transaction.included") || 'Included'}</div>
                <div className="row">
                  <span className="column small-6">{props.translate("transaction.gas_price") || 'Gas price'}</span>
                  <span className="column small-6 font-w-i">{+roundingNumber(props.gasPrice)} Gwei</span>
                </div>
                <div className="row">
                  <span className="column small-6">{props.translate("transaction.transaction_fee") || "Transaction Fee"}</span>
                  <span className="column small-6 font-w-i">{props.isFetchingGas ?
                    <img src={require('../../../assets/img/waiting-white.svg')} />
                    : <span>{totalGas.toString()}</span>
                  } ETH</span>
                </div>
              </div>
              {!props.isFetchingRate &&
                <div className="des">
                  <div><img src={require('../../../assets/img/exchange/exclaimed.svg')}/></div>
                  <div className="description">
                    <span>
                      {props.translate("transaction.max_slippage", {  percent: props.slippagePercent }) || "with maximum " + props.slippagePercent + "% slippage may change."}
                    </span>
                    <div>
                    {props.translate("transaction.slippage_tip") || "Rate may change. You can change maximum slippage rate by adjusting min rate in advanced option"}
                    </div>
                  </div>
                </div>
          }
              {/* <div className="gas-configed">
                <div class="d-flex justify-content-around">
                  <p>Gas Price</p>
                  <p>{+roundingNumber(props.gasPrice)} Gwei</p>
                </div>
                <div class="d-flex justify-content-around">
                  <p>{props.translate("transaction.transaction_fee") || "Transaction Fee"}</p>
                  <p>{props.isFetchingGas ?
                    <img src={require('../../../assets/img/waiting-white.svg')} /> 
                    : <span>{totalGas.toString()}</span>
                  } ETH</p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="overlap">
        <div className={!!props.passwordError ? "error password-input" : "password-input"}>
          <div class="type-password">Type a password before progressing</div>
          <div className="input-passpharse grid-x">
            <div className="input-reveal cell small-12 medium-8">              
              <input className="text-center security" id="passphrase" type="text"
                autoComplete="off" spellCheck="false"
                placeholder="Password"
                onChange={(e) => props.onChange(e)} autoFocus onKeyPress={(e) => submit(e)} />
              <a className="toggle" onClick={() => toggleShowPw()}></a>
              <a className="tootip"></a>
            </div>
            <div className="cell small-12 medium-4">
              <a className={"button process-submit" + (props.isConfirming || props.isFetchingGas || props.isFetchingRate ? " waiting" : " next")}
                onClick={(e) => submitTransaction(e)}>
                {props.translate("modal.confirm").toLocaleUpperCase() || "Confirm".toLocaleUpperCase()}
              </a>
            </div>
          </div>
          {!!props.passwordError &&
              <span className="error-text">{props.passwordError}</span>
            }
        </div>
        
      </div>
    </div>
  )
}

export default PassphraseModal
