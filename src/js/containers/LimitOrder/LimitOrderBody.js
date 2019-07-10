import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as limitOrderActions from "../../actions/limitOrderActions"
import * as globalActions from "../../actions/globalActions"
import * as common from "../../utils/common"
import * as converts from "../../utils/converter"
import * as constants from "../../services/constants"
import { LimitOrderForm, LimitOrderSubmit, LimitOrderFee, LimitOrderList, LimitOrderAccount, LimitOrderListModal } from "../LimitOrder"
import BLOCKCHAIN_INFO from "../../../../env";

@connect((store, props) => {
  const account = store.account.account
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const limitOrder = store.limitOrder
  const ethereum = store.connection.ethereum

  return {
    translate, limitOrder, tokens, account, ethereum,
    global: store.global
  }
})

export default class LimitOrderBody extends React.Component {
  constructor(props) {
    super(props);
    this.srcInputElementRef = null;
    this.submitHandler = null;
  }

  setSrcInputElementRef = (element) => {
    this.srcInputElementRef = element;
  }

  setSubmitHandler = (func) => {
    this.submitHandler = func;
  }

  getTokenListWithoutEthAndWeth = (tokens) => {
    return tokens.filter(token => {
      return token.symbol !== 'ETH' && token.symbol !== BLOCKCHAIN_INFO.wrapETHToken && token.sp_limit_order;
    });
  }

  mergeEthIntoWeth = () => {
    var tokens = this.props.tokens
    const eth = tokens["ETH"];
    let weth = tokens["WETH"];

    if (weth) {
      weth = Object.create(weth);
      weth.substituteSymbol = constants.WETH_SUBSTITUTE_NAME;
      weth.substituteImage = 'eth-weth';

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

  getOpenOrderAmount = (tokenSymbol, tokenDecimals) => {
    if (!this.props.account) return 0

    if (this.props.limitOrder.pendingBalances[tokenSymbol]) {
      const amount = converts.toTWei(this.props.limitOrder.pendingBalances[tokenSymbol], tokenDecimals)
      return amount;
    } else {
      return 0;
    }

    // if (this.props.limitOrder.filterMode === "client") {
    //   const orderList = this.props.limitOrder.listOrder;
    //   const openOrders = orderList.filter(order => {
    //     return order.user_address.toLowerCase() === this.props.account.address.toLowerCase() && order.source === tokenSymbol && (order.status === constants.LIMIT_ORDER_CONFIG.status.OPEN || order.status === constants.LIMIT_ORDER_CONFIG.status.IN_PROGRESS);
    //   });
  
    //   let openOrderAmount = 0;
  
    //   if (openOrders.length > 0) {
    //     openOrders.forEach(order => {
    //       var srcAmount = converts.toTWei(order.src_amount, tokenDecimals)
    //       openOrderAmount = converts.sumOfTwoNumber(openOrderAmount, srcAmount)          
    //     });
    //   }
  
    //   return openOrderAmount;
    // } else {
    //   if (this.props.limitOrder.pendingBalances[tokenSymbol]) {
    //     const amount = converts.toTWei(this.props.limitOrder.pendingBalances[tokenSymbol], tokenDecimals)
    //     return amount;
    //   } else {
    //     return 0;
    //   }
    // }
  }

  getAvailableBalanceTokenList = () => {
    const tokens = this.props.tokens;
    const orderList = this.props.limitOrder.listOrder;

    return Object.keys(tokens).map(key => {
      let token = tokens[key];
      const openOrderAmount = this.getOpenOrderAmount(token.symbol, token.decimals);

      if (openOrderAmount) {
        token = Object.create(token);
        if (converts.compareTwoNumber(token.balance, openOrderAmount) == 1){
          token.balance = converts.subOfTwoNumber(token.balance, openOrderAmount);
        }else{
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
      // this.props.dispatch(limitOrderActions.throwError)
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
    this.props.dispatch(limitOrderActions.selectToken(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, "source"));

    this.updateGlobal(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken)
    this.props.global.analytics.callTrack("trackLimitOrderSelectToken", "source", symbol);
  }

  selectDestToken = (symbol) => {
    var sourceTokenSymbol = this.props.limitOrder.sourceTokenSymbol
    var sourceToken = this.props.tokens[sourceTokenSymbol].address
    var destTokenSymbol = symbol
    var destToken = this.props.tokens[destTokenSymbol].address
    this.props.dispatch(limitOrderActions.selectToken(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, "dest"));

    this.updateGlobal(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken)
    this.props.global.analytics.callTrack("trackLimitOrderSelectToken", "dest", symbol);
  }

  switchToken = () => {
    const srcToken = this.props.limitOrder.sourceToken;
    const srcTokenSymbol = this.props.limitOrder.sourceTokenSymbol;
    const destToken = this.props.limitOrder.destToken;
    const destTokenSymbol = this.props.limitOrder.destTokenSymbol;
    const destAmount = this.props.limitOrder.destAmount;

    this.props.dispatch(limitOrderActions.selectToken(destTokenSymbol, destToken, srcTokenSymbol, srcToken, ''));

    this.props.dispatch(limitOrderActions.inputChange('source', destAmount));
    this.props.dispatch(limitOrderActions.inputChange('dest', ''));

    this.updateGlobal(destTokenSymbol, destToken, srcTokenSymbol, srcToken, destAmount);
  }

  render() {
    return (
      <div className={"limit-order-body"}>
        <div className="limit-order-body--form">
          <div>
            <LimitOrderForm
              setSrcInputElementRef={this.setSrcInputElementRef}
              selectSourceToken={this.selectSourceToken}
              selectDestToken ={this.selectDestToken}
              availableBalanceTokens={this.getModifiedTokenList()}
              submitHandler={this.submitHandler}
              switchToken={this.switchToken}
              getOpenOrderAmount={this.getOpenOrderAmount}
              setSubmitHandler={this.setSubmitHandler}
            />
          </div>
          <div>
            <div>
              <LimitOrderAccount
                chooseToken={this.selectSourceToken}
                modifiedTokenList = {this.getModifiedTokenList}
              />
            </div>
            <div>
              <LimitOrderFee />
            </div>
          </div>
        </div>
        <div>
          <LimitOrderSubmit
            availableBalanceTokens={this.getModifiedTokenList()}
            getOpenOrderAmount={this.getOpenOrderAmount}
            setSubmitHandler={this.setSubmitHandler}
          />
        </div>
        {!this.props.global.isOnMobile &&
          <div className="limit-order-body--list">
            <LimitOrderList 
              srcInputElementRef={this.srcInputElementRef}
            />
          </div>
        }
        {this.props.global.isOnMobile &&
          <LimitOrderListModal 
            srcInputElementRef={this.srcInputElementRef}
          />}
      </div>
    )
  }
}
