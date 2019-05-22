import React from "react"
import { Modal } from "../../../components/CommonElement"

import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as exchangeActions from "../../../actions/exchangeActions"
import * as accountActions from "../../../actions/accountActions"
import constants from "../../../services/constants"

import { getWallet } from "../../../services/keys"

import { FeeDetail } from "../../../components/CommonElement"

import BLOCKCHAIN_INFO from "../../../../../env"


@connect((store, props) => {
  const account = store.account.account
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const exchange = store.exchange
  const ethereum = store.connection.ethereum

  return {
    translate, exchange, tokens, account, ethereum

  }
})

export default class ApproveZeroModal extends React.Component {

  constructor() {
    super()
    this.state = {
      err: "",
      isFetchGas: true,
      gasLimit: 0
    }
  }

  componentDidMount = () => {
    this.setState({
      isFetchGas: true,
      gasLimit: this.props.getMaxGasApprove(),
    })

    this.getGasApprove()
  }

  async getGasApprove() {
    // estimate gas approve
    try {
      var ethereum = this.props.ethereum
      var dataApprove = await ethereum.call("approveTokenData", this.props.exchange.sourceToken, 0, BLOCKCHAIN_INFO.network)
      var txObjApprove = {
        from: this.props.account.address,
        to: this.props.exchange.sourceToken,
        data: dataApprove,
        value: '0x0',
      }
      var gas_approve = await ethereum.call("estimateGas", txObjApprove)
      gas_approve = Math.round((gas_approve + 15000) * 120 / 100)
      this.setState({
        isFetchGas: false,
        gasLimit: gas_approve
      })
    } catch (err) {
      console.log(err)
      this.setState({
        isFetchGas: false
      })
    }

  }

  async onSubmit() {
    if (this.state.isConfirmingTx || this.state.isFetchGas) return
    this.setState({
      err: "",
      isConfirmingTx: true
    })

    //reset        
    var wallet = getWallet(this.props.account.type)
    var password = ""
    try {
      var txHash = await wallet.broadCastTx("getAppoveTokenZero", this.props.ethereum, this.props.exchange.sourceToken, 0, this.props.account.nonce, this.state.gasLimit,
        this.props.exchange.gasPrice, this.props.account.keystring, password, this.props.account.type, this.props.account.address, BLOCKCHAIN_INFO.network)

      //increase account nonce 
      this.props.dispatch(accountActions.incManualNonceAccount(this.props.account.address))

      //go to the next step
      this.props.dispatch(exchangeActions.forwardExchangePath())
    } catch (err) {
      console.log(err)
      this.setState({ err: err.toString(), isConfirmingTx: false })
    }
  }

  msgHtml = () => {
    if (this.state.isConfirmingTx && this.props.account.type !== 'privateKey') {
      return <span>{this.props.translate("modal.waiting_for_confirmation") || "Waiting for confirmation from your wallet"}</span>
    } else {
      return ""
    }
  }



  errorHtml = () => {
    if (this.state.err) {
      let metaMaskClass = this.props.account.type === 'metamask' ? 'metamask' : ''
      return (
        <React.Fragment>
          <div className={'modal-error custom-scroll ' + metaMaskClass}>
            {this.state.err}
          </div>
        </React.Fragment>
      )
    } else {
      return ""
    }
  }

  closeModal = () => {
    if (this.state.isConfirmingTx) return
    this.props.dispatch(exchangeActions.resetExchangePath())
  }

  contentModal = () => {
    return (
      <div className="approve-modal">
        <div className="title">Approve modal</div>
        <a className="x" onClick={this.closeModal}>&times;</a>
        <div className="content with-overlap">
          <div className="row">
            <div>
              <div>
                <div className="message">
                  {`You need reset allowance ${this.props.exchange.sourceTokenSymbol} of Kyber Swap with this address`}
                </div>
                <div class="info tx-title">
                  <div className="address-info">
                    <div>{this.props.translate("modal.address") || "Address"}</div>
                    <div>{this.props.account.address}</div>
                  </div>
                </div>
                <FeeDetail
                  translate={this.props.translate}
                  gasPrice={this.props.exchange.gasPrice}
                  gas={this.state.gasLimit}
                  isFetchingGas={this.state.isFetchGas}
                />
              </div>
              {this.errorHtml()}


            </div>

          </div>
        </div>
        <div className="overlap">
          <div>{this.msgHtml()}</div>
          <div className="input-confirm grid-x input-confirm--approve">            
            <div className="cell medium-4 small-12">
              <a className={"button process-submit " + (this.state.isFetchGas || this.state.isConfirmingTx ? "disabled-button" : "next")}
                onClick={this.onSubmit.bind(this)}
              >{this.props.translate("modal.approve").toLocaleUpperCase() || "Approve".toLocaleUpperCase()}</a>

            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <Modal className={{
        base: 'reveal medium confirm-modal',
        afterOpen: 'reveal medium confirm-modal'
      }}
        isOpen={true}
        onRequestClose={this.closeModal}
        contentLabel="approve modal"
        content={this.contentModal()}
        size="medium"
      />
    )


  }
}
