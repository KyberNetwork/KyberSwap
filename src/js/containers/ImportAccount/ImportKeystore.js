import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux'
import { DropFile } from "../../components/ImportAccount"
import { importNewAccount, throwError } from "../../actions/accountActions"
import { anyErrors, verifyKey } from "../../utils/validators"
import { addressFromKey, unlock } from "../../utils/keys"
import { getTranslate } from 'react-localize-redux'
import { Modal } from "../../components/CommonElement"

@connect((store) => {
  return {
    account: store.account,
    ethereum: store.connection.ethereum,
    translate: getTranslate(store.locale),
    analytics: store.global.analytics
  }
})
export default class ImportKeystore extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isOpen: false,
      error: "",
      keystring: ""
    }
  }

  closeModal = () => {
    this.setState({isOpen: false, error: ""})
  };

  toggleShowPw = () => {
    let input = document.getElementById('keystore-pass');
    if (input.classList.contains('security')) {
      input.classList.remove('security');
      input.parentElement.classList.add('unlock')
    } else if (input.type == 'text') {
      input.classList.add('security');
      input.parentElement.classList.remove('unlock')
    }
  };

  unLock = () => {
    var password = document.getElementById("keystore-pass").value;
    try {
      var privKey = unlock(this.state.keystring, password, true, this.props.translate);
      
      var address = addressFromKey(this.state.keystring);
      this.props.dispatch(
        importNewAccount(
          address,
          "keystore",
          privKey.toString("hex"),
          this.props.ethereum,
          null,
          null,
          "Keystore"
        )
      );
      
      this.closeModal();
      this.props.closeParentModal();
    } catch (e) {
      console.log(e);
      this.setState({error: e.toString()})
    }
  };
  
  submit = (e) => {
    if (e.key === 'Enter') {
      this.unLock(e)
    }
  };
  
  content = () => {
    return (
      <div className="import-modal import-modal__key-store">
        <div className="import-modal__header">
          <div className={"import-modal__header--title"}>
            {this.props.translate("modal.keystore_title") || "Type password to unlock your keystore"}
          </div>
        </div>
        <div className="x" onClick={this.closeModal}>&times;</div>
        <div className="import-modal__body">
          <div className="input-reveal">
            <input
              className="security theme__background-44 theme__text"
              id="keystore-pass"
              type="text"
              autoComplete="off"
              spellCheck="false"
              autoFocus onKeyPress={(e) => this.submit(e)}
            />
            <a className="toggle" onClick={() => this.toggleShowPw()}/>
          </div>
          {this.state.error && (
            <div className={'modal-error custom-scroll'}>
              {this.state.error}
            </div>
          )}
        </div>
        <div className="import-modal__footer theme__background-2">
          <button className={"import-modal__footer--button"} onClick={this.unLock}>
            {this.props.translate("modal.unlock") || "Unlock"}
          </button>
        </div>
      </div>
    )
  };
  
  lowerCaseKey = (keystring) => {
    return keystring.toLowerCase()
  };
  
  goToExchange = () => {
    this.props.dispatch(push('/exchange'));
  };
  
  onDrop = (files) => {
    this.props.analytics.callTrack("trackClickImportAccount", "keystore", this.props.tradeType);
    try {
      var file = files[0];
      var fileReader = new FileReader();
      fileReader.onload = (event) => {
        var keystring = this.lowerCaseKey(event.target.result);
        var errors = {};
        errors["keyError"] = verifyKey(keystring);
        if (anyErrors(errors)) {
          this.props.dispatch(throwError(this.props.translate("error.invalid_json_file") || "Your uploaded JSON file is invalid. Please upload a correct JSON keystore."))
        } else {
          this.setState({
            isOpen: true,
            keystring: keystring
          })
        }
      };
      fileReader.readAsText(file)
    } catch (e) {
      console.log(e)
    }
  };
  
  render() {
    return (
      <div>
        <DropFile
          id="import_json"
          error={this.props.account.error}
          onDrop={this.onDrop}
          translate={this.props.translate}
        />
        <Modal
          className={{
            base: 'reveal tiny import-modal',
            afterOpen: 'reveal tiny import-modal'
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
