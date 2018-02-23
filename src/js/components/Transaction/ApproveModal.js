import React from "react"
import { gweiToEth, stringToBigNumber } from "../../utils/converter";

class ApproveModal extends React.Component {
  
  constructor() {
    super()
    this.state = {
      isFullError: false
    }
  }

  toggleFullErr = () => {
    this.setState({
      isFullError: !this.state.isFullError
    })
  }

  errorHtml = () => {
    if (this.props.errors) {
      let isMetaMaskAcc = this.props.walletType === 'metamask'
      let metaMaskClass = isMetaMaskAcc ? 'metamask' : ''
      return (
        <React.Fragment>
          <div className={'modal-error ' + metaMaskClass + (this.state.isFullError ? ' full' : '')}>
            {this.props.errors}
          </div>
          {isMetaMaskAcc ? 
            <div onClick={this.toggleFullErr} className="show-full">
              {this.state.isFullError ? 'Hide »' : 'Read full error »'}
            </div>
            : ''
          }
        </React.Fragment>
      )
    }
  }

  render(){
    var gasPrice = stringToBigNumber(gweiToEth(this.props.gasPrice))
    var totalGas = gasPrice.mul(this.props.gas)
    var haveError = this.props.errors ? true : false
    return (
      <div>
        <div className="title text-center">{this.props.translate("modal.eth_token_exchange") || "ETH token exchange"}</div>
        <a className="x" onClick={(e) => this.props.onCancel(e)}>&times;</a>
        <div className="content with-overlap">
          <div className="row">
            <div className="column">
              <center>
                <p className="message">
                  {this.props.translate('modal.approve_exchange', { token: this.props.token, address: this.props.address }) ||
                    <span>You need to grant permission for Kyber Wallet to interact with  {this.props.token} on address {this.props.address}.</span>}
                </p>

                <div className="gas-configed text-light text-center">
                  <div className="row">
                    <p className="column small-6">{this.props.translate("transaction.gas_price") || 'Gas price'}</p>
                    <p className="column small-6">{this.props.gasPrice} Gwei</p>
                  </div>
                  <div className="row">
                    <p className="column small-6">{this.props.translate("transaction.transaction_fee") || "Transaction Fee"}</p>
                    <p className="column small-6">{this.props.isFetchingGas ?
                      <img src={require('../../../assets/img/waiting-white.svg')} />
                      : <span>{totalGas.toString()}</span>
                    } ETH</p>
                  </div>
                  <hr className={haveError ? 'd-none' : 'mt-0'}/>
                </div>
                {haveError ?
                  '' :
                  this.props.isConfirming ? (
                    <p>{this.props.translate("modal.waiting_for_confirmation") || "Waiting for confirmation from your wallet"}</p>
                  ) : (
                    <p>{this.props.translate("modal.press_approve") || "Press approve to continue"}</p>
                  )
                }
              </center>
              {this.errorHtml()}

            </div>

          </div>
        </div>
        <div className="overlap">
          <a className={"button accent submit-approve " + (this.props.isApproving || this.props.isFetchingGas ? "waiting" : "next")}
            onClick={(e) => this.props.onSubmit(e)}
          >{this.props.translate("modal.approve") || "Approve"}</a>
        </div>
      </div>
    )
  }
}

export default ApproveModal
