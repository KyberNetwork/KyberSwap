import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import { getAssetUrl } from "../../utils/common";
import { Modal } from "../../components/CommonElement"


@connect((store, props) => {

    return {
        account: store.account,
        isOnMobile: store.global.isOnMobile,
        clearSession: props.clearSession,
        screen: props.screen,
        isAdvanceActive: props.isAdvanceActive,
        toggleAdvanceContent: props.toggleAdvanceContent,
        balanceLayout: props.balanceLayout,
        advanceLayout: props.advanceLayout,
        postWithKey: props.postWithKey,
        translate: getTranslate(store.locale)

    }
})

export default class AdvanceAccount extends React.Component {
    constructor() {
        super()
        this.state = {
            isReImport: false
        }
    }

    openReImport = () => {
        this.setState({ isReImport: true })
    }
    closeReImport = () => {
        this.setState({ isReImport: false })
    }

    getWalletName = () => {
        if (this.props.account.walletName === "") {
            switch (this.props.account.type) {
                case "metamask":
                    return "METAMASK"
                case "keystore":
                    return "JSON"
                case "ledger":
                    return "LEDGER"
                case "trezor":
                    return "TREZOR"
                case "privateKey":
                    return "PRIVATE KEY"
                case "promoCode":
                    return "PROMO CODE"
                default:
                    return "WALLET"
            }
        } else {
            return this.props.account.walletName
        }
    }

    getWalletIconName = (type, walletName) => {
        if (walletName === "Promo Code") {
            return "promo_code";
        }
        return type;
    }

    getAccountTypeHtml = (onMobile = false) => {
        return (
            <div className={`import-account__wallet-type ${onMobile ? "mobile" : ""}`}>
                <img className="import-account__wallet-image" src={getAssetUrl(`wallets/${this.getWalletIconName(this.props.account.type, this.props.account.walletName)}.svg`)} />
                <div className="import-account__wallet-content">
                    <span className="import-account__wallet-title">Your Wallet - </span>
                    <span className="import-account__wallet-name">{this.getWalletName()}</span>
                </div>
            </div>
        );
    }

    getContent = () => {
        if (!this.props.isAdvanceActive) return ""
        return (
            <div className={`exchange-account__content ${this.props.isOpenAdvance ? "exchange-account__content--animation" : ""}`}>
                <div className="advance-close" onClick={this.props.toggleAdvanceContent}>
                    <div className="advance-close_wrapper"></div>
                </div>
                {this.props.screen === "swap" ? this.getAccountTypeHtml(true) : ''}
                <div className={`exchange-account__balance exchange-account__content--open`}>{this.props.balanceLayout}</div>
                <div className={`exchange-account__adv-config exchange-account__content--open`}>{this.props.advanceLayout}</div>
            </div>
        )
    }

    getMobileContent = () => {
        return (
            <Modal className={{
                base: 'reveal large advance-modal',
                afterOpen: 'reveal large advance-modal'
            }}
                isOpen={this.props.isAdvanceActive}
                onRequestClose={this.props.toggleAdvanceContent}
                contentLabel="advance modal"
                content={this.getContent()}
                size="large"
            />
        )
    }

    clearSession = () => {
        this.closeReImport()
        this.props.clearSession()
    }
    reImportModal = () => {
        return (
            <div className="reimport-modal">
                <a className="x" onClick={this.closeReImport}>&times;</a>
                <div className="title">{this.props.translate("import.do_you_want_to_connect_other_wallet") || "Do you want to connect other Wallet?"}</div>
                <div className="content">
                    <a className="button confirm-btn" onClick={this.clearSession}>{this.props.translate("import.yes") || "Yes"}</a>
                    <a className="button cancel-btn" onClick={this.closeReImport}>{this.props.translate("import.no") || "No"}</a>
                </div>
            </div>
        )
    }

    componentWillUnmount = () => {
        this.props.clearIsOpenAdvance();
    }

    render() {
        return (
            <div className="exchange-account">
                <div className="exchange-account__wrapper">
                    <div className="exchange-account__container container">
                        {this.props.isOnMobile ? this.getMobileContent() :
                            this.getContent()
                        }
                        {this.props.postWithKey}
                        {!this.props.account.isOnDAPP && <div className={"exchange-account__wrapper--reimport"}>
                            <div className={"reimport-msg"}>
                                <div onClick={this.openReImport}>
                                    {this.props.translate("import.connect_other_wallet") || "Connect other wallet"}
                                </div>
                                <Modal className={{
                                    base: 'reveal tiny reimport-modal',
                                    afterOpen: 'reveal tiny reimport-modal reimport-modal--tiny'
                                }}
                                    isOpen={this.state.isReImport}
                                    onRequestClose={this.closeReImport}
                                    contentLabel="advance modal"
                                    content={this.reImportModal()}
                                    size="tiny"
                                />
                            </div>
                        </div>}

                    </div>
                </div>

            </div>
        )
    }

}