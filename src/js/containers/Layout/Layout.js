import React from "react"
import { connect } from "react-redux"
import { Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import InfoKyber from "../../components/InfoKyber"
import { Exchange } from "../../containers/Exchange"
import { Transfer } from "../../containers/Transfer"
import { Header, Rate } from "../../containers/Header"
import { ImportAccount } from "../ImportAccount"

import { Footer } from "../Layout"

import { Processing, ExchangeHistory, TransactionList } from "../../containers/CommonElements/"
import constanst from "../../services/constants"
// import { createNewConnection } from "../../services/ethereum/connection"

import history from "../../history"
import { clearSession, changeLanguage } from "../../actions/globalActions"
import { openInfoModal } from "../../actions/utilActions"
import { setConnection, createNewConnectionInstance } from "../../actions/connectionActions"
import { default as _ } from 'underscore';
import { LayoutView } from "../../components/Layout"
import { getTranslate } from 'react-localize-redux'

import Language from "../../../../lang"

@connect((store) => {
  return {
    ethereumNode: store.connection.ethereum,
    currentBlock: store.global.currentBlock,
    connected: store.global.connected,
    showBalance: store.global.showBalance,
    utils: store.utils,
    account: store.account,
    translate: getTranslate(store.locale),
    locale: store.locale
    // currentLanguage: getActiveLanguage(store.locale).code
  }
})

export default class Layout extends React.Component {
  constructor() {
    super();
    this.idleTime = 0;
    this.timeoutEndSession = constanst.IDLE_TIME_OUT / 10;    // x10 seconds
    this.idleMode = false;
    this.intervalIdle = null;
  }
  componentWillMount() {
    document.onload = this.resetTimmer;
    document.onmousemove = this.resetTimmer;
    document.onmousedown = this.resetTimmer; // touchscreen presses
    document.ontouchstart = this.resetTimmer;
    document.onclick = this.resetTimmer;     // touchpad clicks
    document.onscroll = this.resetTimmer;    // scrolling with arrow keys
    document.onkeypress = this.resetTimmer;

    this.intervalIdle = setInterval(this.checkTimmer.bind(this), 10000)

    this.props.dispatch(createNewConnectionInstance())
    // createNewConnection()
  }

  checkTimmer() {
    if (!this.props.account.account) return;
    if (this.props.utils.infoModal && this.props.utils.infoModal.open) return;
    if (this.idleTime >= this.timeoutEndSession) {
      let timeOut = constanst.IDLE_TIME_OUT/60
      let titleModal = this.props.translate('error.time_out') || 'Time out'
      let contentModal = this.props.translate('error.clear_data_timeout', {time: timeOut}) || `We've cleared all your data because your session is timed out ${timeOut} minutes`
      this.props.dispatch(openInfoModal(titleModal, contentModal));
      this.endSession();
    } else {
      this.idleTime++;
    }
  }

  resetTimmer = _.throttle(this.doResetTimer.bind(this), 5000)

  doResetTimer() {
    this.idleTime = 0;
  }

  endSession() {
    this.props.dispatch(clearSession());
  }

  setActiveLanguage = (language) => {
    this.props.dispatch(changeLanguage(this.props.ethereumNode, language, this.props.locale))
  }

  render() {
    var exchangeHistory = <TransactionList />
    var footer = <Footer />
    var rate = <Rate />
    return (
      <LayoutView
        history={history}
        Header={Header}
        ImportAccount={ImportAccount}
        Exchange={Exchange}
        Transfer={Transfer}
        exchangeHistory={exchangeHistory}
        supportedLanguages={Language.supportLanguage}
        setActiveLanguage={this.setActiveLanguage}
        rate={rate}
        footer = {footer}
      />
    )
  }
}
