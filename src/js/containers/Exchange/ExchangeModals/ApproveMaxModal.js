import React from "react"
import { Modal } from "../../../components/CommonElement"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as exchangeActions from "../../../actions/exchangeActions"
import * as accountActions from "../../../actions/accountActions"
import * as converter from "../../../utils/converter"
import {FeeDetail} from "../../../components/CommonElement"
import BLOCKCHAIN_INFO from "../../../../../env"

@connect((store) => {
  const account = store.account.account
  const wallet = store.account.wallet
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const exchange = store.exchange
  const ethereum = store.connection.ethereum
  
  return {
    translate, exchange, tokens, account, ethereum, wallet
  }
})
export default class ApproveMaxModal extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      err: "",
      isFetchGas: true,
      gasLimit: 0,
      isConfirming: false
    }
  }
  
  componentDidMount = () =>{
    this.setState({
      isFetchGas: true,
      gasLimit: this.props.getMaxGasApprove(),
    })
    
    this.getGasApprove()
  }
  
  async getGasApprove(){
    try{
      var ethereum = this.props.ethereum
      var dataApprove = await ethereum.call("approveTokenData", this.props.exchange.sourceToken, converter.biggestNumber(), BLOCKCHAIN_INFO.network)
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
    }catch(err){
      console.log(err)
      this.setState({
        isFetchGas: false
      })
    }
  }
  
  async onSubmit() {
    if (this.state.isConfirming || this.state.isFetchGas) return
    this.setState({
      err: "",
      isConfirming: true
    })
    
    const wallet = this.props.wallet;
    var password = ""
    
    try {
      var nonce = this.props.account.getUsableNonce()
      var txHash = await wallet.broadCastTx("getAppoveToken", this.props.ethereum, this.props.exchange.sourceToken, 0, nonce, this.state.gasLimit,
        converter.toHex(converter.gweiToWei(this.props.exchange.gasPrice)), this.props.account.keystring, password, this.props.account.type, this.props.account.address, BLOCKCHAIN_INFO.network)
      
      this.props.dispatch(exchangeActions.saveApproveMaxTx(this.props.exchange.sourceTokenSymbol, txHash));
      this.props.dispatch(accountActions.incManualNonceAccount(this.props.account.address))
      this.props.dispatch(exchangeActions.forwardExchangePath())
    } catch (err) {
      console.log(err)
      this.setState({ err: err.toString(), isConfirming: false })
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
      return (
        <React.Fragment>
          <div className={'modal-error message-error common__slide-up'}>
            {this.state.err}
          </div>
        </React.Fragment>
      )
    }
    
    return ""
  }
  
  closeModal = () => {
    if (this.state.isConfirming) return
    this.props.dispatch(exchangeActions.resetExchangePath())
  }
  
  contentModal = () => {
    return (
      <div className="approve-modal content-wrapper">
        <div>
          <div className="title">Approve Token</div>
          <div className="x" onClick={this.closeModal}>&times;</div>
          <div className="content with-overlap">
            <div className="row">
              <div>
                <div>
                  <div className="message">
                    {`You need approve KyberSwap to use token ${this.props.exchange.sourceTokenSymbol}`}
                  </div>
                  <div class="info tx-title theme__background-222">
                    <div className="address-info">
                      <div>{this.props.translate("modal.address") || "Address"}</div>
                      <div className={"theme__text-7"}>{this.props.account.address}</div>
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
        </div>
        <div className="overlap theme__background-2">
          <div className="input-confirm grid-x input-confirm--approve">
            <div>{this.msgHtml()}</div>
            <div>
              <div className={"button process-submit " + (this.state.isFetchGas || this.state.isConfirming ? "disabled-button" : "next")} onClick={this.onSubmit.bind(this)}>
                {this.props.translate("modal.approve").toLocaleUpperCase() || "Approve".toLocaleUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  render() {
    return (
      <Modal
        className={{
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
