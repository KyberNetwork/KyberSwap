import React from "react"
import TermAndServices from "../../containers/CommonElements/TermAndServices";
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux';
import * as web3Package from "../../services/web3"
import {acceptTermOfService} from "../../actions/globalActions"
import { importAccountMetamask, setOnDAPP } from "../../actions/accountActions"
import BLOCKCHAIN_INFO from "../../../../env"

@connect((store) => {
  return {
    translate: getTranslate(store.locale),
    ethereum: store.connection.ethereum,
    global: store.global
  }
})
export default class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      termAgree: false,
      text: ''
    }
  }

  componentDidMount() {
    let textArr = ['Decentralized', 'Trustless', 'Instant', 'Liquid', 'Compatible']
    this.typeIt(textArr)
  }

  componentWillUnmount() {
    clearInterval(this.SI);
    clearTimeout(this.ST);
  }

  typeIt(words) {
    let letterIndex = 0;
    let wordIndex = 0;

    let nextWord = () => {
      let h1 = ''
      this.SI = setInterval(() => {
        h1 += words[wordIndex][letterIndex]
        this.setState({
          text: h1
        })
        letterIndex++;
        if (letterIndex === words[wordIndex].length) {
          wordIndex = (wordIndex + 1) % words.length;
          letterIndex = 0;
          clearInterval(this.SI);
          this.ST = setTimeout(() => {
            nextWord();
          }, 2000);
        }
      }, 150);
    }
    nextWord();
  }

  acceptTerm = () => {
    var web3Service = web3Package.newWeb3Instance()

    if (web3Service !== false) {
      var walletType = web3Service.getWalletType()
      if ((walletType !== "metamask") && (walletType !== "modern_metamask")) {
        this.props.dispatch(importAccountMetamask(web3Service, BLOCKCHAIN_INFO.networkId,
          this.props.ethereum, this.props.translate, walletType))
        this.props.dispatch(setOnDAPP())
      }else{
        this.props.dispatch(acceptTermOfService())
      }
    }else{
      this.props.dispatch(acceptTermOfService())
    }
    this.props.global.analytics.callTrack("acceptTerm", this.props.tradeType);
  };

  render() {
    return (
      <div id="get-start">
        <div className="landing-background">
        </div>
        <div class="frame">
          <div className="container">
            <div className="convert-tokens">
              <div className="landing-page__container">
                <TermAndServices onClick={this.acceptTerm}/>
              </div>

              <div className="account-type">
                <div className="account-type__item">
                  <div className="account-type__content">
                    <img src={require("../../../assets/img/landing/metamask_disable.png")} />
                    <div className="account-type__text">{this.props.translate("landing_page.metamask") || "METAMASK"}</div>
                  </div>
                </div>
                <div className="account-type__item">
                  <div className="account-type__content">
                    <img src={require("../../../assets/img/landing/keystore_disable.png")} />
                    <div className="account-type__text">{this.props.translate("landing_page.json") || "JSON"}</div>
                  </div>
                </div>
                <div className="account-type__item">
                  <div className="account-type__content">
                    <img src={require("../../../assets/img/landing/trezor_disable.png")} />
                    <div className="account-type__text">{this.props.translate("landing_page.trezor") || "TREZOR"}</div>
                  </div>
                </div>
                <div className="account-type__item">
                  <div className="account-type__content">
                    <img src={require("../../../assets/img/landing/ledger_disable.png")} />
                    <div className="account-type__text">{this.props.translate("landing_page.ledger") || "LEDGER"}</div>
                  </div>
                </div>
                <div className="account-type__item">
                  <div className="account-type__content">
                    <img src={require("../../../assets/img/landing/privatekey_disable.png")} />
                    <div className="account-type__text">{this.props.translate("landing_page.private_key") || "PRIVATE KEY"}</div>
                  </div>
                </div>
                <div className="account-type__item">
                  <div className="account-type__content">
                    <img src={require('../../../assets/img/promo_code.svg')} />
                    <div className="account-type__text">{this.props.translate("landing_page.promo_code") || "PROMO CODE"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
