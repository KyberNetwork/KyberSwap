import React from "react"
import { Modal } from "../../../components/CommonElement"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as limitOrderActions from "../../../actions/limitOrderActions"
import * as accountActions from "../../../actions/accountActions"
import constants from "../../../services/constants"
import { getWallet } from "../../../services/keys"
import { FeeDetail } from "../../../components/CommonElement"
import BLOCKCHAIN_INFO from "../../../../../env"
import * as converter from "../../../utils/converter"

@connect((store, props) => {
  const account = store.account.account
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const limitOrder = store.limitOrder
  const global = store.global

  return {
    translate, limitOrder, tokens, account, ethereum, global

  }
})

export default class ApproveZeroModal extends React.Component {

  constructor() {
    super()
    this.state = {
      err: "",
      isFetchGas: false,
      gasLimit: 0,
      isConfirming: false
    }
  }

  componentDidMount = () => {
    this.setState({
      isFetchFee: true,
      gasLimit: this.props.getMaxGasApprove(),
    })

    this.getGasApprove()
  }

  // getMaxGasApprove = () => {
  //   var tokens = this.props.tokens
  //   var sourceSymbol = this.props.limitOrder.sourceTokenSymbol
  //   if (tokens[sourceSymbol] && tokens[sourceSymbol].gasApprove) {
  //     return tokens[sourceSymbol].gasApprove
  //   } else {
  //     return this.props.limitOrder.max_gas_approve
  //   }
  // }

  async getGasApprove() {
    // estimate gas approve
    try {
      var ethereum = this.props.ethereum
      var dataApprove = await ethereum.call("approveTokenData", this.props.limitOrder.sourceToken, 0, BLOCKCHAIN_INFO.kyberswapAddress)
      var txObjApprove = {
        from: this.props.account.address,
        to: this.props.limitOrder.sourceToken,
        data: dataApprove,
        value: '0x0',
      }
      var gas_approve = await ethereum.call("estimateGas", txObjApprove)
      gas_approve = Math.round((gas_approve + 15000) * 120 / 100)
      this.setState({
        isFetchFee: false,
        gasLimit: gas_approve
      })
    } catch (err) {
      console.log(err)
      this.setState({
        isFetchFee: false
      })
    }

  }

  async onSubmit() {
    this.props.global.analytics.callTrack("trackLimitOrderClickApprove", "Zero", this.props.limitOrder.sourceTokenSymbol);

    if (this.state.isConfirming || this.state.isFetchGas) return
    this.setState({
      err: "",
      isConfirming: true
    })

    //reset        
    var wallet = getWallet(this.props.account.type)
    var password = ""
    try {
      var txHash = await wallet.broadCastTx("getAppoveTokenZero", this.props.ethereum, this.props.limitOrder.sourceToken, 0, this.props.account.nonce, this.state.gasLimit,
        converter.toHex(converter.gweiToWei(this.props.limitOrder.gasPrice)), this.props.account.keystring, password, this.props.account.type, this.props.account.address, BLOCKCHAIN_INFO.kyberswapAddress)

      this.props.dispatch(limitOrderActions.saveApproveZeroTx(this.props.limitOrder.sourceTokenSymbol, txHash));

      //increase account nonce 
      this.props.dispatch(accountActions.incManualNonceAccount(this.props.account.address))

      //go to the next step
      this.props.dispatch(limitOrderActions.forwardOrderPath())
    } catch (err) {
      console.log(err)
      this.setState({ err: err , isConfirming: false })
    }
  }

  msgHtml = () => {
    if (this.state.isConfirming && this.props.account.type !== 'privateKey') {
      return <span>{this.props.translate("modal.waiting_for_confirmation") || "Waiting for confirmation from your wallet"}</span>
    } else {
      return this.props.translate("modal.press_approve") || "Press approve to continue";
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
    if (this.state.isConfirming) return
    this.props.dispatch(limitOrderActions.resetOrderPath())
  }

  contentModal = () => {
    return (
      <div className="approve-modal">
        <div className="title">{this.props.translate("modal.approve_token") || "Approve Token"}</div>
        <a className="x" onClick={this.closeModal}>&times;</a>
        <div className="content with-overlap">
          <div className="row">
            <div>
              <div>
                <div className="message">
                  {this.props.translate("modal.approve_zero", { token: this.props.limitOrder.sourceTokenSymbol }) 
                  || `You need to reset allowance for ${this.props.limitOrder.sourceTokenSymbol} of Kyber Swap with this address`}
                </div>
                <div class="info tx-title">
                  <div className="address-info">
                    <div>{this.props.translate("modal.address") || "Address"}</div>
                    <div>{this.props.account.address}</div>
                  </div>
                </div>
                <FeeDetail
                  translate={this.props.translate}
                  gasPrice={this.props.limitOrder.gasPrice}
                  gas={this.state.gasLimit}
                  isFetchingGas={this.state.isFetchGas}
                />
              </div>
              {this.errorHtml()}

            </div>

          </div>
        </div>
        <div className="overlap">
          {/* <div>{this.msgHtml()}</div> */}
          <div className="input-confirm grid-x input-confirm--approve">
            <div className="cell medium-8 small-12">{this.msgHtml()}</div>
            <div className="cell medium-4 small-12">
              {/* <a className={"button process-submit " + (this.props.isApproving || this.props.isFetchingGas ? "disabled-button" : "next")}
                    onClick={this.props.onSubmit}
                  >{this.props.translate("modal.approve").toLocaleUpperCase() || "Approve".toLocaleUpperCase()}</a> */}
              <a className={`button process-submit next ${this.state.isConfirming ? "btn--disabled" : ""}`}
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
        contentLabel="approve token"
        content={this.contentModal()}
        size="medium"
      />
    )


  }
}
