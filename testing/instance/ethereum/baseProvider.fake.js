import Web3 from "web3"
import constants from "../../../src/js/services/constants"
import * as ethUtil from 'ethereumjs-util'
import BLOCKCHAIN_INFO from "../../../env"

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
        return new Promise((resolve, reject) => {
            this.rpc.eth.getBlock("latest", false).then((block) => {
                if (block != null) {
                    resolve(block.number)
                }
            })
        })
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
        return new Promise((resolve, reject) => {
            this.networkContract.methods.getRate(source, dest, reserve).call().then((result) => {
                if (result != null) {
                    resolve(result)
                }
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

    getLogExchange(currentBlock, range) {
        return new Promise((resolve, rejected) => {
          // var cachedRange = constants.HISTORY_EXCHANGE.cached.range 
          // var startBlock = (latestBlock - currentBlock) > cachedRange ? 
          //                                               (latestBlock - cachedRange):
          //                                               currentBlock
          //console.log(startBlock)         
          var startBlock = currentBlock > range? currentBlock - range: 0
          this.networkContract.getPastEvents('Trade', {
            filter: {status: "mined"},
            fromBlock: startBlock,
            toBlock: currentBlock
          }, )
            .then(function (events) {
              //console.log(events)
              resolve(events)          
            })
        })
      }
}
