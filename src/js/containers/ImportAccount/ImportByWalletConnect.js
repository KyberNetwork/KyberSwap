import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import {importAccountWallet, importNewAccount, throwError} from "../../actions/accountActions"
import {FeeDetail, Modal} from "../../components/CommonElement"
import QRCode from "qrcode.react"

import { getWallet } from "../../services/keys"
import BLOCKCHAIN_INFO from "../../../../env";


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
            var {address, chainId} = await wallet.getAddress()

            this.setState({                
                isOpen: false                
            })
            this.props.closeParentModal();
            this.closeModal();

            const {translate} = this.props
            this.props.dispatch(importAccountWallet(1, BLOCKCHAIN_INFO.networkId, address.toLowerCase(),
              WalletType,
              null,
              this.props.ethereum,
              this.props.tokens, translate, null, null, "Wallet Connect"))

            // this.props.dispatch(importNewAccount(address.toLowerCase(),
            //     WalletType,
            //     null,
            //     this.props.ethereum,
            //     this.props.tokens, translate, null, null, "Wallet Connect"))
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
          <div className="wallet-connect-qr p-a-20px import-promocode">
              <div>
                  <div className="title">Scan QR code</div>
                  <a className="x" onClick={(e) => {this.props.closeParentModal();this.closeModal()}}>&times;</a>
                  <div className="content with-overlap">
                      <div className="row">
                          <QRCode size={300} value={this.state.qrCode} />
                      </div>
                      <div className="message">
                          <div><span className={"theme__background-3"}>1</span> {`Open compatible wallet app`}</div>
                          <div><span className={"theme__background-3"}>2</span> {`Find and open the QR scanner`}</div>
                          <div><span className={"theme__background-3"}>3</span> {`Scan this QR code`}</div>
                      </div>
                  </div>
              </div>
          </div>
        )
    }

    render() {
        return (
            <div>
                <div className="import-account__block theme__import-button" onClick={(e) => this.openQrCode(e)}>
                    <div className="import-account__icon wallet-connect" />
                    <div className="import-account__name">WALLET CONNECT</div>
                </div>
                {this.state.isOpen === true && (
                  <Modal
                    className={{
                        base: 'reveal tiny',
                        afterOpen: 'reveal tiny'
                    }}
                    isOpen={true}
                    onRequestClose={(e) => {this.props.closeParentModal();this.closeModal()}}
                    contentLabel="approve token"
                    content={this.contentModal()}
                    size="medium"
                  />
                )}
            </div>
        )
    }
}
