import React from "react"
import { Modal } from "../../components/CommonElement"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux';

@connect((store, props) => {
  return {
    clickCheckbox: props.clickCheckbox,
    termAgree: props.termAgree,
    translate: getTranslate(store.locale)
  }
})

export default class TermAndServices extends React.Component {

  constructor() {
    super()
    this.state = {
      isOpen: false,
    }
  }

  showTerms = () => {
    this.setState({ isOpen: true })
  }

  onRequestClose = () => {
    this.setState({ isOpen: false })
  }

  changeCheckbox = (e) => {
    this.props.clickCheckbox(!this.props.termAgree)
  }

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
    var checkBox = this.props.termAgree ? <img src={require("../../../assets/img/checkmark-selected.svg")} />
      : <img src={require("../../../assets/img/checkmark-unselected.svg")} />
    return (
      <div>
        <div className="term-services">
          {/* <input type="checkbox" onChange={(e) => this.changeCheckbox(e)} checked={this.props.termAgree} /> */}
          <span onClick={(e) => this.changeCheckbox(e)}>
            {checkBox}
          </span>
          <span onClick={this.showTerms}>
            <a className="term-text">
              {this.props.translate("transaction.terms_and_conditions") || <span>Terms and <br className="show-for-small-only"></br> Conditions </span>}
            </a>
          </span>

          {/* <span  onClick={this.showTerms} className="view-term">
            <a>VIEW</a>
          </span> */}
        </div>

        <Modal className={{
          base: 'reveal medium',
          afterOpen: 'reveal medium'
        }}
          isOpen={this.state.isOpen}
          onRequestClose={this.onRequestClose}
          contentLabel="Terms and Services"
          content={this.content()}
        />
      </div>
    )
  }
}
