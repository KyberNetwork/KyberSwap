import React, { Fragment } from "react"
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

    <Fragment>
      {!props.isOnMobile && (
        <div className="import-account__block theme__import-button" onClick={(e) => props.modalOpen()}>
          <div className="import-account__icon private-key"/>
          <div className="import-account__name">{props.translate("import.from_private_key") || "PRIVATE KEY"}</div>
        </div>
      )}

      {props.isOnMobile && (
        <div className={"import-account__block theme__import-button"}>
          <div className={"import-account__block-left"}>
            <div className="import-account__icon private-key"/>
            <div>
              <div className="import-account__name">{props.translate("landing_page.private_key") || "PRIVATE KEY"}</div>
              <div className="import-account__desc">{props.translate("address.import_address") || "Access your Wallet"}</div>
            </div>
          </div>
          <div className="import-account__block-right" onClick={(e) => props.modalOpen()}>{props.translate("address.enter") || "Enter"}</div>
        </div>
      )}

      <Modal
        className={{ base: 'reveal tiny import-modal', afterOpen: 'reveal tiny import-modal' }}
        isOpen={props.isOpen}
        onRequestClose={() =>{
          props.closeParentModal()
          props.onRequestClose()
        }}
        content={
          <div className={"import-modal import-modal__private-key"}>
            <div className="import-modal__header">
              <div className="import-modal__header--title">{ props.translate("import.from_private_key_input_title") || "Enter your Private Key"}</div>
              <div className="x" onClick={() => {
                props.closeParentModal()
                props.onRequestClose()}}>&times;</div>
            </div>
            <div className="import-modal__body">
              <div className="input-reveal">
                <input className="security theme__background-44 theme__text" id="private_key"
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
              </div>
              {!!props.pKeyError &&
              <span className="error-text">{props.pKeyError}</span>
              }
            </div>
            <div className="import-modal__footer theme__background-2">
              <button className={"import-modal__footer--button"} id="submit_pkey" onClick={() => handldeSubmit()}>
                {props.translate("modal.import") || "Import"}
              </button>
            </div>
          </div>
        }
      />
    </Fragment>
  )
}

export default ImportByPKeyView
