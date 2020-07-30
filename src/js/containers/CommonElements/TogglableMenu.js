import React from 'react'
import { connect } from "react-redux";
import { Modal } from "../../components/CommonElement"
import { getTranslate } from "react-localize-redux";
import { formatAddress, multiplyOfTwoNumber, roundingNumber } from "../../utils/converter";

@connect((store) => {
  const translate = getTranslate(store.locale);
  const account = store.account;
  const address = account.account.address;
  const rateETHInUSD = store.tokens.tokens.ETH.rateUSD;
  let totalBalanceInETH = account.totalBalanceInETH;
  const totalBalanceInUSD = totalBalanceInETH ? roundingNumber(multiplyOfTwoNumber(totalBalanceInETH, rateETHInUSD)): 0;
  totalBalanceInETH = roundingNumber(totalBalanceInETH);

  return {
    translate, global: store.global,
    address, totalBalanceInETH, totalBalanceInUSD
  };
})
export default class ToggleableMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAdvanceTokenVisible: false,
      isReimport: false
    }

    if (window.kyberBus) {
      window.kyberBus.on('wallet.view', () => {this.setState({isAdvanceTokenVisible: true})});
      window.kyberBus.on('wallet.change', () => {this.setState({isAdvanceTokenVisible: true, isReImport: true})});
    }
  }

  toggleAdvanceTokeBalance = () => {
    this.setState({
      isAdvanceTokenVisible: !this.state.isAdvanceTokenVisible
    });
    this.props.global.analytics.callTrack("trackClickShowWalletBalance", this.state.isAdvanceTokenVisible);
  }

  openReImport = () => {
    this.setState({ isReImport: true });
  }

  closeReImport = () => {
    this.setState({ isReImport: false });
  }

  clearSession = () => {
    this.closeReImport();
    this.props.clearSession();
  }

  reImportModal = () => {
    return (
      <div className="reimport-modal p-a-20px">
        <div className="x" onClick={this.closeReImport}>&times;</div>
        <div className="title">{this.props.translate("import.do_you_want_to_connect_other_wallet") || "Do you want to connect other Wallet?"}</div>
        <div className="content">
          <div className="button confirm-btn" onClick={this.clearSession}>{this.props.translate("import.yes") || "Yes"}</div>
          <div className="button cancel-btn" onClick={this.closeReImport}>{this.props.translate("import.no") || "No"}</div>
        </div>
      </div>
    )
  }
  
  render() {
    return (
        <div className={"limit-order-account"}>
          <div
            onClick={this.toggleAdvanceTokeBalance}
            className={"right-slide-panel" + (this.state.isAdvanceTokenVisible || this.props.global.isOnMobile ? "hide" : "")}
          >
            <div className="right-slide-panel__title theme__background theme__text">More</div>
            <div className="right-slide-panel__container theme__background-5">
              <div className="right-slide-panel__address">{formatAddress(this.props.address, 5, -3)}</div>
              <div className="right-slide-panel__balance">{this.props.totalBalanceInETH} ETH</div>
            </div>
          </div>
          {(this.state.isAdvanceTokenVisible) && <div className="limit-order-account__advance theme__background-7">
            <div className="limit-order-account__advance--bg" onClick={() => this.setState({isAdvanceTokenVisible: false})}> </div>
            <div className="advance-close" onClick={e => this.toggleAdvanceTokeBalance()}>
              <div className="advance-close_wrapper"/>
            </div>
            <div className="limit-order-account__title">
              <div className="reimport-msg">
                <Modal className={{
                  base: 'reveal tiny reimport-modal',
                  afterOpen: 'reveal tiny reimport-modal reimport-modal--tiny'
                }}
                  isOpen={this.state.isReImport}
                  onRequestClose={this.closeReImport}
                  contentLabel="advance modal"
                  content={this.reImportModal()}
                  size="tiny"
                />
              </div>
            </div>
            {React.cloneElement(this.props.children, { openReImport: this.openReImport })}
          </div>}
        </div>
      );
  }
}