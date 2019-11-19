import React from 'react';

import * as keyService from "./baseKey"
// import BLOCKCHAIN_INFO from "../../../../env"
// import WalletLink from "walletlink"
// import Web3 from "web3"


import WalletConnect from "@walletconnect/browser";
// import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";


export default class WalletConnectKey extends React.Component {

    constructor(props) {
        super(props);

        this.walletConnector = new WalletConnect({
            bridge: "https://bridge.walletconnect.org" // Required
        });

    }

    getDisconnected = () => {
        return new Promise((resolve, reject) => {
            this.walletConnector.on("disconnect", (error, payload) => {
                if (error) {
                    console.log(error)
                }
                resolve(true)
                // Delete walletConnector            
            })
        })

    }

    clearSession = () => {
        this.walletConnector.killSession()
    }

    requestQrCode = () => {
        return new Promise((resolve, reject) => {
            if (!this.walletConnector.connected) {
                this.walletConnector.createSession().then(() => {
                    // get uri for QR Code modal
                    const uri = this.walletConnector.uri;
                    resolve(uri)
                }).catch(err => {
                    console.log(err)
                    reject(err)
                })
            }else{
                const uri = this.walletConnector.uri;
                resolve(uri)
            }
        })
    }

    getAddress = () => {
        // if (!this.walletConnector.connected) {
        //     this.walletConnector.createSession().then(() => {
        //         // get uri for QR Code modal
        //         const uri = this.walletConnector.uri;
        //         console.log(uri)
        //         // display QR Code modal
        //         WalletConnectQRCodeModal.open(uri, () => {
        //             console.log("QR Code Modal closed");
        //         });
        //     });
        // }

        return new Promise((resolve, reject) => {
            // Subscribe to connection events
            this.walletConnector.on("connect", (error, payload) => {
                if (error) {
                    reject(error)
                    return
                }

                // Close QR Code Modal
                // WalletConnectQRCodeModal.close();

                // Get provided accounts and chainId
                const { accounts, chainId } = payload.params[0];
                resolve({address: accounts[0], chainId: chainId})

            });
        })
    }

    async broadCastTx(funcName, ...args) {
        try {
            var txHash = await this.callSignTransaction(funcName, ...args)
            return txHash
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    callSignTransaction = (funcName, ...args) => {
        return new Promise((resolve, reject) => {
            keyService[funcName](...args).then(result => {
                const { txParams, keystring, password } = result
                this.sealTx(txParams, keystring, password).then(result => {
                    resolve(result)
                }).catch(e => {
                    console.log(e.message)
                    reject(e)
                })
            })
        })
    }

    sealTx = (txParams, keystring, password) => {
        return new Promise((resolve, reject) => {
            this.walletConnector.sendTransaction(txParams).then(transactionHash => {
                // Returns transaction id (hash)
                resolve(transactionHash)
            }).catch(err => {
                console.log(err)
                reject(err.message)
            })
        })
    }

    async signSignature(message, account) {
        try {
            var signature = await this.walletConnector.signPersonalMessage([message, account.address])
            return signature
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}
