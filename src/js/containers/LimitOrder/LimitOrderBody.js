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
    // chooseToken = (symbol, address, type) => {
    //     var path

    //     let sourceTokenSymbol = type === "source" ? symbol : this.props.limitOrder.sourceTokenSymbol;
    //     let destTokenSymbol = type === "source" ? this.props.limitOrder.destTokenSymbol : symbol;

    //     if (sourceTokenSymbol.toLowerCase() === "eth") {
    //       sourceTokenSymbol = "WETH";
    //     } else if (destTokenSymbol.toLowerCase() === "eth") {
    //       destTokenSymbol = "WETH";
    //     }

    //     this.props.dispatch(limitOrderActions.selectTokenAsync(type === "source" ? sourceTokenSymbol : destTokenSymbol, address, type));

    //     if (type === "source") {
    //       path = constants.BASE_HOST + `/${constants.LIMIT_ORDER_CONFIG.path}/` + sourceTokenSymbol.toLowerCase() + "-" + destTokenSymbol.toLowerCase()
    //       this.props.global.analytics.callTrack("trackChooseToken", "from", symbol);
    //     } else {
    //       path = constants.BASE_HOST + `/${constants.LIMIT_ORDER_CONFIG.path}/` + sourceTokenSymbol.toLowerCase() + "-" + destTokenSymbol.toLowerCase()
    //       this.props.global.analytics.callTrack("trackChooseToken", "to", symbol);
    //     }
    
    //     path = common.getPath(path, constants.LIST_PARAMS_SUPPORTED)
    //     this.props.dispatch(globalActions.goToRoute(path))
    //     this.props.dispatch(globalActions.updateTitleWithRate());
    //   }


      updateGlobal = (sourceTokenSymbol, sourceToken, destTokenSymbol, destToken) => {
        var path = constants.BASE_HOST + `/${constants.LIMIT_ORDER_CONFIG.path}/` + sourceTokenSymbol.toLowerCase() + "-" + destTokenSymbol.toLowerCase()
        path = common.getPath(path, constants.LIST_PARAMS_SUPPORTED)
        this.props.dispatch(globalActions.goToRoute(path))
        this.props.dispatch(globalActions.updateTitleWithRate());

        var sourceAmount = this.props.limitOrder.sourceAmount
        this.props.dispatch(limitOrderActions.updateRate(this.props.ethereum, sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, sourceAmount, true, constants.LIMIT_ORDER_CONFIG.updateRateType.selectToken));
      }

      selectSourceToken = (symbol) => {        
        var sourceTokenSymbol = symbol
        var sourceToken = this.props.tokens[sourceTokenSymbol].address
        var destTokenSymbol = this.props.limitOrder.destTokenSymbol
        var destToken = this.props.tokens[destTokenSymbol].address
        this.props.dispatch(limitOrderActions.selectToken(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, "source"));

        this.updateGlobal(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken)
        this.props.global.analytics.callTrack("trackChooseToken", "from", symbol);
      }

      selectDestToken = (symbol) => {
        var sourceTokenSymbol = this.props.limitOrder.sourceTokenSymbol
        var sourceToken = this.props.tokens[sourceTokenSymbol].address
        var destTokenSymbol = symbol
        var destToken = this.props.tokens[destTokenSymbol].address
        this.props.dispatch(limitOrderActions.selectToken(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, "dest"));

        this.updateGlobal(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken)
        this.props.global.analytics.callTrack("trackChooseToken", "to", symbol);
      }


    render() {
      return (
        <div className={"limit-order-body"}>
          <div className="limit-order-body--form">
            <div>
                <LimitOrderForm selectSourceToken = {this.selectSourceToken} selectDestToken ={this.selectDestToken} />
            </div>
            <div>
                <div>
                    <LimitOrderAccount chooseToken = {this.selectSourceToken}/>
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
