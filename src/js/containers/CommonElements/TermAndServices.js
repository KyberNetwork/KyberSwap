import React from "react"
import { Modal } from "../../components/CommonElement"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux';

@connect((store, props) => {
  return {
    translate: getTranslate(store.locale),
    onClick: props.onClick
  }
})

export default class TermAndServices extends React.Component {

  // changeCheckbox = (e) => {
  //   this.props.clickCheckbox()
  // }

  content = () => {
    return (<div>
      <div class="title text-center">{this.props.translate("terms.title") || "KyberWallet - Terms of Use"}</div>
      <a class="x" onClick={this.onRequestClose}>&times;</a>
      <div class="content">
        <div class="row">
          <div class="column">
            <center>
              <div>{this.contentBody()}</div>
            </center>
          </div>
        </div>
      </div>
    </div>)
  }
  contentBody = () => {
    return (
      <div class="term-page">
        <div class="term-content">
          <div class="body">
            <p>
              {this.props.translate("terms.content") || `Kyber testnet wallet provides a platform for experimenting and understanding
            our exchange and payment services. The current implementation is not
            secure in any way. Using it may cause loss of funds and could compromise
            user privacy. The user bears the sole responsibility for any outcome that
            is using Kyber testnet wallet.`}
            </p>
            <div class="gap">
            </div>
            <h3 class="warning">
              {this.props.translate("terms.use_testnet") || "USE ONLY TESTNET ACCOUNTS!!!"}
            </h3>
            <h3 class="warning">
              {this.props.translate("terms.use_real") || "DO NOT USE REAL ETHEREUM ACCOUNTS!!!"}
            </h3>
          </div>
        </div>
      </div>
    )
  }

  render() {
    var src = this.props.termAgree ? require("../../../assets/img/checkmark-selected.png")
      : require("../../../assets/img/checkmark-unselected.png")
    return (
      <div className="term-services">
        {/* <img className="pr-2 cur-pointer" onClick={(e) => this.changeCheckbox(e)} src={src} width="14" /> */}
        <span className="term-text">
          <span className="cur-pointer"> 
            {this.props.translate("terms.accept") || "Accept"}
          </span> 
              <a href="https://files.kyber.network/tac.html" target="_blank">
              {this.props.translate("terms.terms_and_condition") || " Terms and Conditions "}  
                </a> 
          </span>

          <div className="landing-page__content-btn-container">
            <button className="landing-page__content-btn button" onClick={this.props.onClick}>{this.props.translate("terms.accept") || "Accept"}</button>
          </div>
      </div>
    )
  }
}
