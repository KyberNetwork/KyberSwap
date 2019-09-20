import React from "react";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import { ImportAccount } from "../ImportAccount";
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
  constructor() {
    super();
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

  // selectToken = (sourceSymbol) => {

  //   this.props.selectSourceToken(sourceSymbol, this.props.tokens[sourceSymbol].address, "source")

  //   // var sourceBalance = this.props.tokens[sourceSymbol].balance

  //   const tokens = this.getFilteredTokens();
  //   const srcToken = tokens.find(token => {
  //     return token.symbol === sourceSymbol;
  //   });
  //   const destToken = tokens.find(token => {
  //     return token.symbol === this.props.limitOrder.destTokenSymbol;
  //   });
  //   var sourceBalance = srcToken.balance;

  //   var sourceDecimal = this.props.tokens[sourceSymbol].decimals

  //   if (sourceSymbol === BLOCKCHAIN_INFO.wrapETHToken) {

  //     //if souce token is weth, we spend a small amount to make approve tx, swap tx

  //     var ethBalance = this.props.tokens["ETH"].balance
  //     var fee = this.calcualteMaxFee()      
  //     if (converters.compareTwoNumber(ethBalance, fee) === 1) {
  //       sourceBalance = converters.subOfTwoNumber(sourceBalance, fee)
  //     } else {
  //       sourceBalance = converters.subOfTwoNumber(sourceBalance, ethBalance)
  //     }

  //   }

  //   if (converters.compareTwoNumber(sourceBalance, 0) == -1) sourceBalance = 0  

  //   this.props.dispatch(limitOrderActions.inputChange('source', converters.toT(sourceBalance, sourceDecimal), sourceDecimal, destToken.decimals))
  //   this.props.dispatch(limitOrderActions.focusInput('source'));

  //   this.selectTokenBalance();
  //   this.props.global.analytics.callTrack("trackClickToken", sourceSymbol, "limit_order");
  // }

  selectToken = (destSymbol) => {

    this.props.selectDestToken(destSymbol, this.props.tokens[destSymbol].address, "dest")

    // var sourceBalance = this.props.tokens[sourceSymbol].balance

    const tokens = this.getFilteredTokens();
    const srcToken = tokens.find(token => {
      return token.symbol === this.props.limitOrder.sourceTokenSymbol;
    });
    const destToken = tokens.find(token => {
      return token.symbol === destSymbol;
    });
    var destBalance = destToken.balance;

    var destDecimal = this.props.tokens[destSymbol].decimals

    // if (sourceSymbol === BLOCKCHAIN_INFO.wrapETHToken) {

    //   //if souce token is weth, we spend a small amount to make approve tx, swap tx

    //   var ethBalance = this.props.tokens["ETH"].balance
    //   var fee = this.calcualteMaxFee()      
    //   if (converters.compareTwoNumber(ethBalance, fee) === 1) {
    //     sourceBalance = converters.subOfTwoNumber(sourceBalance, fee)
    //   } else {
    //     sourceBalance = converters.subOfTwoNumber(sourceBalance, ethBalance)
    //   }

    // }

    // if (converters.compareTwoNumber(sourceBalance, 0) == -1) sourceBalance = 0  

    this.props.dispatch(limitOrderActions.inputChange('dest', converters.toT(destBalance, destDecimal), srcToken.decimals, destDecimal))
    this.props.dispatch(limitOrderActions.focusInput('dest'));

    this.selectTokenBalance();
    this.props.global.analytics.callTrack("trackClickToken", destSymbol, "limit_order");
  }

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
    this.props.dispatch(globalActions.clearSession(this.props.limitOrder.gasPrice));
    this.props.dispatch(limitOrderActions.getPendingBalancesComplete({}, []));
    this.props.dispatch(limitOrderActions.fetchFeeComplete(constants.LIMIT_ORDER_CONFIG.maxFee, constants.LIMIT_ORDER_CONFIG.maxFee, 0))
    this.props.global.analytics.callTrack("trackClickChangeWallet");
    // this.props.dispatch(globalActions.setGasPrice(this.props.ethereum))
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
              sourceActive={this.props.limitOrder.destTokenSymbol}
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
