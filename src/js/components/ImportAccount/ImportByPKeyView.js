import React from "react"
import { Modal } from '../CommonElement'

const ImportByPKeyView = (props) => {

  function handldeSubmit() {
    let privateKey = document.getElementById("private_key").value
    props.importPrivateKey(privateKey)
    props.analytics.callTrack("trackClickSubmitPrKey");
  }

  function submit(e) {
    if (e.key === 'Enter') {
      handldeSubmit(e)
    }
  }

  function toggleShowPw() {
    let input = document.getElementById('private_key')
    if (input.classList.contains('security')) {
      input.classList.remove('security')
      input.parentElement.classList.add('unlock')
      props.analytics.callTrack("trackClickShowPassword", "show");
    } else if (input.type == 'text') {
      input.classList.add('security')
      input.parentElement.classList.remove('unlock')
      props.analytics.callTrack("trackClickShowPassword", "hide");
    }
  }

  return (
    <div>
      {/* {!props.isOnMobile && ( */}
        <div className="import-account__block" onClick={(e) => props.modalOpen()}>
          <div className="import-account__icon private-key"/>
          <div className="import-account__name">{props.translate("import.from_private_key") || "PRIVATE KEY"}</div>
        </div>
      {/* )} */}

      {/* {props.isOnMobile && (
        <div className={"import-account__block"}>
          <div className={"import-account__block-left"}>
            <div className="import-account__icon private-key"/>
            <div>
              <div className="import-account__name">{props.translate("import.from_private_key") || "PRIVATE KEY"}</div>
              <div className="import-account__desc">Access your Wallet</div>
            </div>
          </div>
          <div className="import-account__block-right" onClick={(e) => props.modalOpen()}>Enter</div>
        </div>
      )} */}

      <Modal
        className={{ base: 'reveal medium', afterOpen: 'reveal medium import-privatekey' }}
        isOpen={props.isOpen}
        onRequestClose={() => props.onRequestClose()}
        content={
          <div>
            <div className="title">{ props.translate("import.from_private_key_input_title") || "Enter your Private Key"}</div><a className="x" onClick={props.onRequestClose}>&times;</a>
            <div className="content with-overlap">
              <div className="row">
                <div className="column">
                  <center>
                    <label className={!!props.pKeyError ? "error" : ""}>
                      <div className="input-reveal">
                        <input className="text-center security" id="private_key"
                               type="text"
                               onChange={(e) => props.onChange(e)}
                               onKeyPress={(e) => submit(e)}
                               value={props.privateKey}
                               autoFocus
                               autoComplete="off"
                               spellCheck="false"
                               onFocus={(e) => {props.analytics.callTrack("trackClickInputPrKey")}}
                               required />
                        <p>{props.privateKeyVisible}</p>
                        <a className="toggle" onClick={toggleShowPw}></a>
                        <a className="tootip"></a>
                      </div>
                      {!!props.pKeyError &&
                      <span className="error-text">{props.pKeyError}</span>
                      }
                    </label>
                  </center>
                </div>
              </div>
            </div>
            <div className="overlap">
              <button className="button accent cur-pointer" id="submit_pkey" onClick={() => handldeSubmit()} >{props.translate("modal.import") || "Import"}</button>
            </div>

          </div>
        }
      />
    </div>
  )
}

export default ImportByPKeyView
