import React from "react"
import { connect } from "react-redux"
import { Exchange } from "../../containers/Exchange"
import { Transfer } from "../../containers/Transfer"
import { LimitOrder } from "../../containers/LimitOrder"
import constanst from "../../services/constants"
import history from "../../history"
import {
  clearSession,
  changeLanguage,
  setOnMobileOnly,
  initAnalytics,
  switchTheme,
  setCampaign
} from "../../actions/globalActions"
import { openInfoModal } from "../../actions/utilActions"
import { createNewConnectionInstance } from "../../actions/connectionActions";
import { throttle } from 'underscore';
import { LayoutView } from "../../components/Layout"
import { getTranslate } from 'react-localize-redux'
import * as common from "../../utils/common"
import {isMobile} from '../../utils/common'
import Language from "../../../../lang"
import AnalyticFactory from "../../services/analytics"
import BLOCKCHAIN_INFO from "../../../../env";
import { fetchActiveCampaign, fetchSupportedTokens } from "../../services/kyberSwapService";
import { initTokens } from "../../actions/tokenActions";

@connect((store) => {
  var locale = store.locale
  var code
  if(Array.isArray(locale.languages)) {
    code = locale.languages[0].code
  }

  var langClass
  switch(code) {
    case "en":
      langClass = "swap-en"
      break
    case "cn":
      langClass = "swap-cn"
      break
    case "kr":
      langClass = "swap-kr"
      break
    case "ru":
      langClass = "swap-ru"
      break
    case "vi":
      langClass = "swap-vi"
      break
    default:
      langClass = ""
  }

  const exchange = store.exchange
  const transfer = store.transfer
  const limitOrder = store.limitOrder

  var exchangeLink = constanst.BASE_HOST + "/swap/" + exchange.sourceTokenSymbol.toLowerCase() + "-" + exchange.destTokenSymbol.toLowerCase()
  var transferLink = constanst.BASE_HOST + "/transfer/" + transfer.tokenSymbol.toLowerCase()
  var orderLink = constanst.BASE_HOST + `/${constanst.LIMIT_ORDER_CONFIG.path}/` + limitOrder.sourceTokenSymbol.toLowerCase() + "-" + limitOrder.destTokenSymbol.toLowerCase()
  var portfolioLink = `${constanst.BASE_HOST}/portfolio`;

  return {
    ethereumNode: store.connection.ethereum,
    currentBlock: store.global.currentBlock,
    connected: store.global.connected,
    showBalance: store.global.showBalance,
    utils: store.utils,
    account: store.account,
    translate: getTranslate(store.locale),
    locale: locale,
    analytics: store.global.analytics,
    langClass: langClass,
    theme: store.global.theme,
    exchangeLink, transferLink, orderLink, portfolioLink
  }
})

export default class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.idleTime = 0;
    this.timeoutEndSession = constanst.IDLE_TIME_OUT / 10;
    this.idleMode = false;
    this.intervalIdle = null;
    this.state = {
      tokens: false
    }
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

    const analytic = new AnalyticFactory({ listWorker: ['google'], network: BLOCKCHAIN_INFO.chainName })
    this.props.dispatch(initAnalytics(analytic))
  }

  async componentDidMount() {
    this.props.analytics.callTrack("trackAccessToSwap");

    window.addEventListener("beforeunload", this.handleCloseWeb)
    if (isMobile.iOS() || isMobile.Android()) {
      this.props.dispatch(setOnMobileOnly())
    }
    
    const accountWallet = this.props.account.wallet;
    if (accountWallet.needToBeInitiated === true) {
      accountWallet.initiateWallet();
    }

    if (window.kyberBus) {
      window.kyberBus.on('set.theme.light', () => {this.switchTheme('light')});
      window.kyberBus.on('set.theme.dark', () => {this.switchTheme('dark')});
      window.kyberBus.on('go.to.swap', () => {history.push(this.props.exchangeLink)});
      window.kyberBus.on('go.to.transfer', () =>{history.push(this.props.transferLink)});
      window.kyberBus.on('go.to.limit_order', () => {history.push(this.props.orderLink)});
      window.kyberBus.on('go.to.portfolio', () => {history.push(this.props.portfolioLink)});
      window.kyberBus.on('wallet.change', this.scrollToImportAccount);
    }

    await this.initiateData();
  };

  initiateData = async () => {
    const tokens = await fetchSupportedTokens();
    this.props.dispatch(initTokens(tokens));

    if (process.env && process.env.integrate) {
      let intervalCheckingBus = setInterval(() => {
        if (window.kyberBus) {
          window.kyberBus.broadcast("bundle.ready");
          this.setState({ tokens });
          clearInterval(intervalCheckingBus);
        }
      });
    } else {
      this.setState({ tokens });
    }

    const campaign = await fetchActiveCampaign();
    if (campaign) this.props.dispatch(setCampaign(campaign));
  }
  
  scrollToImportAccount = () => {
    const importAccountBlock = document.getElementById('import-account');
    if (this.props.account.account || !importAccountBlock) return;
    importAccountBlock.scrollIntoView();
  };

  switchTheme = (theme) => {
    this.props.dispatch(switchTheme(theme));
  };

  handleCloseWeb = () => {
    this.props.analytics.callTrack("exitSwap");
  }

  checkTimmer() {
    if (!this.props.account.account) return;
    if (this.props.utils.infoModal && this.props.utils.infoModal.open) return;
    if (this.idleTime >= this.timeoutEndSession) {
      let timeOut = constanst.IDLE_TIME_OUT/60
      let titleModal = this.props.translate('error.time_out') || 'Time out'
      let contentModal = this.props.translate('error.clear_data_timeout', {time: timeOut}) || `We've cleared all your data because your session is timed out ${timeOut} minutes`

      common.getCloseModalExecutors().forEach(f => f())
      common.clearCloseModalExecutors()
      this.props.dispatch(openInfoModal(titleModal, contentModal));
      this.endSession();
    } else {
      this.idleTime++;
    }
  }

  resetTimmer = throttle(this.doResetTimer.bind(this), 5000)

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
    var currentLanguage = common.getActiveLanguage(this.props.locale.languages)

    return (
      <div className={`theme theme--${this.props.theme}__bundle`}>
        {this.state.tokens && (
          <LayoutView
            history={history}
            Exchange={Exchange}
            Transfer={Transfer}
            LimitOrder={LimitOrder}
            supportedLanguages={Language.supportLanguage}
            setActiveLanguage={this.setActiveLanguage}
            currentLanguage={currentLanguage}
            tokens={this.state.tokens}
            langClass={this.props.langClass}
          />
        )}
      </div>
    )
  }
}

