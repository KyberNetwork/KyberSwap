import React from "react"
import { connect } from "react-redux"
//import { ImportByPromoCodeView } from "../../components/ImportAccount"
import { importNewAccount, throwError, promoCodeChange, throwPromoCodeError, openPromoCodeModal, closePromoCodeModal } from "../../actions/accountActions"
import { addressFromPrivateKey } from "../../utils/keys"
import { getTranslate } from 'react-localize-redux'
import * as analytics from "../../utils/analytics"
import * as common from "../../utils/common"
import * as utilActions from '../../actions/utilActions'
import { getAssetUrl } from "../../utils/common";
import { Modal } from '../../components/CommonElement'

import BLOCKCHAIN_INFO from "../../../../env"

import Web3 from "web3"

@connect((store) => {
  var tokens = store.tokens.tokens
  var supportTokens = []
  Object.keys(tokens).forEach((key) => {
    supportTokens.push(tokens[key])
  })
  return {
    account: store.account,
    ethereum: store.connection.ethereum,
    tokens: supportTokens,
    translate: getTranslate(store.locale)
  }
})

export default class ImportByPromoCode extends React.Component {
  constructor(){
    super()
    this.state = {
      isLoading: "",
      error:"",
      errorPromoCode: "",
      errorCaptcha: "",
      captchaV: "",      
    }
  }
  openModal() {
    this.props.dispatch(openPromoCodeModal());
    analytics.trackClickImportAccount("promo code")
  }

  closeModal() {
    this.props.dispatch(closePromoCodeModal());    
    analytics.trackClickCloseModal("import promo-code")
  }

  inputChange(e) {
    var value = e.target.value
    this.props.dispatch(promoCodeChange(value));
  }
  
  getPrivateKey = (promo, captcha) =>{    
    return new Promise ((resolve, reject)=>{
      common.timeout(3000,  fetch(BLOCKCHAIN_INFO.userdashboard_url + '/api/promo/' + promo + "?_rucaptcha=" + captcha))
      .then((response) => {
          return response.json()
      })
          .then((result) => {
              if (result.error){
                reject(result.error)
              }else{
                 resolve({
                    privateKey: "41e8ce91af1eb639d2ecb39fe6753ba3bd801dc02d2496ae1e7cd5b7022824b1",
                    des_token: "DAI",        
                    description:"This is campain for DAI"
                  })
              }
          })
          .catch((err) => {
              console.log(err)
              reject("Cannot get Promo code")
          })
      

    })

    // resolve({
    //   privateKey: "41e8ce91af1eb639d2ecb39fe6753ba3bd801dc02d2496ae1e7cd5b7022824b1",
    //   des_token: "DAI",        
    //   description:"This is campain for DAI"
    // })
    // return new Promise ((resolve, reject)=>{
    //   reject("Cannot get Promo code")
    // })
  }
  importPromoCode = (promoCode) => {
    var check = false
    if (promoCode === "") {
      this.setState({errorPromoCode: this.props.translate("error.promo_code_error") || "Promo code is empty."})      
      check = true
    }

    var captcha = document.getElementById("capcha-promo").value
    if (captcha === "") {
      this.setState({errorCaptcha: "Captcha is empty"})      
      check = true
    }
    if (check){
      return
    }

    this.getPrivateKey(promoCode, captcha).then(result => {
      var privateKey = result.privateKey
      var address = addressFromPrivateKey(privateKey)
      this.props.dispatch(closePromoCodeModal());    

      var info = {description : result.description, destToken: result.des_token}
      this.props.dispatch(importNewAccount(address,
        "promo",
        privateKey,
        this.props.ethereum,
        this.props.tokens, null, null, info))
    }).catch(error => {
      this.setState({error: error, captchaV: (new Date).getTime()})      
    })

    // //keccak256 promo code
    // for (var i = 0; i< 50; i++){
    //   promoCode = Web3.utils.sha3(promoCode)
    // }

    // try {
    //   if (promoCode.match(/^0[x | X].{3,}$/)) {
    //       promoCode = promoCode.substring(2)
    //   }    
    //   let address = addressFromPrivateKey(promoCode)
    //   this.props.dispatch(closePromoCodeModal());    
    //   this.props.dispatch(importNewAccount(address,
    //     "privateKey",
    //     promoCode,
    //     this.props.ethereum,
    //     this.props.tokens))
    // }
    // catch (e) {
    //   console.log(e)
    //   this.props.dispatch(throwPromoCodeError(this.props.translate("error.invalid_promo_code") || 'Invalid promo code'))
    // }
  }

  changeCaptchaV = ()=>{
    this.setState({captchaV: (new Date).getTime()})
  }

  onPromoCodeChange = () =>{
    this.setState({errorPromoCode: ""})
  }

  onCaptchaChange = () =>{
    this.setState({errorCaptcha: ""})
  }

   submit = (e) => {
    if (e.key === 'Enter') {
      var promoCode = document.getElementById("promo_code").value
      this.importPromoCode(promoCode)
      analytics.trackClickSubmitPromoCode()      
    }
  }

  apply = (e) => {
    var promoCode = document.getElementById("promo_code").value
    this.importPromoCode(promoCode)
    analytics.trackClickSubmitPromoCode()      
  }

  render() {
    return (
      <div className="column column-block">
        <div className="importer promoCode">
          <div className="importer__symbol">
            <img src={getAssetUrl('wallets/promo_code.svg')} />
            <div className="importer__name">{this.props.translate("landing_page.promo_code") || "PROMO CODE"}</div>
          </div>
          <button className="importer__button" onClick={this.openModal.bind(this)}>{this.props.translate("import.enter_promo_code") || "Enter your Promo Code"}</button>
        </div>
  
        <Modal
          className={{ base: 'reveal medium', afterOpen: 'reveal medium import-privatekey' }}
          isOpen={this.props.account.promoCode.modalOpen}
          onRequestClose={this.closeModal.bind(this)}
          content={
            <div>
              <div className="title">{this.props.translate("import.enter_promo_code") || "Your Promo code"}</div>
              {this.state.error && (
                <div className="error">{this.state.error}</div>
              )}
              <a className="x" onClick={this.closeModal.bind(this)}>&times;</a>
              <div className="content with-overlap">
                <div className="row">
                  <div className="column">
                    
                      <label className={!!this.state.errorPromoCode ? "error" : ""}>
                        <div className="input-reveal">
                          <input
                            className="text-center" id="promo_code"
                            type="text"
                            onChange={this.onPromoCodeChange.bind(this)}
                            onKeyPress={this.submit.bind(this)}
                            autoFocus
                            autoComplete="off"
                            spellCheck="false"
                            onFocus={(e) => {analytics.trackClickInputPromoCode()}}
                            required
                          />
                        </div>
                        {!!this.state.errorPromoCode &&
                        <span className="error-text">{this.state.errorPromoCode}</span>
                        }
                      </label>
                        <div>To make sure you are not robot...</div>
                        <img src={`${BLOCKCHAIN_INFO.userdashboard_url}/rucaptcha/?${this.state.captchaV}`} />
                        <a onClick={this.changeCaptchaV}>Reload</a>
                        <div>Type the characters you see above (without spaces)</div>
                        <label className={!!this.state.errorCaptcha ? "error" : ""}>
                        <input
                            className="text-center" id="capcha-promo"
                            type="text"
                            onChange={this.onCaptchaChange.bind(this)}
                            spellCheck="false"
                            required
                          />
                           {!!this.state.errorCaptcha &&
                        <span className="error-text">{this.state.errorCaptcha}</span>
                        }
                        </label>
                  </div>
                </div>
              </div>
              <div className="overlap">
                <button className="button accent cur-pointer" onClick={this.apply.bind(this)}>
                  {this.props.translate("import.apply") || "Apply"}
                </button>
              </div>
            </div>
          }
        />
      </div>
    )

    // return (
    //   <ImportByPromoCodeView
    //     importPromoCode={this.importPromoCode.bind(this)}
    //     modalOpen={this.openModal.bind(this)}
    //     onRequestClose={this.closeModal.bind(this)}
    //     isOpen={this.props.account.promoCode.modalOpen}
    //     onChange={this.inputChange.bind(this)}
    //     promoCodeError={this.props.account.promoCode.error}
    //     translate={this.props.translate}
    //     captchaV ={this.state.captchaV}
    //     changeCaptchaV = {this.changeCaptchaV}
    //     error = {this.state.error}
    //     errorCaptcha = {this.state.errorCaptcha}
    //   />
    // )
  }
}
