import Web3 from "web3"
import constants from "../../../src/js/services/constants"
import * as ethUtil from 'ethereumjs-util'
import BLOCKCHAIN_INFO from "../../../env"

import baseProviderTestValue from "../../saga/baseProvider.test-value"
import rateTestValue from "../../saga/rate.test-value"

export default class BaseEthereumProvider {

    initContract(){
        this.erc20Contract = new this.rpc.eth.Contract(constants.ERC20)
        this.networkAddress = BLOCKCHAIN_INFO.network
        this.networkContract = new this.rpc.eth.Contract(constants.KYBER_NETWORK, this.networkAddress)
    }
    
    version() {
        return this.rpc.version.api
    }

    getLatestBlock() {
        return Promise.resolve(4931928)
    }

    getBalance(address) {
        return new Promise((resolve, reject) => {
            this.rpc.eth.getBalance(address).then((balance) => {
                if (balance != null) {
                    resolve(balance)
                }
            })
        })
    }

    getNonce(address) {
        return new Promise((resolve, reject) => {
            this.rpc.eth.getTransactionCount(address, "pending").then((nonce) => {
                if (nonce != null) {
                    resolve(nonce)
                }
            })
        })

        
    }

    getTokenBalance(address, ownerAddr) {
        var instance = this.erc20Contract
        instance.options.address = address
        return new Promise((resolve, reject) => {
            instance.methods.balanceOf(ownerAddr).call().then((result) => {
                if (result != null) {
                    resolve(result)
                }
            })
        })

    }

    exchangeData(sourceToken, sourceAmount, destToken, destAddress,
        maxDestAmount, minConversionRate, throwOnFailure) {
        return this.networkContract.methods.trade(
            sourceToken, sourceAmount, destToken, destAddress,
            maxDestAmount, minConversionRate, throwOnFailure).encodeABI()
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

    getRate(source, dest, reserve) {
        return new Promise.resolve(rateTestValue.rate)
    }

    getAllRate(tokensObj, reserve) {
        var promises = Object.keys(tokensObj).map((tokenName) => {
          return Promise.all([
            Promise.resolve(tokenName),
            Promise.resolve(constants.ETH.symbol),
            this.getRate(tokensObj[tokenName].address, constants.ETH.address, reserve.index),
            this.getRate(constants.ETH.address, tokensObj[tokenName].address, reserve.index), 
          ])
        })
        return Promise.all(promises)
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

    countALlEvents(){
        return Promise.resolve(123)
      }

    getLogExchange(currentBlock, range) {
        return new Promise((resolve, rejected) => {
            resolve(Promise.resolve(baseProviderTestValue.exchangeLogs))
        })
      }

      getLogTwoColumn(page, itemPerPage) {
        return Promise.resolve({
            eth: [{
                actualDestAmount: "41010246916709757747",
                actualSrcAmount: "99999999999999999",
                blockNumber: 4931924,
                dest: "0x8ac48aa26a7e25be12a9ddc83f6bbde1594414bb",
                id: 201,
                sender: "0x9f1a678b0079773b5c4f5aa8573132d2b8bcb1e7",
                source: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                status: "mined",
                txHash: "0xfc6976d0b1d0920b7aa3225f61cbda8010dfa0ff8b28dc85c9a9c622f877f7bb"
            },],
            token: [{
                actualDestAmount: "7286277254209250843",
                actualSrcAmount: "3090094699468192493102",
                blockNumber: 4917236,
                dest: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                id: 165,
                sender: "0x9f1a678b0079773b5c4f5aa8573132d2b8bcb1e7",
                source: "0x8ac48aa26a7e25be12a9ddc83f6bbde1594414bb",
                status: "mined",
                txHash: "0x588ec161d036e591bdbde96b4ba809916cc1a565fb64131737d1deba22020fc0",
            }]
        })
      }

      getRateExchange() {
        return new Promise((resolve, rejected) => {
          resolve(Promise.resolve(baseProviderTestValue.exchangeRate))
        })
      }

      getLogOneColumn(page, itemPerPage) {
        return Promise.resolve({
            events: [
                {
                    actualDestAmount: "1238588934297318387",
                    actualSrcAmount: "112736066241914034288",
                    blockNumber: 5181803,
                    dest: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                    id: 545,
                    sender: null,
                    source: "0x1795b4560491c941c0635451f07332effe3ee7b3",
                    status: "mined",
                    timestamp: 1514618168,
                    txHash: "0x7acc54791c136591a8deeb32b2842be507b9624041859574665819e712ae2027"
                },
                {
                    actualDestAmount: "1238588934297318387",
                    actualSrcAmount: "112736066241914034288",
                    blockNumber: 5181803,
                    dest: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                    id: 545,
                    sender: null,
                    source: "0x1795b4560491c941c0635451f07332effe3ee7b3",
                    status: "mined",
                    timestamp: 1514618168,
                    txHash: "0x7acc54791c136591a8deeb32b2842be507b9624041859574665819e712ae2027",
                }
            ]
        })
      }

      getAllRatesFromServer(tokens, reserve) {
        return Promise.resolve([
            {id: 4, source: "ETH", dest: "KNC", rate: "413547223588488151040", expBlock: "20000000000000000000"},
            {id: 5, source: "OMG", dest: "ETH", rate: "10986625448146288", expBlock: "20000000000000000000"},
            {id: 6, source: "ETH", dest: "OMG", rate: "58337873220747280384", expBlock: "20000000000000000000"},
            {id: 7, source: "DGD", dest: "ETH", rate: "150171599878325920", expBlock: "20000000000000000000"},
            {id: 8, source: "ETH", dest: "DGD", rate: "3724785404671197696", expBlock: "20000000000000000000"},
            {id: 9, source: "CVC", dest: "ETH", rate: "279792818458559", expBlock: "20000000000000000000"},
            {id: 10, source: "ETH", dest: "CVC", rate: "1413862421104244293632", expBlock: "20000000000000000000"},
            {id: 11, source: "FUN", dest: "ETH", rate: "56225043573100", expBlock: "20000000000000000000"},
            {id: 12, source: "ETH", dest: "FUN", rate: "16112606216645611880448", expBlock: "20000000000000000000"},
            {id: 13, source: "MCO", dest: "ETH", rate: "18510054747455684", expBlock: "20000000000000000000"}
        ])
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
        return Promise.resolve([
            {symbol: "ETH", price_usd: "779.425"},
            {symbol: "KNC", price_usd: "2.51344"},
            {symbol: "OMG", price_usd: "15.3806"},
            {symbol: "DGD", price_usd: "176.631"},
            {symbol: "CVC", price_usd: "0.866233"},
            {symbol: "FUN", price_usd: "0.0579856"},
            {symbol: "MCO", price_usd: "17.5238"},
            {symbol: "GNT", price_usd: "0.655012"},
            {symbol: "ADX", price_usd: "2.38584"},
            {symbol: "PAY", price_usd: "4.29903"},
            {symbol: "BAT", price_usd: "0.379259"},
            {symbol: "EOS", price_usd: "9.91221"},
            {symbol: "LINK", price_usd: "0.486197"}
        ])
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
}
