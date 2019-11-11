import React from 'react';

import * as keyService from "./baseKey"
import BLOCKCHAIN_INFO from "../../../../env"
import WalletLink from "walletlink"

export default class WalletLinkKey extends React.Component {

    constructor(props) {
        super(props);

        const APP_NAME = "My Awesome App"
        const APP_LOGO_URL = "https://example.com/logo.png"

        this.walletLink = new WalletLink({
            appName: APP_NAME,
            appLogoUrl: APP_LOGO_URL
        })

        this.ethereum = this.walletLink.makeWeb3Provider(BLOCKCHAIN_INFO["connections"]["http"][1]["endPoint"], BLOCKCHAIN_INFO.networkId)


    }


    getAccount = () => {
        return new Promise((resolve, reject) => {
            this.ethereum.enable().then((accounts) => {
                resolve(accounts[0])
            }).catch(err => {
                console.log(err)
                reject(err)
            })
        })
    }
}
