import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import { importNewAccount, throwError } from "../../actions/accountActions"
import { Modal } from "../../components/CommonElement"
import QRCode from "qrcode.react"

import { getWallet } from "../../services/keys"



const WalletType = "walletconnect"

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

export default class ImportByWallletConnect extends React.Component {

    constructor() {
        super()
        this.state = {
            isOpen: false,
            qrCode: "",
            wallet: false
        }
    }



    async connect(e) {
        var wallet = this.state.wallet
        try {
            var address = await wallet.getAddress()
            this.setState({                
                isOpen: false                
            })
            this.props.dispatch(importNewAccount(address.toLowerCase(),
                WalletType,
                null,
                this.props.ethereum,
                this.props.tokens, null, null, "Wallet Connect"))
        } catch (err) {
            console.log(err)
        }

    }

    async openQrCode(e) {
        var wallet = getWallet(WalletType)
        try {
            var qrCode = await wallet.requestQrCode()
            this.setState({
                qrCode: qrCode,
                isOpen: true,
                wallet: wallet
            })
            this.connect()
        } catch (err) {
            console.log(err)
        }
    }

    closeModal = () => {
        this.setState({ isOpen: false })
    }

    contentModal = () => {
        return (
            <QRCode value={this.state.qrCode} />
        )
    }

    render() {
        return (
            <div className="import-account__block theme__import-button">
                <div onClick={(e) => this.openQrCode(e)}>
                    <div className="import-account__icon walletconnect" />
                    <div className="import-account__name">WALLET CONNECT</div>
                </div>
                {this.state.isOpen === true && (
                    <Modal
                        className={{
                            base: 'reveal medium qc-modal',
                            afterOpen: 'reveal medium qc-modal'
                        }}
                        isOpen={true}
                        onRequestClose={(e) => this.closeModal()}
                        contentLabel="approve token"
                        content={this.contentModal()}
                        size="medium"
                    />
                )}
            </div>
        )
    }
}
