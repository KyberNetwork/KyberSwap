import React from "react"
import { connect } from "react-redux"
import constansts from "../../services/constants"
import { getTranslate } from 'react-localize-redux'
import * as common from "../../utils/common"
import { Link } from 'react-router-dom'

@connect((store, props) => {
  const langs = store.locale.languages
  var currentLang = common.getActiveLanguage(langs)
  const exchange = store.exchange
  const transfer = store.transfer
  const limitOrder = store.limitOrder

  var exchangeLink = constansts.BASE_HOST + "/swap/" + exchange.sourceTokenSymbol.toLowerCase() + "-" + exchange.destTokenSymbol.toLowerCase()
  var transferLink = constansts.BASE_HOST + "/transfer/" + transfer.tokenSymbol.toLowerCase()

  var orderLink = constansts.BASE_HOST + `/${constansts.LIMIT_ORDER_CONFIG.path}/` + limitOrder.sourceTokenSymbol.toLowerCase() + "-" + limitOrder.destTokenSymbol.toLowerCase()

  exchangeLink = common.getPath(exchangeLink, constansts.LIST_PARAMS_SUPPORTED)
  transferLink = common.getPath(transferLink, constansts.LIST_PARAMS_SUPPORTED)
  orderLink = common.getPath(orderLink, constansts.LIST_PARAMS_SUPPORTED)

  const translate = getTranslate(store.locale)

  return {
    translate, currentLang, exchangeLink, transferLink, orderLink,
    page: props.page,
    analytics: store.global.analytics
  }
})

export default class HeaderTransaction extends React.Component {
  gotoRoot = (e) => {
    this.props.analytics.callTrack("trackClickBreadCrumb", "Home");
    if (this.props.currentLang === 'en') {
      window.location.href = "/"
    } else {
      window.location.href = `/?lang=${this.props.currentLang}`
    }
  }

  render() {
    var transfer = this.props.translate("transaction.transfer") || "Transfer"
    var swap = this.props.translate("transaction.swap") || "Swap"
    var order = this.props.translate("transaction.limit_order") || "Limit Order"

    const disabledSwapClass = this.props.page === "exchange" ? " exchange-tab__item--active" : " exchange-tab__item--disabled";
    const disabledTransferClass = this.props.page === "transfer" ? " exchange-tab__item--active" : " exchange-tab__item--disabled";

    const disabledLimitOrderClass = this.props.page === "limit_order" ? " exchange-tab__item--active" : " exchange-tab__item--disabled";

    return (
      <div className="exchange-header">
        <div className="exchange-tab">
          <Link to={this.props.exchangeLink} className={"exchange-tab__item" + disabledSwapClass}>{swap}</Link>          
          <Link to={this.props.transferLink} className={"exchange-tab__item" + disabledTransferClass}>{transfer}</Link>
          <div className="exchange-tab__item--limit-order">
            <Link to={this.props.orderLink} className={"exchange-tab__item " + disabledLimitOrderClass}>
              {order}
            </Link>

            {/* Beta icon */}
            <img className="exchange-tab__limit-order-beta" src={require("../../../assets/img/limit-order/beta.svg")}/>
            {/* Info icon */}
            {/* <img className="exchange-tab__limit-order-info" src={require("../../../assets/img/v3/info_grey.svg")} /> */}
          </div>
        </div>
      </div>
    )
  }
}
