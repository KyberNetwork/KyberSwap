import React from 'react';

import Web3 from "web3"
import BLOCKCHAIN_INFO from "../../../../../env"

export default class CachedServerProvider extends React.Component {
    constructor(props) {
        super(props)
        this.rpcUrl = props.url        
    }

    getGasPrice() {
        return new Promise((resolve, reject) => {
            reject(new Error("This api /getGasPrice will coming soon"))
        })
    }

    getLatestBlock() {
        return new Promise((resolve, rejected) => {
            fetch(this.rpcUrl + '/getLatestBlock', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                return response.json()
            }).then((data) => {
                if (data.success) {
                    resolve(data)
                } else {
                    rejected(new Error("Cannot get latest block from server"))
                }
            })
                .catch((err) => {
                    rejected(new Error("Cannot get latest block from server"))
                })
        })
    }


    getMaxCap(address, blockno) {
        return new Promise((resolve, reject) => {
            reject(new Error("This api /getMaxCap will coming soon"))
        })
    }

    checkKyberEnable() {
        return new Promise((resolve, reject) => {
            reject(new Error("This api /checkKyberEnable will coming soon"))
        })
    }

    getLog() {
        return new Promise((resolve, rejected) => {
            fetch(this.rpcUrl + '/getHistoryOneColumn', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
            })
                .then((response) => {
                    return response.json()
                })
                .then((result) => {
                    if (result.success) {
                        var data = result.data.filter(item => {
                            return (this.tokenIsSupported(item.dest) && this.tokenIsSupported(item.source))
                        })
                        resolve(data)
                    } else {
                        rejected(new Error("Events in server not fetching"))
                    }
                })
                .catch((err) => {
                    console.log(err.message)
                    rejected(new Error("Cannot get events from server"))
                })
        })
    }


    getAllRates(tokensObj) {
        return new Promise((resolve, rejected) => {
            fetch(this.rpcUrl + '/getRate', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
            })
            .then((response) => {
                return response.json()
            })
                .then(result =>  {
                    if(result.success){
                        resolve(result.data)
                    }else{
                        rejected(new Error ("Rate server is not fetching"))
                    }      
                })
                .catch((err) => {
                    rejected(err)
                })
        })
    }

    getAllRatesUSD() {
        return new Promise((resolve, rejected) => {
            fetch(this.rpcUrl + '/getRateUSD', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
            }).then((response) => {
                return response.json()
            })
                .then( (result) => {
                    if(result.success){
                        resolve(result.data)
                    }else{
                        rejected(new Error("RateUSD server is not fetching"))
                    }  
                })
                .catch((err) => {
                    rejected(err)
                })
        })
    }

    getLanguagePack(lang) {
        return new Promise((resolve, rejected) => {
            rejected(new Error("This api /getLanguagePack will comming soon"))
        })
    }

    getMaxGasPrice() {
        return new Promise((resolve, reject) => {
            reject(new Error("This api /getMaxGasPrice will coming soon"))
        })
    }





    getGasFromEthgasstation() {
        return new Promise((resolve, rejected) => {
            fetch(BLOCKCHAIN_INFO.gasstation_endpoint)
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    resolve(data)
                })
                .catch((err) => {
                    rejected(err)
                })
        })
    }

    tokenIsSupported(address) {
        let tokens = BLOCKCHAIN_INFO.tokens
        for (let token in tokens) {
            if (tokens[token].address.toLowerCase() == address.toLowerCase()) {
                return true
            }
        }
        return false
    }
}
