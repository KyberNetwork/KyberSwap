import React from "react"
import { Modal } from '../CommonElement'
import * as analytics from "../../utils/analytics"
import { getAssetUrl } from "../../utils/common";

const ImportByPromoCodeView = (props) => {

  function submit(e) {
    if (e.key === 'Enter') {
      importPromocode(e)
    }
  }

  function importPromocode() {
    let promoCode = document.getElementById("promo_code").value
    props.importPromoCode(promoCode)
    analytics.trackClickSubmitPromoCode()
  }

  return (
    <div className="column column-block">
      <div className="importer promoCode">
        <div className="importer__symbol">
          <img src={getAssetUrl('wallets/promo_code.svg')} />
          <div className="importer__name">{props.translate("landing_page.promo_code") || "PROMO CODE"}</div>
        </div>
        <button className="importer__button" onClick={(e) => props.modalOpen()}>{props.translate("import.enter_promo_code") || "Enter your Promo Code"}</button>
      </div>

      <Modal
        className={{ base: 'reveal medium', afterOpen: 'reveal medium import-privatekey' }}
        isOpen={props.isOpen}
        onRequestClose={() => props.onRequestClose()}
        content={
          <div>
            <div className="title">{props.translate("import.enter_promo_code") || "ENTER YOUR PROMO CODE"}</div>
            <a className="x" onClick={props.onRequestClose}>&times;</a>
            <div className="content with-overlap">
              <div className="row">
                <div className="column">
                  <center>
                    <label className={!!props.promoCodeError ? "error" : ""}>
                      <div className="input-reveal">
                        <input
                          className="text-center" id="promo_code"
                          type="text"
                          onChange={(e) => props.onChange(e)}
                          onKeyPress={(e) => submit(e)}
                          autoFocus
                          autoComplete="off"
                          spellCheck="false"
                          onFocus={(e) => {analytics.trackClickInputPromoCode()}}
                          required
                        />
                      </div>
                      {!!props.promoCodeError &&
                      <span className="error-text">{props.promoCodeError}</span>
                      }
                    </label>
                  </center>
                </div>
              </div>
            </div>
            <div className="overlap">
              <button className="button accent cur-pointer" onClick={(e) => importPromocode()}>
                {props.translate("import.apply") || "Apply"}
              </button>
            </div>
          </div>
        }
      />
    </div>
  )
}

export default ImportByPromoCodeView
