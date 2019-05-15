import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux'
import { DropFile } from "../../components/ImportAccount"
import { importNewAccount, throwError } from "../../actions/accountActions"
import { verifyKey, anyErrors } from "../../utils/validators"
import { addressFromKey } from "../../utils/keys"
import { getTranslate } from 'react-localize-redux'

import { Modal } from "../CommonElements"

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
    screen: props.screen,
    analytics: store.global.analytics
  }
})

export default class ImportKeystore extends React.Component {

  constructor(){
    super()
    this.state = {
      isOpen: false,
      error: "",
      keystring: ""
    }
  }

  closeModal = () => {
    this.setState({isOpen: false, error:""})
  }

  unLock = () => {
    alert("unlock")
    // var address = addressFromKey(this.state.keystring)
    // this.props.dispatch(importNewAccount(address,
    //   "keystore",
    //   this.state.keystring,
    //   this.props.ethereum,
    //   this.props.tokens, this.props.screen))
  }

  content = () => {
    return (
      <div className="keystore-modal">
      <div className="title">Type password to unlock your keystore</div>
      <a className="x" onClick={this.closeModal}>&times;</a>
      <div className="content with-overlap">
        <div className="row">
          <div>
              <input id="keystore-pass"/>
              {this.state.error && (
                <span>{this.state.error}</span>
              )}
          </div>

        </div>
      </div>
      <div className="overlap">
        <div className="input-confirm grid-x input-confirm--approve">
            <div className="cell medium-4 small-12">
              <a className={"button process-submit next"}
              onClick={this.unLock}
            >Unlock</a>
          </div>
        </div>
      </div>
    </div>
    )
  }

  lowerCaseKey = (keystring) => {
    return keystring.toLowerCase()
  }

  goToExchange = () => {
    this.props.dispatch(push('/exchange'));
  }

  onDrop = (files) => {
    this.props.analytics.callTrack("trackClickImportAccount", "keystore");
    try {
      var _this = this
      var file = files[0]
      var fileReader = new FileReader()
      fileReader.onload = (event) => {
        var keystring = this.lowerCaseKey(event.target.result)
        var errors = {}
        errors["keyError"] = verifyKey(keystring)
        if (anyErrors(errors)) {
          this.props.dispatch(throwError(this.props.translate("error.invalid_json_file") || "Your uploaded JSON file is invalid. Please upload a correct JSON keystore."))
        } else {
          this.setState({
            isOpen: true,
            keystring: keystring
          })       
        }

      }
      fileReader.readAsText(file)
    } catch (e) {
      console.log(e)
    }

  }

  render() {
    return (
      <div>
        <DropFile id="import_json"
          error={this.props.account.error}
          onDrop={this.onDrop}
          translate={this.props.translate}
        />
          <Modal className={{
            base: 'reveal medium confirm-modal',
            afterOpen: 'reveal medium confirm-modal'
          }}
            isOpen={this.state.isOpen}
            onRequestClose={this.closeModal}
            contentLabel="keystore modal"
            content={this.content()}
            size="medium"
          />
      </div>
    )
  }
}
