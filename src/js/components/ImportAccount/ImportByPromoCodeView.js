import React from "react"
import { Modal } from '../CommonElement'
import * as analytics from "../../utils/analytics"

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
    <div>
      {!props.isOnMobile && (
        <div className={"import-account__block"} onClick={(e) => props.modalOpen()}>
          <div className="import-account__icon promo-code"/>
          <div className="import-account__name">{props.translate("landing_page.promo_code") || "PROMO CODE"}</div>
        </div>
      )}

      {props.isOnMobile && (
        <div className={"import-account__block"}>
          <div className={"import-account__block-left"}>
            <div className="import-account__icon promo-code"/>
            <div>
              <div className="import-account__name">{props.translate("landing_page.promo_code") || "PROMO CODE"}</div>
              <div className="import-account__desc">Access your Wallet</div>
            </div>
          </div>
          <div className="import-account__block-right" onClick={(e) => props.modalOpen()}>Enter</div>
        </div>
      )}

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
