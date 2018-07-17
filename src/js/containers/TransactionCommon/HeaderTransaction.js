import React from "react"
import { connect } from "react-redux"
//import { ExchangeBody, MinRate } from "../Exchange"
//import {GasConfig} from "../TransactionCommon"
//import { AdvanceConfigLayout, GasConfig } from "../../components/TransactionCommon"

import constansts from "../../services/constants"
//import { TransactionLayout } from "../../components/TransactionCommon"
import { getTranslate } from 'react-localize-redux'

import {openImportAccount as openImportAccountExchange} from "../../actions/exchangeActions"
import {openImportAccount as openImportAccountTransfer} from "../../actions/transferActions"

import * as common from "../../utils/common"

// import * as converter from "../../utils/converter"
// import * as validators from "../../utils/validators"
//import * as exchangeActions from "../../actions/exchangeActions"
//import { default as _ } from 'underscore'
import { clearSession } from "../../actions/globalActions"

//import { ImportAccount } from "../ImportAccount"


import { Link } from 'react-router-dom'

@connect((store, props) => {
    //console.log(props)
    const langs = store.locale.languages
    var currentLang = common.getActiveLanguage(langs)



    //console.log("currentlang: " + currentLang)

    //const account = store.account.account
    // if (account === false) {
    //   console.log("go to exchange")
    // if (currentLang[0] === 'en') {
    //   window.location.href = "/swap"  
    // } else {
    //   window.location.href = `/swap?lang=${currentLang}`
    // }
    // }
    const exchange = store.exchange
    const transfer = store.transfer
    var exchangeLink = constansts.BASE_HOST + "/swap/" + exchange.sourceTokenSymbol.toLowerCase() + "_" + exchange.destTokenSymbol.toLowerCase()
    var transferLink = constansts.BASE_HOST + "/transfer/" + transfer.tokenSymbol.toLowerCase()

    if (currentLang !== "en"){
        exchangeLink += "?lang=" + currentLang
        transferLink += "?lang=" + currentLang
    }


    const translate = getTranslate(store.locale)
    // const tokens = store.tokens.tokens
    // const exchange = store.exchange
    // const ethereum = store.connection.ethereum

    return {
        translate, currentLang, exchangeLink, transferLink,
        page: props.page

    }
})


export default class HeaderTransaction extends React.Component {
    gotoRoot = (e) => {
        if (this.props.currentLang === 'en') {
            window.location.href = "/"
        } else {
            window.location.href = `/?lang=${this.props.currentLang}`
        }
    }


    handleEndSession = () => {
        if (this.props.page === "exchange"){
            this.props.dispatch(openImportAccountExchange())
        }else{
            this.props.dispatch(openImportAccountTransfer())
        }
      }

    render() {
        var transfer = this.props.translate("transaction.transfer") || "Transfer"
        var swap = this.props.translate("transaction.swap") || "Swap"
        return (
            <div>
                <div className="swap-navigation">
                    <div>
                        <a onClick={(e) => this.gotoRoot(e)}>{this.props.translate("home") || "Home"}</a>
                    </div>
                    <div className="seperator">/</div>
                    <div>
                        <a onClick={(e) => this.handleEndSession(e)}>KyberSwap</a>
                    </div>
                    <div className="seperator">/</div>
                    <div className="active">
                        <a>{this.props.page === "exchange" ? swap : transfer}</a>
                    </div>
                </div>
                <h1 class="title frame-tab">
                    <div className="back-home" onClick={(e) => this.handleEndSession(e)}>
                        <img src={require("../../../assets/img/arrow_left.svg")} className="back-arrow" />
                        <span>{this.props.translate("transaction.back") || "Back"}</span>
                    </div>
                    <div className="switch-button">
                        <Link to={this.props.exchangeLink} className={this.props.page === "exchange" ? "disable" : ""}>{swap}</Link>
                        <Link to={this.props.transferLink} className={this.props.page === "transfer" ? "disable" : ""}>{transfer}</Link>
                    </div>
                </h1>
            </div>
        )
    }
}
