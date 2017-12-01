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
}
