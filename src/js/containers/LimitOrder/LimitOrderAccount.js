import React from "react";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import { ImportAccount, ErrorModal } from "../ImportAccount";
import { ImportAccountView } from '../../components/ImportAccount'
import { TopBalance, AccountBalance } from "../TransactionCommon";
import { Modal } from "../../components/CommonElement"
import * as limitOrderActions from "../../actions/limitOrderActions";
import * as globalActions from "../../actions/globalActions";
import { isUserLogin } from "../../utils/common"
import * as converters from "../../utils/converter"

@connect((store, props) => {
  const account = store.account.account;
  const translate = getTranslate(store.locale);
  const tokens = store.tokens.tokens;
  const limitOrder = store.limitOrder;
  const ethereum = store.connection.ethereum;
  const global = store.global;

  return {
    translate,
    limitOrder,
    tokens,
    account,
    ethereum,
    global
  };
})
export default class LimitOrderAccount extends React.Component {
  constructor() {
    super();
    this.state = {
      isAdvanceTokenVisible: false,
      isReimport: false
    }
  }

  selectTokenBalance = () => {
    this.props.dispatch(limitOrderActions.setIsSelectTokenBalance(true));
  };
  
  toggleAdvanceTokeBalance = () => {
    this.setState({
      isAdvanceTokenVisible: !this.state.isAdvanceTokenVisible
    });
  }

  openReImport = () => {
    this.setState({ isReImport: true });
  }

  closeReImport = () => {
    this.setState({ isReImport: false, isAdvanceTokenVisible: false });
  }

  clearSession = () => {
    this.closeReImport();
    this.props.dispatch(globalActions.clearSession(this.props.limitOrder.gasPrice));
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
    let tokens = this.props.tokens;
    let filteredTokens = [];
    const orderList = this.props.limitOrder.listOrder;

    tokens = Object.keys(tokens).map(key => {
      let token = tokens[key];
      const openOrderTokens = orderList.filter(order => {
        return order.source === token.symbol && order.status === 'active';
      });

      if (openOrderTokens.length > 0) {
        let openOrderAmount = 0;

        openOrderTokens.forEach(order => {
          openOrderAmount += order.src_amount * (Math.pow(10, token.decimals));
        });

        token = Object.create(token);
        token.balance = +token.balance - openOrderAmount;
      }

      return token;
    });

    if (orderByDesc) {
      filteredTokens = converters.sortEthBalance(tokens);
    } else {
      filteredTokens = converters.sortASCEthBalance(tokens);
    }

    let eth = filteredTokens.find(token => {
      return token.symbol === 'ETH';
    });

    let weth = filteredTokens.find(token => {
      return token.symbol === 'WETH';
    });
    weth = Object.create(weth);

    filteredTokens = filteredTokens.filter(token => {
      return token.symbol !== 'ETH' && token.symbol !== 'WETH';
    });

    if ((eth && eth.balance > 0) && weth) {
      weth.substituteName = 'ETH*';
      weth.balance = +weth.balance + +eth.balance;
      filteredTokens.splice(0, 0, weth);
    }

    filteredTokens = itemNumber ? filteredTokens.slice(0, itemNumber) : filteredTokens;

    return filteredTokens;
  }

  render() {
    if (this.props.account === false) {
      return (
        <div className={"limit-order-account"}>
          <ImportAccountView  
            isAgreedTermOfService={this.props.global.termOfServiceAccepted}
            isAcceptConnectWallet={this.props.global.isAcceptConnectWallet}
            errorModal={<ErrorModal />}
            translate={this.props.translate}
            onMobile={this.props.global.onMobile}
            tradeType={"limit_order"}
            isUserLogin={isUserLogin()}
            />
        </div>
      );
    } else {
      return (
        <div className={"limit-order-account"}>
          <div className="limit-order-account__title">
            <div>
              {this.props.translate("limit_order.your_balance") || "Your Available Balance"}
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
            isLimitOrderTab={true}
            getFilteredTokens={this.getFilteredTokens}
            showMore={this.toggleAdvanceTokeBalance}
            chooseToken={this.props.chooseToken}
            activeSymbol={this.props.limitOrder.sourceTokenSymbol}
            screen="limit_order"
            selectTokenBalance={this.selectTokenBalance}
            changeAmount={limitOrderActions.inputChange}
            changeFocus={limitOrderActions.focusInput}
          />

          {this.state.isAdvanceTokenVisible && <div className="limit-order-account__advance">
            <div className="advance-close" onClick={e =>this.toggleAdvanceTokeBalance()}>
              <div className="advance-close_wrapper"></div>
            </div>
            <AccountBalance
              isLimitOrderTab={true}
              getFilteredTokens={this.getFilteredTokens}
              chooseToken={this.props.chooseToken}
              sourceActive={this.props.limitOrder.sourceTokenSymbol}
              isBalanceActive={this.state.isAdvanceTokenVisible}
              isOnDAPP={this.props.account.isOnDAPP}
              walletName={this.props.account.walletName}
              screen="limit_order"
              selectTokenBalance={this.selectTokenBalance}
              changeAmount={limitOrderActions.inputChange}
              changeFocus={limitOrderActions.focusInput}
            />
          </div>}
        </div>
      );
    }
  }
}
