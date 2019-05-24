import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as limitOrderActions from "../../actions/limitOrderActions"
import * as globalActions from "../../actions/globalActions"
import * as common from "../../utils/common"
import * as constants from "../../services/constants"
import { LimitOrderForm, LimitOrderSubmit, LimitOrderFee, LimitOrderList, LimitOrderAccount, LimitOrderListModal } from "../LimitOrder"

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
  renderTokenSymbol = (token) => {
    return token.substituteSymbol ? token.substituteSymbol : token.symbol;
  }

  renderTokenImage = (token) => {
    return token.substituteImage ? token.substituteImage : token.symbol;
  }

  findTokenBySymbol = (tokens, symbol) => {
    return  tokens.find(token => {
      return token.symbol === symbol;
    });
  };

  getTokenListWithoutEthAndWeth = (tokens) => {
    return tokens.filter(token => {
      return token.symbol !== 'ETH' && token.symbol !== 'WETH';
    });
  }

  mergeEthIntoWeth = (tokens) => {
    const eth = this.findTokenBySymbol(tokens, 'ETH');
    let weth = this.findTokenBySymbol(tokens, 'WETH');

    if (weth) {
      weth = Object.create(weth);
      weth.substituteSymbol = 'ETH*';
      weth.substituteImage = 'eth';

      if (eth) {
        weth.balance = +weth.balance + +eth.balance;
      }
    }

    return weth;
  }

  getAvailableBalanceTokenList = () => {
    const tokens = this.props.tokens;
    const orderList = this.props.limitOrder.listOrder;

    return Object.keys(tokens).map(key => {
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
  };

  getModifiedTokenList = () => {
    let tokens = this.getAvailableBalanceTokenList();
    const weth = this.mergeEthIntoWeth(tokens);

    tokens = this.getTokenListWithoutEthAndWeth(tokens);

    if (weth) {
      tokens.splice(0, 0, weth)
    }

    return tokens;
  }

  chooseToken = (symbol, address, type) => {
    var path
    let sourceTokenSymbol = type === "source" ? symbol : this.props.limitOrder.sourceTokenSymbol;
    let destTokenSymbol = type === "source" ? this.props.limitOrder.destTokenSymbol : symbol;

    if (sourceTokenSymbol.toLowerCase() === "eth") {
      sourceTokenSymbol = "WETH";
    } else if (destTokenSymbol.toLowerCase() === "eth") {
      destTokenSymbol = "WETH";
    }

    this.props.dispatch(limitOrderActions.selectTokenAsync(type === "source" ? sourceTokenSymbol : destTokenSymbol, address, type));

    if (type === "source") {
      path = constants.BASE_HOST + `/${constants.LIMIT_ORDER_CONFIG.path}/` + sourceTokenSymbol.toLowerCase() + "-" + destTokenSymbol.toLowerCase()
      this.props.global.analytics.callTrack("trackChooseToken", "from", symbol);
    } else {
      path = constants.BASE_HOST + `/${constants.LIMIT_ORDER_CONFIG.path}/` + sourceTokenSymbol.toLowerCase() + "-" + destTokenSymbol.toLowerCase()
      this.props.global.analytics.callTrack("trackChooseToken", "to", symbol);
    }

    path = common.getPath(path, constants.LIST_PARAMS_SUPPORTED)
    this.props.dispatch(globalActions.goToRoute(path))
    this.props.dispatch(globalActions.updateTitleWithRate());
  }

  render() {
    return (
      <div className={"limit-order-body"}>
        <div className="limit-order-body--form">
          <div>
            <LimitOrderForm
              chooseToken = {this.chooseToken}
              availableBalanceTokens = {this.getModifiedTokenList()}
            />
          </div>
          <div>
            <div>
              <LimitOrderAccount
                chooseToken={this.chooseToken}
                getTokenListWithoutEthAndWeth={this.getTokenListWithoutEthAndWeth}
                mergeEthIntoWeth={this.mergeEthIntoWeth}
                getAvailableBalanceTokenList={this.getAvailableBalanceTokenList}
              />
            </div>
            <div>
              <LimitOrderFee />
            </div>
          </div>
        </div>
        <div>
          <LimitOrderSubmit />
        </div>
        {!this.props.global.isOnMobile &&
          <div className="limit-order-body--list">
            <LimitOrderList />
          </div>
        }
        {this.props.global.isOnMobile && <LimitOrderListModal />}
      </div>
    )
  }
}
