import React from "react"
import { Link } from 'react-router-dom'
import { connect } from "react-redux"
import { Rate, Address, Notify, AccountBalance, InfoLink } from "../Header"
import { getTranslate } from 'react-localize-redux';
import exchangeActions from "../../actions/exchangeActions"
import * as globalActions from "../../actions/globalActions"

import HeaderView from '../../components/Header/HeaderView'
import { openInfoModal, closeInfoModal } from "../../actions/utilActions";
import { TermModal } from '../../components/CommonElement'
import { goToImport } from "../../actions/accountActions";

@connect((store) => {

  var location = "/"
  if (store.router.location) {
    location = store.router.location.pathname
  }
  return {
    location: location,
    txs: store.txs,
    account: store.account.account,
    isInLandingPage: store.account.isInLandingPage,
    global: store.global,
    translate: getTranslate(store.locale)
  }
})

export default class Header extends React.Component {

  analyze = (txHash) => {
    this.props.dispatch(exchangeActions.analyzeError(this.props.ethereum, txHash))
  }

  toggleModal = () => {
    this.props.dispatch(globalActions.toggleAnalyze())
  }

  goToImportAccount = () => {
    this.props.dispatch(closeInfoModal())
    this.props.dispatch(goToImport())
  }

  openInfoModal = () => {
    var termModal = <TermModal translate={this.props.translate} goToImport={this.goToImportAccount}/>
    this.props.dispatch(openInfoModal('Terms of Service', termModal, true))
  }

  render() {
    console.log(this.props.account)
    var infoMenu = this.props.location === "/" ? <InfoLink /> : ""
    var balance = this.props.account ? <AccountBalance /> : false
    var analyze = {
      action: this.analyze,
      isAnalize: this.props.global.isAnalize,
      isAnalizeComplete: this.props.global.isAnalizeComplete,
      analizeError: this.props.global.analizeError,
      selectedAnalyzeHash: this.props.global.selectedAnalyzeHash
    }
    var address = <Address path={this.props.location.pathname} translate={this.props.translate}/>
    var rate = <Rate />

    return (
      <HeaderView
        account={this.props.account}
        isInLandingPage={this.props.isInLandingPage}
        address={address}
        rate={rate}
        openInfoModal={this.openInfoModal}
        balance={balance}
        infoMenu={infoMenu}
        analyze={analyze}
        onRequestClose={this.toggleModal}
        isOpen={this.props.global.isOpenAnalyze}
        translate={this.props.translate}
      />
    )
  }
}
