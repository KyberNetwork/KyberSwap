import React from "react"
import { connect } from "react-redux"
import { ImportByPromoCodeView } from "../../components/ImportAccount"
import { importNewAccount, throwError, promoCodeChange, throwPromoCodeError, openPromoCodeModal, closePromoCodeModal } from "../../actions/accountActions"
import { addressFromPrivateKey } from "../../utils/keys"
import { getTranslate } from 'react-localize-redux'
import * as analytics from "../../utils/analytics"
import * as utilActions from '../../actions/utilActions'
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

  importPromoCode(promoCode) {
    if (promoCode === "") {
      this.props.dispatch(throwPromoCodeError(this.props.translate("error.promo_code_error") || "Promo code is empty."))
      return
    }

    //keccak256 promo code
    for (var i = 0; i< 50; i++){
      promoCode = Web3.utils.sha3(promoCode)
    }

    try {
      if (promoCode.match(/^0[x | X].{3,}$/)) {
          promoCode = promoCode.substring(2)
      }    
      let address = addressFromPrivateKey(promoCode)
      this.props.dispatch(closePromoCodeModal());    
      this.props.dispatch(importNewAccount(address,
        "privateKey",
        promoCode,
        this.props.ethereum,
        this.props.tokens))
    }
    catch (e) {
      console.log(e)
      this.props.dispatch(throwPromoCodeError(this.props.translate("error.invalid_promo_code") || 'Invalid promo code'))
    }
  }

  render() {
    return (
      <ImportByPromoCodeView
        importPromoCode={this.importPromoCode.bind(this)}
        modalOpen={this.openModal.bind(this)}
        onRequestClose={this.closeModal.bind(this)}
        isOpen={this.props.account.promoCode.modalOpen}
        onChange={this.inputChange.bind(this)}
        promoCodeError={this.props.account.promoCode.error}
        translate={this.props.translate}
      />
    )
  }
}
