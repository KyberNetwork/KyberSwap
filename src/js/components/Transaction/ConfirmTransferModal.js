import React from "react"
import { gweiToEth, stringToBigNumber } from "../../utils/converter";

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

  msgHtml = () => {
    if (!this.props.errors) {
      if(this.props.isConfirming){
        let isPKeyAcc = this.props.walletType === 'privateKey'
        return isPKeyAcc ? '' : <p>{this.props.translate("modal.waiting_for_confirmation") || "Waiting for confirmation from your wallet"}</p>
      }else{
        return <p>{this.props.translate("modal.press_confirm_if_really_want") || "Press confirm to continue"}</p>
      }
    }
  }

  render() {
    var gasPrice = stringToBigNumber(gweiToEth(this.props.gasPrice))
    var totalGas = gasPrice.mul(this.props.gas)
    return (
      <div>
        <div className="title text-center">{this.props.title}</div>
        <a className="x" onClick={(e) => this.props.onCancel(e)}>&times;</a>
        <div className="content with-overlap">
          <div className="row">
            <div className="column">
              <center>
                {this.props.recap}
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
                  <hr className={this.props.errors ? 'd-none' : 'mt-0'} />
                </div>
                {this.msgHtml()}
              </center>
              {this.errorHtml()}
            </div>
          </div>
        </div>
        <div className="overlap">
          <a className={"button accent process-submit " + (this.props.isConfirming || this.props.isFetchingGas || this.props.isFetchingRate ? "waiting" : "next")} onClick={(e) => this.props.onExchange(e)}>{this.props.translate("modal.confirm") || "Confirm"}</a>
        </div>
      </div>
    )
  }
}

export default ConfirmTransferModal
