import React from "react"
import { connect } from "react-redux"

import { getTranslate } from 'react-localize-redux'

import {getWallet} from "../../services/keys"

import BLOCKCHAIN_INFO from "../../../../env";
import {call} from "redux-saga/effects";
import * as actions from '../../actions/accountActions'
import {findNetworkName} from "../../utils/converter";
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
            const chainId = await wallet.getChainId()
            const networkId = BLOCKCHAIN_INFO.networkId
            this.errorHandling(chainId, networkId, () => {
                this.props.dispatch(actions.importNewAccount(
                  address.toLowerCase(),
                  WalletType,
                  null,
                  this.props.ethereum,
                  this.props.tokens,
                  null,
                  null,
                  "Wallet Link"
                ))
            })
        }catch(err) {
            console.log(err)
            this.props.dispatch(actions.throwError(err))
        }

    }

    errorHandling = (chainId, networkId, f) => {
        const {translate} = this.props
        try {
            const currentId = chainId
            if (parseInt(currentId, 10) !== networkId) {
                var currentName = findNetworkName(parseInt(currentId, 10))
                var expectedName = findNetworkName(networkId)
                if (currentName) {
                    this.props.dispatch(actions.throwError(translate("error.network_not_match_wallet_link", { currentName: currentName, expectedName: expectedName }) || "Network is not match"))
                    return
                } else {
                    this.props.dispatch(actions.throwError(translate("error.network_not_match_unknow_wallet_link", { expectedName: expectedName }) || "Network is not match"))
                    return
                }
            }
            f();
        } catch (e) {
            console.log(e)
            this.props.dispatch(actions.throwError( "Cannot get wallet account."))
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
