import React from "react";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import { AccountBalance } from "../TransactionCommon";
import * as limitOrderActions from "../../actions/limitOrderActions";
import * as globalActions from "../../actions/globalActions";
import BLOCKCHAIN_INFO from "../../../../env";
import * as converters from "../../utils/converter";
import * as constants from "../../services/constants"
import ToggleableMenu from "../CommonElements/TogglableMenu.js"

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
  
  selectToken = (base) => {
    const tokens = this.getFilteredTokens();
    
    this.props.selectSourceToken(base);
    
    const srcToken = tokens.find(token => {
      return token.symbol === base;
    });
    const destToken = tokens.find(token => {
      return token.symbol === this.props.limitOrder.destTokenSymbol;
    });
    
    var sourceBalance = srcToken.balance;
    var sourceDecimal = this.props.tokens[base].decimals;
    
    this.props.dispatch(limitOrderActions.inputChange('source', converters.toT(sourceBalance, sourceDecimal), sourceDecimal, destToken.decimals))
    this.props.dispatch(limitOrderActions.focusInput('source'));
    
    this.selectTokenBalance();
    
    this.props.global.analytics.callTrack("trackClickToken", base, "limit_order");
  };

  getFilteredTokens = (orderByDesc = true, itemNumber = false) => {
    
    let filteredTokens = [];
    var tokens = this.props.availableBalanceTokens()
  
    if (orderByDesc) {
      filteredTokens = converters.mergeSort(tokens, 1)
    } else {
      filteredTokens = converters.mergeSort(tokens, -1)
    }

    filteredTokens = itemNumber ? filteredTokens.slice(0, itemNumber) : filteredTokens;

    return filteredTokens;
  }

  clearSession = () => {
    this.props.dispatch(globalActions.clearSession());
    this.props.dispatch(limitOrderActions.getPendingBalancesComplete({}, []));
    this.props.dispatch(limitOrderActions.fetchFeeComplete(constants.LIMIT_ORDER_CONFIG.maxFee, constants.LIMIT_ORDER_CONFIG.maxFee, 0))
    this.props.global.analytics.callTrack("trackClickChangeWallet");
  }

  render() {
    if (this.props.account === false) {
      return  null
    } else {
      return (
        <ToggleableMenu
          clearSession={this.clearSession}>
            <AccountBalance
              isLimitOrderTab={true}
              getFilteredTokens={this.getFilteredTokens}
              sourceActive={this.props.limitOrder.sourceTokenSymbol}
              isOnDAPP={this.props.account.isOnDAPP}
              walletName={this.props.walletName}
              screen="limit_order"
              selectToken={this.selectToken}
            />
        </ToggleableMenu>
      );
    }
  }
}
