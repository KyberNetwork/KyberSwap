import React from 'react';
import BLOCKCHAIN_INFO from "../../../../../env"
import * as constants from "../../constants"
import {isUserLogin} from "../../../utils/common"
import * as converters from "../../../utils/converter";

export default class CachedServerProvider extends React.Component {
  constructor(props) {
    super(props)
    this.rpcUrl = props.url
    this.maxRequestTime = constants.CONNECTION_TIMEOUT
  }

  getGasPrice() {
    return new Promise((resolve, rejected) => {
      this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/gasPrice'))
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

  getGasLimit(srcTokenAddress, destTokenAddress, srcAmount) {
    if (!srcAmount) srcAmount = 0;

    return new Promise((resolve, rejected) => {
      this.timeout(this.maxRequestTime, fetch( `${BLOCKCHAIN_INFO.tracker}/gas_limit?source=${srcTokenAddress}&dest=${destTokenAddress}&amount=${srcAmount}`))
        .then((response) => {
          resolve(response.json())
        })
        .catch((err) => {
          rejected(err)
        })
    })
  }

  checkKyberEnable() {
    return new Promise((resolve, rejected) => {
      this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/kyberEnabled'))
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
      this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/maxGasPrice'))
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
      this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/latestBlock'))
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

  getAllRates(tokensObj) {
    return new Promise((resolve, rejected) => {
      this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/rate'))

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

  getSourceAmount(sourceTokenSymbol, destTokenSymbol, destAmount) {
    return new Promise((resolve, reject) => {
      this.timeout(this.maxRequestTime, fetch(`${this.rpcUrl}/sourceAmount?source=${sourceTokenSymbol}&dest=${destTokenSymbol}&destAmount=${destAmount}`))
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (result.success) {
            resolve(result.value);
          } else {
            reject(new Error("Cannot get source amount"));
          }
        })
        .catch((err) => {
          reject(err);
        });
    })
  }

  getAllRatesUSD() {
    return new Promise((resolve, rejected) => {
      this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/rateUSD'))
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
      this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/rateETH'))
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

  getInfo(infoObj) {
    if (isUserLogin()) {
      var params = {tx_hash: infoObj.txHash}
      fetch("/api/transactions", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      })
    } else {
      fetch(BLOCKCHAIN_INFO.broadcastTx + 'broadcast/' + infoObj.txHash, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
    }

    return new Promise((resolve, rejected) => {
      resolve("get_info_successfully")
    })
  }

  getMarketData() {
    return new Promise((resolve, rejected) => {
      this.timeout(this.maxRequestTime, fetch(BLOCKCHAIN_INFO.tracker + '/pairs/market'))
        .then((response) => {
          return response.json()
        })
        .then((result) => {
          resolve(result.data)
        })
        .catch((err) => {
          rejected(err)
        })
    })
  }

  getLast7D(queryString) {
    return new Promise((resolve, rejected) => {
      this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/getLast7D' + '?listToken=' + queryString))
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
    if (isUserLogin()){
      return new Promise((resolve, rejected) => {
        this.timeout(this.maxRequestTime, fetch("/api/user_stats"))
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
    } else {
      return new Promise((resolve, rejected) => {
        this.timeout(this.maxRequestTime, fetch(this.rpcUrl + '/users?address=' + address))
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
  }

  getTokenPrice(symbol){
    return new Promise((resolve, rejected) => {
      this.timeout(this.maxRequestTime,
        fetch(BLOCKCHAIN_INFO.tracker + "/token_price?currency=ETH"))
        .then(response => response.json())
        .then((result) => {
          for (var i = 0; i < result.data.length; i++){
            if (result.data[i].symbol == symbol){
              resolve(converters.toTWei(result.data[i].price))
              return
            }
          }
          resolve(0)
        })
        .catch((err) => {
          console.log(err)
          rejected(new Error(`Cannot get init token price: ${err.toString}`))
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
