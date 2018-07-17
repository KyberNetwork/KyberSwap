import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux'
import { DropFile } from "../../components/ImportAccount"
import { importNewAccount, throwError } from "../../actions/accountActions"
import { verifyKey, anyErrors } from "../../utils/validators"
import { addressFromKey } from "../../utils/keys"
import { getTranslate } from 'react-localize-redux'

@connect((store, props) => {
  var tokens = store.tokens.tokens
  var supportTokens = []
  Object.keys(tokens).forEach((key) => {
    supportTokens.push(tokens[key])
  })
  return {
    account: store.account,
    ethereum: store.connection.ethereum,
    tokens: supportTokens,
    translate: getTranslate(store.locale),
    screen: props.screen
  }
})

export default class ImportKeystore extends React.Component {

  lowerCaseKey = (keystring) => {
    return keystring.toLowerCase()
  }

  goToExchange = () => {
    this.props.dispatch(push('/exchange'));
  }

  onDrop = (files) => {
    try {
      var _this = this
      var file = files[0]
      var fileReader = new FileReader()
      fileReader.onload = (event) => {
        var keystring = this.lowerCaseKey(event.target.result)
        var errors = {}
        errors["keyError"] = verifyKey(keystring)
        if (anyErrors(errors)) {
          this.props.dispatch(throwError("Your uploaded JSON file is invalid. Please upload a correct JSON keystore."))
        } else {
          var address = addressFromKey(keystring)
          this.props.dispatch(importNewAccount(address,
            "keystore",
            keystring,
            this.props.ethereum,
            this.props.tokens, this.props.screen))
        }

      }
      fileReader.readAsText(file)
    } catch (e) {
      console.log(e)
    }

  }

  render() {
    return (
      <DropFile id="import_json"
        error={this.props.account.error}
        onDrop={this.onDrop}
        translate={this.props.translate}
      />
    )
  }
}
