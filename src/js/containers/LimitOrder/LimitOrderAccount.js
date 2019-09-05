import React from "react";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import { ImportAccount } from "../ImportAccount";
import { TopBalance, AccountBalance } from "../TransactionCommon";
import { Modal } from "../../components/CommonElement"
import * as limitOrderActions from "../../actions/limitOrderActions";
import * as globalActions from "../../actions/globalActions";
import BLOCKCHAIN_INFO from "../../../../env";
import { isUserLogin } from "../../utils/common";
import * as converters from "../../utils/converter";
import * as constants from "../../services/constants"

@connect((store, props) => {
  const account = store.account.account;
  const translate = getTranslate(store.locale);
  const tokens = store.tokens.tokens;
  const limitOrder = store.limitOrder;
  const ethereum = store.connection.ethereum;
  const global = store.global;
  const { walletName } = store.account;

  return {
    translate,
    limitOrder,
    tokens,
    account,
    ethereum,
    global,
    walletName
  };
})
export default class LimitOrderAccount extends React.Component {
  constructor() {
    super();
    this.state = {
      isAdvanceTokenVisible: true,
      isReimport: false
    }
  }

  selectTokenBalance = () => {
    this.props.dispatch(limitOrderActions.setIsSelectTokenBalance(true));
  };

  getMaxGasApprove = () => {
    var tokens = this.props.tokens
    var sourceSymbol = this.props.limitOrder.sourceTokenSymbol
    if (tokens[sourceSymbol] && tokens[sourceSymbol].gasApprove) {
      return tokens[sourceSymbol].gasApprove
    } else {
      return this.props.limitOrder.max_gas_approve
    }
  }

  getMaxGasExchange = () => {
    const tokens = this.props.tokens
    var destTokenSymbol = BLOCKCHAIN_INFO.wrapETHToken
    var destTokenLimit = tokens[destTokenSymbol] && tokens[destTokenSymbol].gasLimit ? tokens[destTokenSymbol].gasLimit : this.props.limitOrder.max_gas

    return destTokenLimit;

  }

  calcualteMaxFee = () => {
    var gasApprove = this.getMaxGasApprove()
    var gasExchange = this.getMaxGasExchange()
    var totalGas = gasExchange + gasApprove * 2

    var totalFee = converters.totalFee(this.props.limitOrder.gasPrice, totalGas)
    return totalFee
  }


  selectToken = (sourceSymbol) => {

    this.props.chooseToken(sourceSymbol, this.props.tokens[sourceSymbol].address, "source")

    // var sourceBalance = this.props.tokens[sourceSymbol].balance

    const tokens = this.getFilteredTokens();
    const srcToken = tokens.find(token => {
      return token.symbol === sourceSymbol;
    });
    const destToken = tokens.find(token => {
      return token.symbol === this.props.limitOrder.destTokenSymbol;
    });
    var sourceBalance = srcToken.balance;

    var sourceDecimal = this.props.tokens[sourceSymbol].decimals

    if (sourceSymbol === BLOCKCHAIN_INFO.wrapETHToken) {

      //if souce token is weth, we spend a small amount to make approve tx, swap tx

      var ethBalance = this.props.tokens["ETH"].balance
      var fee = this.calcualteMaxFee()      
      if (converters.compareTwoNumber(ethBalance, fee) === 1) {
        sourceBalance = converters.subOfTwoNumber(sourceBalance, fee)
      } else {
        sourceBalance = converters.subOfTwoNumber(sourceBalance, ethBalance)
      }

    }

    if (converters.compareTwoNumber(sourceBalance, 0) == -1) sourceBalance = 0  

    this.props.dispatch(limitOrderActions.inputChange('source', converters.toT(sourceBalance, sourceDecimal), sourceDecimal, destToken.decimals))
    this.props.dispatch(limitOrderActions.focusInput('source'));

    this.selectTokenBalance();
    this.props.global.analytics.callTrack("trackClickToken", sourceSymbol, "limit_order");
  }

  toggleAdvanceTokeBalance = () => {
    this.setState({
      isAdvanceTokenVisible: !this.state.isAdvanceTokenVisible
    });
  }

  openReImport = () => {
    this.setState({ isReImport: true });
  }

  closeReImport = () => {
    this.setState({ isReImport: false });
  }

  clearSession = () => {
    this.closeReImport();
    this.props.dispatch(globalActions.clearSession(this.props.limitOrder.gasPrice));
    this.props.dispatch(limitOrderActions.getPendingBalancesComplete({}, []));
    this.props.dispatch(limitOrderActions.fetchFeeComplete(constants.LIMIT_ORDER_CONFIG.maxFee, constants.LIMIT_ORDER_CONFIG.maxFee, 0))
    this.props.global.analytics.callTrack("trackClickChangeWallet");
    // this.props.dispatch(globalActions.setGasPrice(this.props.ethereum))
  }

  reImportModal = () => {
    return (
      <div className="reimport-modal">
        <a className="x" onClick={this.closeReImport}>&times;</a>
        <div className="title">{this.props.translate("import.do_you_want_to_connect_other_wallet") || "Do you want to connect other Wallet?"}</div>
        <div className="content">
          <a className="button confirm-btn" onClick={this.clearSession}>{this.props.translate("import.yes") || "Yes"}</a>
          <a className="button cancel-btn" onClick={this.closeReImport}>{this.props.translate("import.no") || "No"}</a>
        </div>
      </div>
    )
  }

  getFilteredTokens = (orderByDesc = true, itemNumber = false) => {
    
    let filteredTokens = [];
    var tokens = this.props.modifiedTokenList()
  
    if (orderByDesc) {
      filteredTokens = converters.mergeSort(tokens, 1)
    } else {
      filteredTokens = converters.mergeSort(tokens, -1)
    }

    filteredTokens = itemNumber ? filteredTokens.slice(0, itemNumber) : filteredTokens;

    return filteredTokens;
  }

  render() {
    if (this.props.account === false) {
      return (
        <div className={"limit-order-account"}>
          <ImportAccount
            tradeType="limit_order"
            isAgreedTermOfService={this.props.global.termOfServiceAccepted}
            isAcceptConnectWallet={this.props.global.isAcceptConnectWallet}
          />
        </div>
      );
    } else {
      return (
        <div className={"limit-order-account"} style={{marginTop: "-25px"}}>
      {/*
          <div className="limit-order-account__title">
            <div>
              {this.props.translate("limit_order.your_available_balance") || "Tokens available for Limit Order"}
            </div>
            <div className="reimport-msg">
              <div onClick={this.openReImport}>
                {this.props.translate("import.connect_other_wallet") || "Connect other wallet"}
              </div>
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

          <TopBalance
            // isLimitOrderTab={true}
            // getFilteredTokens={this.getFilteredTokens}
            showMore={this.toggleAdvanceTokeBalance}
            // chooseToken={this.props.chooseToken}
            activeSymbol={this.props.limitOrder.sourceTokenSymbol}
            screen="limit_order"
            // selectTokenBalance={this.selectTokenBalance}
            // changeAmount={limitOrderActions.inputChange}
            // changeFocus={limitOrderActions.focusInput}
            selectToken={this.selectToken}
            orderedTokens={this.getFilteredTokens(true, 3)}
          />
      */}
          <p onClick={e => this.toggleAdvanceTokeBalance()} className={"right-slide-panel theme__silde-menu " + (this.state.isAdvanceTokenVisible ? "hide" : "")}>Wallet</p>
          
          {(this.state.isAdvanceTokenVisible) && <div className="limit-order-account__advance theme__background-7">
            <div className="advance-close" onClick={e => this.toggleAdvanceTokeBalance()}>
              <div className="advance-close_wrapper"></div>
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
            <AccountBalance
              isLimitOrderTab={true}
              getFilteredTokens={this.getFilteredTokens}
              // chooseToken={this.props.chooseToken}
              sourceActive={this.props.limitOrder.sourceTokenSymbol}
              isBalanceActive={this.state.isAdvanceTokenVisible}
              isOnDAPP={this.props.account.isOnDAPP}
              walletName={this.props.walletName}
              screen="limit_order"
              // selectTokenBalance={this.selectTokenBalance}
              // changeAmount={limitOrderActions.inputChange}
              // changeFocus={limitOrderActions.focusInput}
              selectToken={this.selectToken}
              openReImport={this.openReImport}
            />
          </div>}
        </div>
      );
    }
  }
}
