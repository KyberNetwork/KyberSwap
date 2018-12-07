import React from "react"
import { connect } from "react-redux"
//import { ImportByPromoCodeView } from "../../components/ImportAccount"
import Recaptcha from "react-recaptcha"
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
      isLoading: false,
      error:"",
      errorPromoCode: "",
      errorCaptcha: "",
      captchaV: "",    
      tokenCaptcha: "" ,
      isPassCapcha: false
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
                    privateKey: result.data.private_key,
                    des_token: result.data.destination_token,        
                    description: result.data.description
                  })
              }
          })
          .catch((err) => {
              console.log(err)
              reject("Cannot get Promo code")
          })
    })
  }
  verifyCallback = (response) => {
    console.log("captcha_response")
    console.log(response);
    if (response){
      this.setState({
        tokenCaptcha: response,
        isPassCapcha: true
      })
    }
  }

  expiredCallback = () => {
    this.setState({
      tokenCaptcha: "",
      isPassCapcha: false
    })
  }
  importPromoCode = (promoCode) => {
    var check = false
    if (promoCode === "") {
      this.setState({errorPromoCode: this.props.translate("error.promo_code_error") || "Promo code is empty."})      
      check = true
    }

    // var captcha = document.getElementById("capcha-promo").value
    // if (captcha === "") {
    //   this.setState({errorCaptcha: this.props.translate("error.capcha_error") || "Captcha is empty."})      
    //   check = true
    // }
    var captcha = this.state.tokenCaptcha
    if (check){
      return
    }
    this.setState({isLoading: true})
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
        this.setState({isLoading: false})
    }).catch(error => {
      this.setState({error: error, captchaV: (new Date).getTime()})      
      this.setState({isLoading: false})
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
    analytics.trackClickChangeCapcha()
  }

  onPromoCodeChange = () =>{
    this.setState({errorPromoCode: "", error: ""})
  }

  onCaptchaChange = () =>{
    this.setState({errorCaptcha: "", error: ""})
  }

  nextToCapcha = (e) => {
    if (e.key === 'Enter') {
      document.getElementById("capcha-promo").focus()
    }
  }

   submit = (e) => {
    if (e.key === 'Enter') {
      var promoCode = document.getElementById("promo_code").value
      this.importPromoCode(promoCode)
      analytics.trackClickSubmitPromoCode()      
    }
  }
  

  apply = (e) => {
    if(!this.state.isPassCapcha){
      return
    }
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
          className={{ base: 'reveal medium promocode', afterOpen: 'reveal medium import-privatekey' }}
          isOpen={this.props.account.promoCode.modalOpen}
          onRequestClose={this.closeModal.bind(this)}
          content={
            <div id="promocode-modal">
              <div className="title">
                {this.props.translate("import.enter_promo_code") || "Your Promo code"}
                {this.state.error && (
                  <div className="error">{this.state.error}</div>
                )}
              </div>
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
                            onKeyPress={this.nextToCapcha.bind(this)}
                            autoFocus
                            autoComplete="off"
                            spellCheck="false"
                            onFocus={(e) => {analytics.trackClickInputPromoCode()}}
                            required
                            placeholder="Enter your promocode here"
                          />
                        </div>
                        {!!this.state.errorPromoCode &&
                        <span className="error-text">{this.state.errorPromoCode}</span>
                        }
                      </label>
                        {/* <div className={"label-text"}>{this.props.translate("import.you_are_not_robot") || "To make sure you are not robot..."}</div>
                        <div className={"capcha"}>
                          <img src={`${BLOCKCHAIN_INFO.userdashboard_url}/rucaptcha/?${this.state.captchaV}`} />
                          <a onClick={this.changeCaptchaV}><div className={"refresh-capcha"}></div></a>
                        </div>
                        <div className={"label-text label-text-bottom"}>{this.props.translate("import.type_capcha") || "Type the characters you see above (without spaces)"}</div>
                        
                        <label className={!!this.state.errorCaptcha ? "error" : ""}>
                        <div className="input-reveal">
                          <input
                              className="text-center" id="capcha-promo"
                              type="text"
                              onChange={this.onCaptchaChange.bind(this)}
                              spellCheck="false"
                              onFocus={(e) => {analytics.trackClickInputCapcha()}}
                              required
                              onKeyPress={this.submit.bind(this)}
                            />
                          </div>
                           {!!this.state.errorCaptcha &&
                        <span className="error-text">{this.state.errorCaptcha}</span>
                        }
                        </label> */}
                      <div className="capcha-wrapper">
                        <Recaptcha sitekey="6LfTVn8UAAAAAIBzOyB1DRE5p-qWVav4vuZM53co"
                                     verifyCallback={this.verifyCallback}/>
                      </div>
                  </div>
                </div>
              </div>
              <div className="overlap promo-btn">
                <button className= {`button accent cur-pointer ${this.state.isPassCapcha ? "": "disable"}`} onClick={this.apply.bind(this)}>
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
