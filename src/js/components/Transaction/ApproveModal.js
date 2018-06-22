import React from "react"
import { gweiToEth, stringToBigNumber, calculateGasFee, roundingNumber } from "../../utils/converter";
import BLOCKCHAIN_INFO from "../../../../env"
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
          <div className={'modal-error custom-scroll ' + metaMaskClass + (this.state.isFullError ? ' full' : '')}>
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

  msgHtml = () => {
    if (this.props.isApproving) {
      let isPKeyAcc = this.props.walletType === 'privateKey'
      return isPKeyAcc ? '' : <span>{this.props.translate("modal.waiting_for_confirmation") || "Waiting for confirmation from your wallet"}</span>
    } else {
      return <span>{this.props.translate("modal.press_confirm_if_really_want") || "Press confirm to continue"}</span>
    }
  }

  render(){
    var gasPrice = stringToBigNumber(gweiToEth(this.props.gasPrice))
    var totalGas = +calculateGasFee(this.props.gasPrice, this.props.gas)
    //var totalGas = gasPrice.multipliedBy(this.props.gas)
    //var haveError = this.props.errors ? true : false
    return (
      <div className="approve-modal">
        <div className="title">Approve token</div>
        <a className="x" onClick={(e) => this.props.onCancel(e)}>&times;</a>
        <div className="content with-overlap">
          <div className="row">
            <div>
              <div>
                <div className="message">                 
                    You need to grant permission for Kyber Wallet to interact with {this.props.token} with address
                </div>
                <div class="info tx-title">
                  <div className="row">
                    <div className="column small-3 tx-title-text">Address:</div>
                    <div className="column small-9 tx-hash">
                      {/* <a class="text-light" href={BLOCKCHAIN_INFO.ethScanUrl + 'address/' + this.props.address} target="_blank"
                        title={this.props.translate("modal.view_on_etherscan") || "View on Etherscan"} > */}
                        {this.props.address}
                      {/* </a> */}
                    </div>
                  </div>
                </div>
                {/* <div className="address">
                  <span>Address</span>
                  <span>{this.props.address}</span>
                </div> */}
                <div className="gas-configed">
                  <div><b>Included</b></div>
                  <div className="row">
                    <span className="column small-6 font-w-b">{this.props.translate("transaction.gas_price") || 'Gas price'}</span>
                    <span className="column small-6 font-w-i">{+roundingNumber(this.props.gasPrice)} Gwei</span>
                  </div>
                  <div className="row">
                    <span className="column small-6 font-w-b">{this.props.translate("transaction.transaction_fee") || "Transaction Fee"}</span>
                    <span className="column small-6 font-w-i">{this.props.isFetchingGas ?
                      <img src={require('../../../assets/img/waiting-white.svg')} />
                      : <span>{totalGas.toString()}</span>
                    } ETH</span>
                  </div>                 
                </div>
                {/* {haveError ?
                  '' :
                  this.props.isConfirming ? (
                    <p>{this.props.translate("modal.waiting_for_confirmation") || "Waiting for confirmation from your wallet"}</p>
                  ) : (
                    <p>{this.props.translate("modal.press_approve") || "Press approve to continue"}</p>
                  )
                } */}
              </div>
              {this.errorHtml()}

            </div>

          </div>
        </div>
        <div className="overlap">
          <div className="input-confirm row">
            <div className="columns small-8">{this.msgHtml()}</div>
              <div className="columns small-4">
                <a className={"button process-submit " + (this.props.isApproving || this.props.isFetchingGas ? "waiting" : "next")}
                onClick={(e) => this.props.onSubmit(e)}
              >{this.props.translate("modal.approve").toLocaleUpperCase() || "Approve".toLocaleUpperCase()}</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ApproveModal
