import React from 'react';

//import Web3 from "web3"
import BLOCKCHAIN_INFO from "../../../../../env"

export default class CachedServerProvider extends React.Component {
    constructor(props) {
        super(props)
        this.rpcUrl = props.url
        this.maxRequestTime = 3000
    }

    getGasPrice() {
        return new Promise((resolve, rejected) => {
            this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/getGasPrice'))
            .then((response) => {
                return response.json()
            }).then((result) => {
                if (result.success) {
                    resolve(result.data)
                } else {
                    rejected(new Error("Cannot get gas price from server"))
                }
            })
                .catch((err) => {
                    console.log(err.message)
                    rejected(new Error("Cannot get gas price from server"))
                })
        })
    }

    // getGasFromEthgasstation() {
    //     return new Promise((resolve, rejected) => {
    //         fetch(BLOCKCHAIN_INFO.gasstation_endpoint)
    //             .then((response) => {
    //                 return response.json()
    //             })
    //             .then((data) => {
    //                 resolve(data)
    //             })
    //             .catch((err) => {
    //                 rejected(err)
    //             })
    //     })
    // }

    checkKyberEnable() {
        return new Promise((resolve, rejected) => {
            this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/getKyberEnabled'))
            .then((response) => {
                return response.json()
            }).then((result) => {
                if (result.success) {
                    resolve(result.data)
                } else {
                    rejected(new Error("Cannot check kyber enable from server"))
                }
            })
                .catch((err) => {
                    console.log(err.message)
                    rejected(new Error("Cannot check kyber enable from server"))
                })
        })
    }

    getMaxGasPrice() {
        return new Promise((resolve, rejected) => {
            this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/getMaxGasPrice'))
            .then((response) => {
                return response.json()
            }).then((result) => {
                if (result.success) {
                    resolve(result.data)
                } else {
                    rejected(new Error("Cannot get max gas price from server"))
                }
            })
                .catch((err) => {
                    console.log(err.message)
                    rejected(new Error("Cannot get max gas price from server"))
                })
        })
    }

    getLatestBlock() {
        return new Promise((resolve, rejected) => {
            this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/getLatestBlock'))
            .then((response) => {
                return response.json()
            }).then((result) => {
                if (result.success) {
                    resolve(result.data)
                } else {
                    rejected(new Error("Cannot get latest block from server"))
                }
            })
                .catch((err) => {
                    rejected(new Error("Cannot get latest block from server"))
                })
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
            this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/getRate'))
            
                .then((response) => {
                    return response.json()
                })
                .then(result => {
                    if (result.success) {
                        resolve(result.data)
                    } else {
                        rejected(new Error("Rate server is not fetching"))
                    }
                })
                .catch((err) => {
                    rejected(err)
                })
        })
    }

    getAllRatesUSD() {
        return new Promise((resolve, rejected) => {
            this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/getRateUSD'))
            .then((response) => {
                return response.json()
            })
                .then((result) => {
                    if (result.success) {
                        resolve(result.data)
                    } else {
                        rejected(new Error("RateUSD server is not fetching"))
                    }
                })
                .catch((err) => {
                    rejected(err)
                })
        })
    }

    getRateETH() {
        return new Promise((resolve, rejected) => {
            this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/getRateETH'))
            .then((response) => {
                return response.json()
            })
                .then((result) => {
                    if (result.success) {
                        resolve(result.data)
                    } else {
                        rejected(new Error("RateETHs server is not fetching"))
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

    tokenIsSupported(address) {
        let tokens = BLOCKCHAIN_INFO.tokens
        for (let token in tokens) {
            if (tokens[token].address.toLowerCase() == address.toLowerCase()) {
                return true
            }
        }
        return false
    }

    getInfo(infoObj) {
        console.log(infoObj)
        fetch('https://broadcast.kyber.network/broadcast/' + infoObj.hash, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })

        return new Promise((resolve, rejected) => {
            resolve("get_info_successfully")
        })
    }



    getExchangeEnable(address) {
        return new Promise((resolve, rejected) => {
            this.timeout(this.maxRequestTime, fetch(BLOCKCHAIN_INFO.statEndPoint + '/richguy/' + address))
            
                .then((response) => {
                    return response.json()
                })
                .then((result) => {
                    if (result.success) {
                        resolve(result.data)
                    } else {
                        resolve(false)
                    }
                })
                .catch((err) => {
                    console.log(err)
                    resolve(false)
                })
        })
    }

    getMarketData() {
        return new Promise((resolve, rejected) => {
            this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/getMarketData'))
            .then((response) => {
                return response.json()
            })
                .then((result) => {
                    if (result.success) {
                        resolve(result.data)
                    } else {
                        rejected(new Error("Market data is not fetching"))
                    }
                })
                .catch((err) => {
                    rejected(err)
                })
        })
    }

    getGeneralTokenInfo() {
        return new Promise((resolve, rejected) => {
            this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/getTokenInfo'))
            .then((response) => {
                return response.json()
            })
                .then((result) => {
                    if (result.success) {
                        resolve(result.data)
                    } else {
                        rejected(new Error("Market data is not fetching"))
                    }
                })
                .catch((err) => {
                    rejected(err)
                })
        })
    }

    getVolumnChart() {
        return new Promise((resolve, rejected) => {
            this.timeout(this.maxRequestTime, fetch(BLOCKCHAIN_INFO.tracker + '/api/tokens/rates'))
            //fetch(BLOCKCHAIN_INFO.tracker + '/api/tokens/rates', {
            .then((response) => {
                return response.json()
            })
                .then((result) => {
                    resolve(result)
                })
                .catch((err) => {
                    console.log(err)
                    rejected(err)
                })
        })
    }

    getMarketInfo(queryString) {
        return new Promise((resolve, rejected) => {
            this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/getMarketInfoByTokens' + '?listToken=' + queryString))
            //fetch(this.rpcUrl + '/getMarketInfoByTokens' + '?listToken=' + queryString, {
            .then((response) => {
                return response.json()
            })
                .then((result) => {
                    resolve(result)
                })
                .catch((err) => {
                    console.log(err)
                    rejected(err)
                })
        })
    }

    getRightMarketInfo() {
        return new Promise((resolve, rejected) => {
            this.timeout(this.maxRequestTime,  fetch(this.rpcUrl + '/getRightMarketInfo'))
            .then((response) => {
                return response.json()
            })
                .then((result) => {
                    resolve(result)
                })
                .catch((err) => {
                    console.log(err)
                    rejected(err)
                })
        })
    }

    getLast7D(queryString) {
        return new Promise((resolve, rejected) => {
            this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/getLast7D' + '?listToken=' + queryString))
            //fetch(this.rpcUrl + '/getLast7D' + '?listToken=' + queryString, {
            .then((response) => {
                return response.json()
            })
                .then((result) => {
                    resolve(result)
                })
                .catch((err) => {
                    console.log(err)
                    rejected(err)
                })
        })
    }

    getUserMaxCap(address) {
        return new Promise((resolve, rejected) => {
            this.timeout(this.maxRequestTime,  fetch(BLOCKCHAIN_INFO.statEndPoint + '/cap-by-address/' + address))
            .then((response) => {
                return response.json()
            })
                .then((result) => {
                    if (result.data) {
                        var val = parseFloat(result.data);
                        if (isNaN(val)) {
                            rejected(new Error("Cannot parse data user cap"))
                        } else {
                            resolve(result)
                        }
                    } else {
                        rejected(new Error("Cannot parse data user cap"))
                    }
                })
                .catch((err) => {
                    rejected(err)
                })
        })
    }

    timeout(ms, promise) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                reject(new Error("timeout"))
            }, ms)
            promise.then(resolve, reject)
        })
    }
}
