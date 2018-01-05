import Web3 from "web3"
import constants from "../constants"
import * as ethUtil from 'ethereumjs-util'
import BLOCKCHAIN_INFO from "../../../../env"
import axios from 'axios'

export default class BaseEthereumProvider {

  initContract() {
    this.erc20Contract = new this.rpc.eth.Contract(constants.ERC20)
    this.networkAddress = BLOCKCHAIN_INFO.network
    this.networkContract = new this.rpc.eth.Contract(constants.KYBER_NETWORK, this.networkAddress)
  }

  version() {
    return this.rpc.version.api
  }

  getGasPrice() {
    return new Promise((resolve, reject) => {
      this.rpc.eth.getGasPrice()
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  isConnectNode() {
    return new Promise((resolve, reject) => {
      this.rpc.eth.getBlock("latest", false).then((block) => {
        if (block != null) {
          resolve(true)
        } else {
          resolve(false)
        }
      }).catch((errr) => {
        resolve(false)
      })
    })
    // return new Promise((resolve, reject) => {
    //   this.rpc.version.getEthereum().then((result) => {
    //     resolve(true)
    //   }).catch((err) => {
    //     resolve(false)
    //   })
    // })
  }

  getLatestBlock() {
    return new Promise((resolve, rejected) => {
      fetch(BLOCKCHAIN_INFO.history_endpoint + '/getLatestBlock', {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json()
      }).then((data) => {
        if (data && typeof data == 'number' && data > 0) {
          resolve(data)
        } else {
          throw ('cannot get lastest block from server')
        }
      })
        .catch((err) => {
          this.rpc.eth.getBlock("latest", false).then((block) => {
            if (block != null) {
              resolve(block.number)
            }
          })
        })
    })

  }

  getBalance(address) {
    return new Promise((resolve, reject) => {
      this.rpc.eth.getBalance(address)
        .then((balance) => {
          if (balance != null) {
            resolve(balance)
          }
        })
        .catch((err) => {
          console.log(err)
          reject(err)
        })
    })
  }

  getAllBalancesToken(address, tokens) {
    var promises = Object.keys(tokens).map(index => {
      var token = tokens[index]
      if (token.symbol === 'ETH') {
        return new Promise((resolve, reject) => {
          this.getBalance(address).then(result => {
            resolve({
              symbol: 'ETH',
              balance: result
            })
          }).catch(err => {
            reject(new Error("Cannot get balance of ETH"))
          })
        })

      } else {
        return new Promise((resolve, reject) => {
          this.getTokenBalance(token.address, address).then(result => {
            resolve({
              symbol: token.symbol,
              balance: result
            })
          }).catch(err => {
            reject(new Error("Cannot get balance of " + token.symbol))
          })
        })
      }
    })
    return Promise.all(promises)
  }

  getMaxCap(address){
    return new Promise((resolve, reject) => {
      this.networkContract.methods.getUserCapInWei(address).call()
        .then((result) => {
          if (result != null) {
            console.log(result)
            resolve(result)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  getNonce(address) {
    return new Promise((resolve, reject) => {
      this.rpc.eth.getTransactionCount(address, "pending")
        .then((nonce) => {
          //console.log(nonce)
          if (nonce != null) {
            resolve(nonce)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })


  }

  getTokenBalance(address, ownerAddr) {
    var instance = this.erc20Contract
    instance.options.address = address
    return new Promise((resolve, reject) => {
      instance.methods.balanceOf(ownerAddr).call()
        .then((result) => {
          if (result != null) {
            resolve(result)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })

  }

  estimateGas(txObj){
    return new Promise((resolve, reject) => {
      this.rpc.eth.estimateGas(txObj)
        .then((result) => {
          if (result != null) {
            resolve(result)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  exchangeData(sourceToken, sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate, walletId) {
    return this.networkContract.methods.trade(
      sourceToken, sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate, walletId).encodeABI()
  }

  approveTokenData(sourceToken, sourceAmount) {
    var tokenContract = this.erc20Contract
    tokenContract.options.address = sourceToken
    return tokenContract.methods.approve(this.networkAddress, sourceAmount).encodeABI()
  }

  sendTokenData(sourceToken, sourceAmount, destAddress) {
    var tokenContract = this.erc20Contract
    tokenContract.options.address = sourceToken
    return tokenContract.methods.transfer(destAddress, sourceAmount).encodeABI()
  }

  getAllowance(sourceToken, owner) {
    var tokenContract = this.erc20Contract
    tokenContract.options.address = sourceToken
    return new Promise((resolve, reject) => {
      tokenContract.methods.allowance(owner, this.networkAddress).call().then((result) => {
        if (result !== null) {
          resolve(result)
        }
      })
    })
  }

  getDecimalsOfToken(token) {
    var tokenContract = this.erc20Contract
    tokenContract.options.address = token
    return new Promise((resolve, reject) => {
      tokenContract.methods.decimals().call().then((result) => {
        if (result !== null) {
          resolve(result)
        }
      })
    })
  }

  txMined(hash) {
    return new Promise((resolve, reject) => {
      this.rpc.eth.getTransactionReceipt(hash).then((result) => {
        if (result != null) {
          resolve(result)
        }
      })
    })

  }

  getRate(source, dest, quantity) {
    return new Promise((resolve, reject) => {
      this.networkContract.methods.getExpectedRate(source, dest, quantity).call()
        .then((result) => {
          if (result != null) {
            resolve(result)
          }
        })
        .catch((err) => {
          // console.log(err)
          reject(err)
        })
    })
  }

  sendRawTransaction(tx) {
    return new Promise((resolve, rejected) => {
      this.rpc.eth.sendSignedTransaction(
        ethUtil.bufferToHex(tx.serialize()), (error, hash) => {
          if (error != null) {
            rejected(error)
          } else {
            resolve(hash)
          }
        })
    })
  }

  getLogTwoColumn(page, itemPerPage) {
    return new Promise((resolve, rejected) => {
      fetch(BLOCKCHAIN_INFO.history_endpoint + '/getHistoryTwoColumn', {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
      })
        .then((response) => {
          return response.json()
        })
        // .then((data) => {
        //   for (let key in data) {
        //     data[key] = data[key].filter(item => {
        //       return (this.tokenIsSupported(item.dest)
        //         && this.tokenIsSupported(item.source))
        //     })
        //   }
        //   resolve(data);
        // })
        .catch((err) => {
          console.log(err)
        })
    })
  }

  getLogOneColumn(page, itemPerPage) {
    return new Promise((resolve, rejected) => {
      fetch(BLOCKCHAIN_INFO.history_endpoint + '/getHistoryOneColumn', {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
      })
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          for (let key in data) {
            data[key] = data[key].filter(item => {
              return (this.tokenIsSupported(item.dest)
                && this.tokenIsSupported(item.source))
            })
          }
          resolve(data);
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }


  getAllRatesFromServer(tokens) {
    return new Promise((resolve, rejected) => {
      fetch(BLOCKCHAIN_INFO.history_endpoint + '/getRate', {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
      })
        .then(function (response) {
          if (response.status == 404) {
            rejected(err)
          } else {
            resolve(response.json())
          }
        })
        .catch((err) => {
          rejected(err)
        })
    })
  }

  tokenIsSupported(address) {
    let tokens = BLOCKCHAIN_INFO.tokens
    for (let token in tokens) {
      if (tokens[token].address == address) {
        return true
      }
    }
    return false
  }

  getAllRatesUSDFromServer() {
    return new Promise((resolve, rejected) => {
      fetch(BLOCKCHAIN_INFO.history_endpoint + '/getRateUSD', {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
      })
        .then(function (response) {
          if (response.status == 404) {
            rejected(err)
          } else {
            resolve(response.json())
          }
        })
        .catch((err) => {
          rejected(err)
        })
    })
  }

  getAllRatesUSDFromThirdParty() {
    //get from third party api
    var promises = Object.keys(BLOCKCHAIN_INFO.tokens).map(key => {
      var token = BLOCKCHAIN_INFO.tokens[key]
      var url = BLOCKCHAIN_INFO.api_usd + '/v1/ticker/' + token.usd_id + "/"
      return new Promise(resolve => {
        axios.get(url)
          .then(function (response) {
            if (response.status === 200) {
              return resolve({
                symbol: key,
                price_usd: response.data[0].price_usd
              })
            } else {
              console.log(response)
              return resolve({
                symbol: key,
                price_usd: 0
              })
            }
          })
          .catch(function (error) {
            console.log(error)
            return resolve({
              symbol: key,
              price_usd: 0
            })
          });
      })
    })
    return Promise.all(promises)
  }

  getLanguagePack(lang) {
    return new Promise((resolve, rejected) => {
      fetch(BLOCKCHAIN_INFO.history_endpoint + '/getLanguagePack?lang=' + lang).then(function (response) {
        resolve(response.json())
      }).catch((err) => {
        rejected(err)
      })
    })
  }

  getAllRatesFromBlockchain(tokens) {
    var ratePromises = []
    var tokenObj = BLOCKCHAIN_INFO.tokens
    Object.keys(tokenObj).map((tokenName) => {
      ratePromises.push(Promise.all([
        Promise.resolve(tokenName),
        Promise.resolve(constants.ETH.symbol),
        this.getRate(tokenObj[tokenName].address, constants.ETH.address, '0x0')
      ]))
      ratePromises.push(Promise.all([
        Promise.resolve(constants.ETH.symbol),
        Promise.resolve(tokenName),
        this.getRate(constants.ETH.address, tokenObj[tokenName].address, '0x0')
      ]))
    })
    return Promise.all(ratePromises)
      .then((arrayRate) => {
        var arrayRateObj = arrayRate.map((rate) => {
          return {
            source: rate[0],
            dest: rate[1],
            rate: rate[2].expectedPrice,
            minRate: rate[2].slippagePrice
            // expBlock: rate[2].expBlock,
            // balance: rate[2].balance
          }
        })
        return arrayRateObj
      })
      .catch((err) => {
        console.log(err)
        // return Promise.reject(err)
      })
  }
}
