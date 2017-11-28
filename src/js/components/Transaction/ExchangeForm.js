import React from "react"
import { roundingNumber } from "../../utils/converter"

const ExchangeForm = (props) => {
  function moveCursor(){
    let inp = document.getElementById('inputSource')
    inp.focus();
    inp.setAttribute('type', 'text');
    if (inp.createTextRange) {
      var part = inp.createTextRange();
      part.move("character", 0);
      part.select();
    } else if (inp.setSelectionRange) {
        inp.setSelectionRange(0, 0);
    }
    inp.setAttribute('type', 'number');
  }
  var errorToken = props.errors.selectSameToken + props.errors.selectTokenToken
  var tokenRate = props.isSelectToken ? <img src="/assets/img/waiting.svg" /> : roundingNumber(props.exchangeRate.rate)
  var render = (
    <div>
      <div class="frame">
        <div class="row">
          <div class="column small-11 medium-10 large-8 small-centered">
            <h1 class="title">Exchange</h1>
            <form action="#" method="get">
              <div class="row">
                <div class="column medium-6">
                  <label style={{marginBottom: 0}}>Exchange From

                    <div className={errorToken === "" && props.errors.sourceAmount === "" ? "token-input" : "token-input error"}>

                      <input id="inputSource" type={props.input.sourceAmount.type} className="source-input" value={props.input.sourceAmount.value} onFocus={props.input.sourceAmount.onFocus} onChange={props.input.sourceAmount.onChange} min="0" step="0.000001" placeholder="0" />

                      {props.tokenSource}
                    </div>
                    {errorToken !== "" &&
                      <span class="error-text">{errorToken}</span>
                    }
                    {props.errors.sourceAmount !== "" &&
                      <span class="error-text">{props.errors.sourceAmount}</span>
                    }
                  </label>
                  <div class="address-balance">
                    <span class="note">Address Balance</span>
                    <a className="value" onClick={() => {
                        props.setAmount()
                        setTimeout(moveCursor, 0);
                      }} title={props.balance.value}>
                      {props.balance.roundingValue} {props.sourceTokenSymbol}
                    </a>
                  </div>
                </div>
                <div class="column medium-6">
                  <label>Exchange To
                    <div class="token-input">
                      <input type={props.input.destAmount.type} className="des-input" value={props.input.destAmount.value} onFocus={props.input.destAmount.onFocus} onChange={props.input.destAmount.onChange} min="0" step="0.000001" placeholder="0" />
                      {props.tokenDest}
                    </div>
                  </label>
                </div>
              </div>
              <div class="row">
                <div class="column">
                  <p class="token-compare" title={tokenRate}>
                    1 {props.exchangeRate.sourceToken} = {tokenRate} {props.exchangeRate.destToken}
                  </p>
                </div>
              </div>
              {props.step === 2 &&
                <div class="row hide-on-choose-token-pair">
                  <div class="column">
                    <div class="clearfix">
                      <div class="advanced-switch base-line float-right">
                        <div class="switch accent">
                          <input class="switch-input" id="advanced" type="checkbox" />
                          <label class="switch-paddle" for="advanced"><span class="show-for-sr">Advanced Mode</span></label>
                        </div>
                        <label class="switch-caption" for="advanced">Advanced</label>
                      </div>
                    </div>
                    <div class="advanced-content" disabled>
                      {props.gasConfig}
                    </div>
                  </div>
                </div>
              }
            </form>
          </div>
        </div>
      </div>
      {props.exchangeButton}
      {props.selectTokenModal}
    </div>
  )
  return (

    <div className={props.step === 1 ? "choose-token-pair" : ""} id="exchange">
      {props.step !== 3 ? render : ''}
      <div class="page-3">
        {props.step == 3 ? props.trasactionLoadingScreen : ''}
      </div>
    </div>
  )
}

export default ExchangeForm
