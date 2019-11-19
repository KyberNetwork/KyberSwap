import React from "react"
import { connect } from "react-redux"

import { importNewAccount, importAccountWallet, throwError } from "../../actions/accountActions"

import { getTranslate } from 'react-localize-redux'

import {getWallet} from "../../services/keys"

import BLOCKCHAIN_INFO from "../../../../env";
import {call} from "redux-saga/effects";
const WalletType = "walletlink"

@connect((store, props) => {
    var tokens = store.tokens.tokens
    var supportTokens = []
    Object.keys(tokens).forEach((key) => {
        supportTokens.push(tokens[key])
    })
    return {
        account: store.account,
        ethereum: store.connection.ethereum,
        tokens: supportTokens,
        translate: getTranslate(store.locale),
        metamask: store.global.metamask,
        screen: props.screen,
        analytics: store.global.analytics
    }
})



export default class ImportByWallletLink extends React.Component {

    async connect(e){
        var wallet = getWallet(WalletType)        
        try {
            var address = await wallet.getAddress()
            this.props.closeParentModal();
            const {translate} = this.props
            const chainId = await new Promise((resolve, reject) => {
                wallet.web3.eth.net.getId((error, result) => {
                    if (error || !result) {
                        console.log(error)
                        var error = new Error("Cannot get network id")
                        reject(error)
                    } else {
                        resolve(result)
                    }
                })
            })
            this.props.dispatch(importAccountWallet(chainId, BLOCKCHAIN_INFO.networkId, address.toLowerCase(),
                WalletType,
                null,
                this.props.ethereum,
                this.props.tokens, translate, null, null, "Wallet Link"))
                
        }catch(err) {
            console.log(err)
            this.props.dispatch(throwError(err))
        }

    }

    

    render() {
        return (
            <div className="import-account__block theme__import-button" onClick={(e) => this.connect(e)}>
                <div className="import-account__icon wallet-link" />
                <div className="import-account__name">WALLET LINK</div>
            </div>
        )
    }
}
