import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import {getWallet} from "../../services/keys"
import * as actions from '../../actions/accountActions'

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

    async connect(e) {
        var wallet = getWallet(WalletType);
        try {
            const address = await wallet.getAddress()
            this.props.closeParentModal();
    
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
        } catch(err) {
            console.log(err)
            this.props.dispatch(actions.throwError(err))
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
