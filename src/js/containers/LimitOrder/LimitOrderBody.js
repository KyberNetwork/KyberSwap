import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'

import * as limitOrderActions from "../../actions/limitOrderActions"
import * as globalActions from "../../actions/globalActions"


import * as common from "../../utils/common"
import * as constants from "../../services/constants"

import { LimitOrderForm, LimitOrderSubmit, LimitOrderFee, LimitOrderList, LimitOrderCompareRate, LimitOrderAccount } from "../LimitOrder"





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


 
    chooseToken = (symbol, address, type) => {
        this.props.dispatch(limitOrderActions.selectTokenAsync(symbol, address, type))
        var path
        if (type === "source") {
          path = constants.BASE_HOST + `/${constants.LIMIT_ORDER_CONFIG.path}/` + symbol.toLowerCase() + "-" + this.props.limitOrder.destTokenSymbol.toLowerCase()
          this.props.global.analytics.callTrack("trackChooseToken", "from", symbol);
        } else {
          path = constants.BASE_HOST + `/${constants.LIMIT_ORDER_CONFIG.path}/` + this.props.limitOrder.sourceTokenSymbol.toLowerCase() + "-" + symbol.toLowerCase()
          this.props.global.analytics.callTrack("trackChooseToken", "to", symbol);
        }
    
        path = common.getPath(path, constants.LIST_PARAMS_SUPPORTED)
        this.props.dispatch(globalActions.goToRoute(path))
        this.props.dispatch(globalActions.updateTitleWithRate());
      }


    render() {
      return (
        <div className={"limit-order-body"}>
          <div>
            <div>
                <LimitOrderForm chooseToken = {this.chooseToken}/>
                <LimitOrderCompareRate />
            </div>
            <div>
                <div>
                    <LimitOrderAccount chooseToken = {this.chooseToken} />
                </div>
                <div>
                    <LimitOrderFee />
                </div>
            </div>
          </div>
          <div>
              <LimitOrderSubmit />
          </div>
          <div className="limit-order-body--list">
              <LimitOrderList />
          </div>
        </div>
      )
    }
}
