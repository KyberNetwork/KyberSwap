import React from "react"
import { gweiToEth, stringToBigNumber, roundingNumber } from "../../utils/converter";
import { FeeDetail } from "../CommonElement";

class ConfirmTransferModal extends React.Component {
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
    if (this.props.isConfirming) {
      let isPKeyAcc = this.props.walletType === 'privateKey'
      return isPKeyAcc ? '' : <span>{this.props.translate("modal.waiting_for_confirmation") || "Waiting for confirmation from your wallet"}</span>
    }
  }

  render() {
    var gasPrice = stringToBigNumber(gweiToEth(this.props.gasPrice))    
    return (
      <div>
        <a className="x" onClick={(e) => this.props.onCancel(e)}>&times;</a>
        <div className="content with-overlap">
          <div className="row">
            <div>
              <div>
                <div className="title">{this.props.title}</div>
                {this.props.recap}
                <FeeDetail 
                  translate={this.props.translate} 
                  gasPrice={this.props.gasPrice} 
                  gas={this.props.gas}
                  isFetchingGas={this.props.isFetchingGas}
                  
                />
              </div>
              {this.errorHtml()}
            </div>
          </div>
        </div>
        <div className="overlap">
          <div>{this.msgHtml()}</div>
          <div className="input-confirm grid-x">
            <a className={"button process-submit cancel-process"} onClick={(e) => this.props.onCancel(e)}>
              {this.props.translate("modal.cancel" || "Cancel")}
            </a>
            <a className={"button process-submit " + (this.props.isConfirming || this.props.isFetchingGas || this.props.isFetchingRate ? "disabled-button" : "next")} onClick={(e) => this.props.onExchange(e)}>{this.props.translate("modal.confirm").toLocaleUpperCase() || "Confirm".toLocaleUpperCase()}</a>
          </div>
        </div>
      </div>
    )
  }
}

export default ConfirmTransferModal
