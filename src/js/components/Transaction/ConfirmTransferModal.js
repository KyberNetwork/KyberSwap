import React from "react"
import { gweiToEth, stringToBigNumber, calculateGasFee, roundingNumber } from "../../utils/converter";
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
    } else {
      return <span>{this.props.translate("modal.press_confirm_if_really_want") || "Press Confirm to continue"}</span>
    }
  }

  render() {
    var gasPrice = stringToBigNumber(gweiToEth(this.props.gasPrice))
    var totalGas = +calculateGasFee(this.props.gasPrice, this.props.gas)
    //var totalGas = gasPrice.multipliedBy(this.props.gas)
    return (
      <div>
        <a className="x" onClick={(e) => this.props.onCancel(e)}>&times;</a>
        <div className="content with-overlap">
          <div className="row">
            <div>
              <div>
                <div className="title">{this.props.title}</div>
                {this.props.recap}
                <div className="gas-configed">
                <div>{this.props.translate("transaction.included") || 'Included'}</div>
                <div className="row">
                  <span className="column small-6">{this.props.translate("transaction.gas_price") || 'Gas price'}</span>
                  <span className="column small-6">{+roundingNumber(this.props.gasPrice)} Gwei</span>
                </div>
                <div className="row">
                  <span className="column small-6">{this.props.translate("transaction.transaction_fee") || "Transaction Fee"}</span>
                  <span className="column small-6">
                    {this.props.isFetchingGas ?
                    <img src={require('../../../assets/img/waiting-white.svg')} />
                    : <span>{totalGas.toString()}</span>
                    } ETH
                  </span>
                </div>
                </div>
                {!this.props.isFetchingRate &&
                  <div className="des">
                    <div><img src={require('../../../assets/img/exchange/exclaimed.svg')}/></div>
                    <div className="description">
                      <span>{this.props.translate("transaction.max_slippage", {  percent: this.props.slippagePercent }) || "With maximum " + this.props.slippagePercent + "% slippage"}</span>
                      <span> {this.props.translate("transaction.slippage_tip") || "Rate may change. You can change maximum slippage rate by adjusting min rate in advanced option"}</span>
                    </div>
                  </div>
                }
              </div>
              {this.errorHtml()}
            </div>
          </div>
        </div>
        <div className="overlap">
        <div className="input-confirm grid-x">
          <div className="cell medium-8 small-12">{this.msgHtml()}</div>
          <div className="cell medium-4 small-12">
            <a className={"button process-submit " + (this.props.isConfirming || this.props.isFetchingGas || this.props.isFetchingRate ? "waiting" : "next")} onClick={(e) => this.props.onExchange(e)}>{this.props.translate("modal.confirm").toLocaleUpperCase() || "Confirm".toLocaleUpperCase()}</a>
          </div>
        </div>
        </div>
      </div>
    )
  }
}

export default ConfirmTransferModal
