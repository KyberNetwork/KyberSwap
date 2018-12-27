import React from "react"
import { gweiToEth, stringToBigNumber, calculateGasFee, roundingNumber } from "../../utils/converter";
import { FeeDetail } from "../CommonElement";

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
        </React.Fragment>
      )
    }
  }

  msgHtml = () => {
    if (this.props.isApproving) {
      let isPKeyAcc = this.props.walletType === 'privateKey'
      return isPKeyAcc ? '' : <span>{this.props.translate("modal.waiting_for_confirmation") || "Waiting for confirmation from your wallet"}</span>
    } else {
      return <span>{this.props.translate("modal.press_approve") || "Press approve to continue"}</span>
    }
  }

  render(){
    var gasPrice = stringToBigNumber(gweiToEth(this.props.gasPrice))
    var totalGas = +calculateGasFee(this.props.gasPrice, this.props.gas)
    //var totalGas = gasPrice.multipliedBy(this.props.gas)
    //var haveError = this.props.errors ? true : false
    return (
      <div className="approve-modal">
        <div className="title">{this.props.title}</div>
        <a className="x" onClick={(e) => this.props.onCancel(e)}>&times;</a>
        <div className="content with-overlap">
          <div className="row">
            <div>
              <div>
                <div className="message">                 
                    {this.props.message}
                </div>
                <div class="info tx-title">
                  <div className="address-info">
                    <div>{this.props.translate("modal.address") || "Address"}</div>
                    <div>{this.props.address}</div>
                  </div>
                </div>
                <FeeDetail 
                  translate={this.props.translate} 
                  gasPrice={this.props.gasPrice} 
                  gas={this.props.gas}
                  isFetchingGas={this.props.isFetchingGas}
                  totalGas={totalGas}
                />
              </div>
              {this.errorHtml()}

            </div>

          </div>
        </div>
        <div className="overlap">
          <div className="input-confirm grid-x">
            <div className="cell medium-8 small-12">{this.msgHtml()}</div>
              <div className="cell medium-4 small-12">
                <a className={"button process-submit " + (this.props.isApproving || this.props.isFetchingGas ? "waiting" : "next")}
                onClick={this.props.onSubmit}
              >{this.props.translate("modal.approve").toLocaleUpperCase() || "Approve".toLocaleUpperCase()}</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ApproveModal
