import React from "react"
import { connect } from "react-redux"
import BLOCKCHAIN_INFO from "../../../../env"
import * as web3Package from "../../services/web3"
import { getTranslate } from 'react-localize-redux'

import {getWallet} from "../../services/keys"

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
        var wallet = getWallet("walletlink")        
        try {
            var account = await wallet.getAccount()
            console.log(account)
        }catch(err) {
            console.log(err)
        }

    }

    

    render() {
        return (
            <div className="import-account__block theme__import-button" onClick={(e) => this.connect(e)}>
                <div className="import-account__icon walletlink" />
                <div className="import-account__name">WALLETLINK</div>
            </div>
        )
    }
}
