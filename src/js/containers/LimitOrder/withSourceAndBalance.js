import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as limitOrderActions from "../../actions/limitOrderActions"
import * as globalActions from "../../actions/globalActions"
import * as common from "../../utils/common"
import * as converts from "../../utils/converter"
import * as constants from "../../services/constants"
import BLOCKCHAIN_INFO from "../../../../env";

const withSourceAndBalance = (Component) => {
  return connect((store, props) => {
    const account = store.account.account
    const translate = getTranslate(store.locale)
    const tokens = store.tokens.tokens
    const limitOrder = store.limitOrder
    const ethereum = store.connection.ethereum

    return {
      translate, limitOrder, tokens, account, ethereum,
      global: store.global
    }
  })(class extends React.Component{
    mergeEthIntoWeth = () => {
      var tokens = this.props.tokens
      const eth = tokens["ETH"];
      let weth = tokens["WETH"];

      if (weth) {
        weth = Object.create(weth);
        weth.substituteSymbol = constants.WETH_SUBSTITUTE_NAME;
        weth.substituteImage = 'eth-weth';
        weth.rateUSD = eth.rateUSD

        if (eth) {
          weth.balance = converts.sumOfTwoNumber(weth.balance, eth.balance);
        }
      }

      var openOrderAmount = this.getOpenOrderAmount(weth.symbol, weth.decimals);
      if (converts.compareTwoNumber(weth.balance, openOrderAmount) == 1){
        weth.balance = converts.subOfTwoNumber(weth.balance, openOrderAmount)
      }else{
        weth.balance = 0
      }
      
      return weth;
    }

    getTokenListWithoutEthAndWeth = (tokens) => {
      const now = common.getNowTimeStamp();

      return tokens.filter(token => {
        return token.symbol !== 'ETH' && token.symbol !== BLOCKCHAIN_INFO.wrapETHToken &&
          token.sp_limit_order && (!token.lod_listing_time || now >= token.lod_listing_time);
      });
    }

    getOpenOrderAmount = (tokenSymbol, tokenDecimals) => {
      if (!this.props.account) return 0

      if (this.props.limitOrder.pendingBalances[tokenSymbol]) {
        const pendingTx = this.props.limitOrder.pendingTxs.find(pendingTx => {
          return pendingTx.src_token === tokenSymbol;
        });

        let amount = this.props.limitOrder.pendingBalances[tokenSymbol];

        if (pendingTx && pendingTx.status === 1) {
          if (converts.compareTwoNumber(amount, pendingTx.src_amount) == 1) {
            amount = converts.subOfTwoNumber(amount, pendingTx.src_amount);
          } else {
            amount = 0
          }
        }

        return converts.toTWei(amount, tokenDecimals);
      } else {
        return 0;
      }
    }

    getAvailableBalanceTokenList = () => {
      const tokens = this.props.tokens;

      return Object.keys(tokens).map(key => {
        let token = tokens[key];
        const openOrderAmount = this.getOpenOrderAmount(token.symbol, token.decimals);

        if (openOrderAmount) {
          token = Object.create(token);

          if (converts.compareTwoNumber(token.balance, openOrderAmount) == 1) {
            token.balance = converts.subOfTwoNumber(token.balance, openOrderAmount);
          } else {
            token.balance = 0
          }
        }

        return token;
      });
    };

    getModifiedTokenList = () => {
      let tokens = this.getAvailableBalanceTokenList();
      tokens = this.getTokenListWithoutEthAndWeth(tokens);
      const weth = this.mergeEthIntoWeth();
      if (weth) {
        tokens.splice(0, 0, weth)
      }
      return tokens;
    }

    updateGlobal = (sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, srcAmount = null) => {
      var path = constants.BASE_HOST + `/${constants.LIMIT_ORDER_CONFIG.path}/` + sourceTokenSymbol.toLowerCase() + "-" + destTokenSymbol.toLowerCase()
      path = common.getPath(path, constants.LIST_PARAMS_SUPPORTED)
      this.props.dispatch(globalActions.goToRoute(path))
      this.props.dispatch(globalActions.updateTitleWithRate());

      var sourceAmount = srcAmount ? srcAmount : this.props.limitOrder.sourceAmount

      if (sourceTokenSymbol === destTokenSymbol){
        this.props.dispatch(limitOrderActions.throwError("sourceAmount", [this.props.translate("error.source_dest_token") || "Source token must be different from dest token"]))
      }else{
        this.props.dispatch(limitOrderActions.throwError("sourceAmount", []))
      }
      this.props.dispatch(limitOrderActions.updateRate(this.props.ethereum, sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, sourceAmount, true, constants.LIMIT_ORDER_CONFIG.updateRateType.selectToken));
    }

    selectSourceToken = (symbol) => {
      var sourceTokenSymbol = symbol
      var sourceToken = this.props.tokens[sourceTokenSymbol].address
      var destTokenSymbol = this.props.limitOrder.destTokenSymbol
      var destToken = this.props.tokens[destTokenSymbol].address
      this.props.dispatch(limitOrderActions.selectToken(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken));

      this.updateGlobal(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken)
      this.props.global.analytics.callTrack("trackLimitOrderSelectToken", "source", symbol);
    }

    selectDestToken = (symbol) => {
      var sourceTokenSymbol = this.props.limitOrder.sourceTokenSymbol
      var sourceToken = this.props.tokens[sourceTokenSymbol].address
      var destTokenSymbol = symbol
      var destToken = this.props.tokens[destTokenSymbol].address
      this.props.dispatch(limitOrderActions.selectToken(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken));

      this.updateGlobal(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken)
      this.props.global.analytics.callTrack("trackLimitOrderSelectToken", "dest", symbol);
    }

    selectSourceAndDestToken = (baseSymbol, quoteSymbol) => {
      var sourceToken = this.props.tokens[baseSymbol].address
      var destToken = this.props.tokens[quoteSymbol].address
      this.props.dispatch(limitOrderActions.selectToken(baseSymbol, sourceToken, quoteSymbol, destToken));
      this.updateGlobal(baseSymbol, sourceToken, quoteSymbol, destToken)
    };

    render() {
      return (
        <Component
          {...this.props}
          selectSourceToken={this.selectSourceToken}  //for limit order account
          selectDestToken={this.selectDestToken}  //for limit order account
          selectSourceAndDestToken={this.selectSourceAndDestToken}  //for quote market
          availableBalanceTokens={this.getModifiedTokenList}  //for limit order account + form
          getOpenOrderAmount={this.getOpenOrderAmount}  //for limit order form
        />
      )
    }
  })
};

export default withSourceAndBalance;
