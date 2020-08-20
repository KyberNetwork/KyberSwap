import React from "react"
import { connect } from "react-redux"
import constansts from "../../services/constants"
import { getTranslate } from 'react-localize-redux'
import * as common from "../../utils/common"
import { Link } from 'react-router-dom'
import { switchTheme } from "../../actions/globalActions";

@connect((store, props) => {
  const langs = store.locale.languages
  var currentLang = common.getActiveLanguage(langs)
  const exchange = store.exchange
  const transfer = store.transfer
  const limitOrder = store.limitOrder

  var exchangeLink = constansts.BASE_HOST + "/swap/" + exchange.sourceTokenSymbol.toLowerCase() + "-" + exchange.destTokenSymbol.toLowerCase()
  var transferLink = constansts.BASE_HOST + "/transfer/" + transfer.tokenSymbol.toLowerCase()
  var orderLink = constansts.BASE_HOST + `/${constansts.LIMIT_ORDER_CONFIG.path}/` + limitOrder.sourceTokenSymbol.toLowerCase() + "-" + limitOrder.destTokenSymbol.toLowerCase()
  var portfolioLink = constansts.BASE_HOST + `/portfolio`;

  exchangeLink = common.getPath(exchangeLink, constansts.LIST_PARAMS_SUPPORTED)
  transferLink = common.getPath(transferLink, constansts.LIST_PARAMS_SUPPORTED)
  orderLink = common.getPath(orderLink, constansts.LIST_PARAMS_SUPPORTED)

  const translate = getTranslate(store.locale)

  return {
    translate, currentLang, exchangeLink, transferLink, orderLink, portfolioLink,
    page: props.page,
    analytics: store.global.analytics,
    theme: store.global.theme
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

  switchTheme = () => {
    const theme = this.props.theme === 'dark' ? 'light' : 'dark';
    this.props.dispatch(switchTheme(theme));
  };

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
          <Link to={this.props.orderLink} className={"exchange-tab__item " + disabledLimitOrderClass}>{order}</Link>
          <Link to={this.props.portfolioLink} className={"exchange-tab__item"}>Portfolio</Link>
          <div onClick={this.switchTheme} className={"exchange-tab__item"}>Switch Theme</div>
        </div>
      </div>
    )
  }
}
