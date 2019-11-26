import React from 'react';
import * as keyService from "./baseKey"
import BLOCKCHAIN_INFO from "../../../../env"
import WalletLink from "walletlink"
import Web3 from "web3"

export default class WalletLinkKey extends React.Component {
    constructor(props) {
        super(props);

        this.walletLink = new WalletLink({
            appName: 'KyberSwap',
            appLogoUrl: 'https://kyberswap.com/app/images/Kyber_Swap_Black.svg'
        });
        this.ethereum = this.walletLink.makeWeb3Provider(BLOCKCHAIN_INFO["connections"]["http"][1]["endPoint"], BLOCKCHAIN_INFO.networkId)
        this.web3 = new Web3(this.ethereum)
    }

    getAddress = () => {
        return new Promise((resolve, reject) => {
            this.ethereum.enable().then((accounts) => {
                resolve(accounts[0])
            }).catch(err => {
                console.log(err)
                reject(err.message)
            })
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
        txParams.gas = txParams.gasLimit
        delete (txParams.gasLimit)

        return new Promise((resolve, reject) => {
            this.web3.eth.sendTransaction(txParams, function (err, transactionHash) {
                if (!err) {
                    resolve(transactionHash)
                } else {
                    console.log(err)
                    reject(err.message)
                }
            })
        })
    }

    async signSignature(message, account) {
        try {                        
            // console.log(account.address)
            var signature = await this.web3.eth.sign(message, account.address)
            console.log(signature)
            return signature
        } catch (err) {
            console.log(err)
            throw err
        }
    }
    
    getWalletName = () => {
        return 'Wallet Link';
    }
}
