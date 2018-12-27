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
  var exchangeLink = constansts.BASE_HOST + "/swap/" + exchange.sourceTokenSymbol.toLowerCase() + "_" + exchange.destTokenSymbol.toLowerCase()
  var transferLink = constansts.BASE_HOST + "/transfer/" + transfer.tokenSymbol.toLowerCase()

  exchangeLink = common.getPath(exchangeLink, constansts.LIST_PARAMS_SUPPORTED)
  transferLink = common.getPath(transferLink, constansts.LIST_PARAMS_SUPPORTED)

  const translate = getTranslate(store.locale)

  return {
    translate, currentLang, exchangeLink, transferLink,
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
    const disabledSwapClass = this.props.page === "exchange" ? "" : " exchange-tab__item--disabled";
    const disabledTransferClass = this.props.page === "transfer" ? "" : " exchange-tab__item--disabled";

    return (
      <div className="exchange-header">
        {/*<div className="swap-navigation">*/}
          {/*<div>*/}
            {/*<a onClick={(e) => this.gotoRoot(e)}>{this.props.translate("home") || "Home"}</a>*/}
          {/*</div>*/}
          {/*<div className="seperator">/</div>*/}
          {/*<div className="active">*/}
            {/*<a>{this.props.page === "exchange" ? swap : transfer}</a>*/}
          {/*</div>*/}
        {/*</div>*/}
        <div className="exchange-tab">
          <Link to={this.props.exchangeLink} className={"exchange-tab__item" + disabledSwapClass}>{swap}</Link>
          <div className={"exchange-tab__separator"}></div>
          <Link to={this.props.transferLink} className={"exchange-tab__item" + disabledTransferClass}>{transfer}</Link>
        </div>
      </div>
    )
  }
}
