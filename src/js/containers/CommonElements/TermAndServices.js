import React from "react"
import { Modal } from "../../components/CommonElement"
import { connect } from "react-redux"

@connect((store, props) => {
  return {
    clickCheckbox: props.clickCheckbox,
    termAgree: props.termAgree
  }
})

export default class TermAndServices extends React.Component {

  constructor() {
    super()
    this.state = {
      isCheck: false
    }
  }

  showTerms = () => {
    this.setState({ isCheck: true })
  }

  onRequestClose = () => {
    this.setState({ isCheck: false })
  }

  changeCheckbox = (e) => {
    var value = e.target.checked
    this.props.clickCheckbox(value)
  }

  content = () => {
    return (<div>
      <div class="title text-center">KyberWallet - Terms of Use</div>
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
              Kyber testnet wallet provides a platform for experimenting and understanding
            our exchange and payment services. The current implementation is not
            secure in any way. Using it may cause loss of funds and could compromise
            user privacy. The user bears the sole responsibility for any outcome that
            is using Kyber testnet wallet.
          </p>
            <div class="gap">
            </div>
            <h3 class="warning">
              USE ONLY TESTNET ACCOUNTS!!!
          </h3>
            <h3 class="warning">
              DO NOT USE REAL ETHEREUM ACCOUNTS!!!
          </h3>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <div className="term-services">
          <input type="checkbox" onChange={(e) => this.changeCheckbox(e)} checked={this.props.termAgree} />
          <span onClick={this.showTerms}>
            <a>Terms and <br></br> Conditions</a>
          </span>
        </div>

        <Modal className={{
          base: 'reveal tiny',
          afterOpen: 'reveal tiny'
        }}
          isOpen={this.state.isCheck}
          onRequestClose={this.onRequestClose}
          contentLabel="Terms and Services"
          content={this.content()}
          size="tiny"
        />
      </div>
    )
  }
}
