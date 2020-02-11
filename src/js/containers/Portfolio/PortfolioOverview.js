import React from "react"
import { formatAddress, multiplyOfTwoNumber, roundingNumber } from "../../utils/converter";
import BLOCKCHAIN_INFO from "../../../../env";
import { Modal } from "../../components/CommonElement";

export default class PortfolioOverview extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      openReImport: false
    }
  }
  
  openReImportModal = () => {
    this.setState({openReImport: true})
  };
  
  closeReImportModal = () => {
    this.setState({openReImport: false})
  };
  
  render() {
    return (
      <div className="common__slide-up">
        <div className={"portfolio__account-top"}>
          <div className={"portfolio__account-top-item"}>
            <div className={"common__mb-10"}>
              <span className={"portfolio__account-txt"}>{this.props.translate('transaction.balance') || 'Balance'}</span>
              <span className={"portfolio__account-txt-small"}>{this.props.translate('portfolio.supported_tokens') || 'Supported tokens'}</span>
            </div>
            <div className={"portfolio__account-txt-big"}>
              {this.props.currency === 'ETH' ? roundingNumber(this.props.totalBalanceInETH) : roundingNumber(multiplyOfTwoNumber(this.props.totalBalanceInETH, this.props.rateETHInUSD))} {this.props.currency}
            </div>
          </div>
          <div className={"portfolio__account-top-item"}>
            <div className={"common__mb-10"}>
              {/*<span className={"portfolio__account-txt"}>24h% change</span>*/}
              <span className={"portfolio__account-tag theme__tag"} onClick={() => this.props.switchCurrency(this.props.currency)}>
              {this.props.currency === 'ETH' ? 'USD' : 'ETH'}
            </span>
            </div>
            <div>
              {/*<span className={"portfolio__account-txt-big"}>0 {this.props.currency}</span>*/}
              {/*<span className={"portfolio__account-change portfolio__account-change--negative"}>-20.87%</span>*/}
            </div>
          </div>
        </div>
        <div className={"portfolio__account-bot"}>
          <div className={"portfolio__account-wallet"}>
            <div className={"portfolio__account-type"}>{this.props.walletName}:</div>
            <a className={"portfolio__account-address theme__text-3"} target="_blank" href={BLOCKCHAIN_INFO.ethScanUrl + "address/" + this.props.address}>
              {formatAddress(this.props.address)}
            </a>
          </div>
          {!this.props.isOnDapp && (
            <span className={"portfolio__account-reimport"} onClick={this.openReImportModal}>
            {this.props.translate("change") || "Change"}
          </span>
          )}
        </div>
      
        <Modal
          className={{
            base: 'reveal tiny reimport-modal',
            afterOpen: 'reveal tiny reimport-modal reimport-modal--tiny'
          }}
          isOpen={this.state.openReImport}
          onRequestClose={this.closeReImportModal}
          contentLabel="advance modal"
          content={(
            <div className="reimport-modal p-a-20px">
              <a className="x" onClick={this.closeReImportModal}>&times;</a>
              <div className="title">{this.props.translate("import.do_you_want_to_connect_other_wallet") || "Do you want to connect other Wallet?"}</div>
              <div className="content">
                <a className="button confirm-btn" onClick={this.props.reImportWallet}>{this.props.translate("import.yes") || "Yes"}</a>
                <a className="button cancel-btn" onClick={this.closeReImportModal}>{this.props.translate("import.no") || "No"}</a>
              </div>
            </div>
          )}
          size="tiny"
        />
      </div>
    )
  }
};

