import React from 'react';
import * as keyService from "./baseKey"
import WalletConnect from "@walletconnect/browser";

export default class WalletConnectKey extends React.Component {
    constructor(props) {
        super(props);

        this.walletConnector = new WalletConnect({
            bridge: "https://bridge.walletconnect.org" // Required
        });

        this.address = null;
    }

    getDisconnected = () => {
        return this.subscribeToDisconnect();
    };

    clearSession = () => {
        this.walletConnector.killSession()
    };

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
            } else {
                const uri = this.walletConnector.uri;
                resolve(uri)
            }
        })
    }

    getAddress = () => {
        return this.address;
    }
    
    getChainId = () => {
        const onConnect = this.subscribeToConnect();
        const onDisconnect = this.subscribeToDisconnect();
        return Promise.race([onConnect, onDisconnect]);
    };
    
    subscribeToConnect = () => {
        return new Promise((resolve, reject) => {
            this.walletConnector.on("connect", (error, payload) => {
                if (error) {
                    reject(error);
                    return
                }
            
                const { accounts, chainId } = payload.params[0];
            
                this.address = accounts[0];
            
                resolve(chainId)
            });
        })
    };
    
    subscribeToDisconnect = () => {
        return new Promise((resolve, reject) => {
            this.walletConnector.on("disconnect", (error) => {
                if (error) {
                    reject(error);
                    return;
                }
        
                resolve(true);
            })
        });
    };

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
    
    getWalletName = () => {
        return 'Wallet Connect';
    }
    
    getMetaName = () => {
        return 'Wallet Connect';
    }
}
