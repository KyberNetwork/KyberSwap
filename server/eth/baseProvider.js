

var Web3 = require("web3")
var constants = require("../../src/js/services/constants")
var ethUtil = require('ethereumjs-util')
var BLOCKCHAIN_INFO = require("../../env")
const https = require("https")
const request = require('request');

class BaseEthereumProvider {
  constructor() {

  }
  initContract() {
    this.erc20Contract = new this.rpc.eth.Contract(constants.ERC20)
    this.networkAddress = BLOCKCHAIN_INFO.network
    this.wrapperAddress = BLOCKCHAIN_INFO.wrapper
    this.networkContract = new this.rpc.eth.Contract(constants.KYBER_NETWORK, this.networkAddress)
    this.wrapperContract = new this.rpc.eth.Contract(constants.KYBER_WRAPPER, this.wrapperAddress)
  }

  version() {
    return this.rpc.version.api
  }

  getLatestBlock() {
    // return new Promise((resolve, reject) => {
    //   this.rpc.eth.getBlock("latest", false).then((block) => {
    //     if (block != null) {
    //       resolve(block.number)
    //     }
    //   })
    // })
    var serverPoint = BLOCKCHAIN_INFO.server_logs.url
    var api = BLOCKCHAIN_INFO.server_logs.api_key

    //var url = `${serverPoint}/api?module=proxy&action=eth_blockNumber&apikey=${api}`

    var options = {
      host: serverPoint,
      path: `/api?module=proxy&action=eth_blockNumber&apikey=${api}`
    }

    return new Promise((resolve, rejected) => {
      https.get(options, res => {
        //console.log(res)
        var statusCode = res.statusCode;
        if (statusCode != 200) {
          console.log("non-200 response status code:")
          console.log(res.statusCode)
          console.log("for url:")
          console.log(serverPoint)
          resolve(0);
          return
        }

        res.setEncoding("utf8");
        let body = ""
        res.on("data", data => {
          body += data
        })
        res.on("end", () => {
          try {
            body = JSON.parse(body)
            var blockNumber = this.rpc.eth.abi.decodeParameters(['uint256'], body.result)
            resolve(blockNumber['0'])
          } catch (e) {
            console.log(e)
            resolve(0)
          }

        })
        res.on("error", function () {
          console.log("GET request error")
          resolve(0)
        })
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
        //console.log(nonce)
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

          resolve(blockNumber)
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

  getRate(source, dest, quantity) {
    return new Promise((resolve, reject) => {
      this.networkContract.methods.getExpectedRate(source, dest, quantity).call().then((result) => {
        if (result != null) {
          resolve(result)
        }
      })
    })
  }

  getAllRate(sources, dests, quantity){
    var serverPoint = BLOCKCHAIN_INFO.server_logs.url
    var api = BLOCKCHAIN_INFO.server_logs.api_key

    var dataAbi = this.wrapperContract.methods.getExpectedRates(this.networkAddress, sources, dests, quantity).encodeABI()
    var options = {
      host: serverPoint,
      path: `/api?module=proxy&action=eth_call&to=${this.wrapperAddress}&data=${dataAbi}&tag=latest&apikey=${api}`
    }

    return new Promise((resolve, rejected) => {
      https.get(options, res => {
        var statusCode = res.statusCode;
        if (statusCode != 200) {
          resolve([]);
          return
        }
        res.setEncoding("utf8");
        let body = ""
        res.on("data", data => {
          body += data
        })
        res.on("end", () => {
          try {
            body = JSON.parse(body)
            var arrayType = Array(sources.length).fill('uint')
            console.log(arrayType)
            var rates = this.rpc.eth.abi.decodeParameters((arrayType, arrayType), body.result)
            console.log("*****************************")
            console.log(rates)
            resolve(rates)
          } catch (e) {
            console.log(e)
            resolve([])
          }
        }).on("error", function () {
          console.log("GET request error")
          resolve([])
        })
      })
    })

    // return new Promise((resolve, reject) => {
    //   this.wrapperContract.methods.getExpectedRates(this.networkAddress, sources, dests, quantity).encodeABI()
    //     .then((result) => {
    //       if (result != null) {
    //         console.log("******************************")
    //         console.log(result[0])
    //         // console.log(result[1])
    //         // resolve(result)
    //       }
    //     })
    //     .catch((err) => {
    //       console.log("-------------------------------")
    //       console.log(err)
    //       reject(err)
    //     })
    // })
  }

  getAllRatesFromBlockchain(tokensObj, reserve) {

    var arrayTokenAddress = Object.keys(tokensObj).map((tokenName) => {
      return tokensObj[tokenName].address
    });

  var arrayTokenDest = Array(arrayTokenAddress.length).fill(constants.ETH.address)

    var arrayQty = Array(arrayTokenAddress.length).fill("0x0")

    return this.getAllRate(arrayTokenAddress, arrayTokenDest, arrayQty)
    // var promises = Object.keys(tokensObj).map((tokenName) => {
    //   return Promise.all([
    //     Promise.resolve(tokenName),
    //     Promise.resolve(constants.ETH.symbol),
    //     this.getRate(tokensObj[tokenName].address, constants.ETH.address, '0x0'),
    //     this.getRate(constants.ETH.address, tokensObj[tokenName].address, '0x0'),
    //   ])
    // })
    // return Promise.all(promises)
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


  getAllRateUSD(tokensObj) {
    var promises = Object.values(tokensObj).map((value) => {
      return this.getRateUSD(value.usd_id)
    })
    return Promise.all(promises)
  }

  getRateUSD(tokenId){
    var serverPoint = BLOCKCHAIN_INFO.api_usd
    var path = `/v1/ticker/${tokenId}`
    return new Promise((resolve, rejected)=>{
      request.get({
        url : serverPoint + path,
        json: true
      }, (err, resp, body) => {
        if (err) return rejected(new Error('Can\'t reach coin market cap server.'));
        if (resp && resp.statusCode == 404) return rejected(new Error('Currency id not found.'));
        if (!resp || resp.statusCode != 200) return rejected(new Error('Invalid response from coin market cap server.'));

        if (body.length === 1){
          return resolve(body[0])
        }else{
          return rejected(new Error('Rate usd is not in right format'))
        }
      })
    })
  }
  
  getLogExchange(fromBlock, toBlock) {
    var serverPoint = BLOCKCHAIN_INFO.server_logs.url
    var api = BLOCKCHAIN_INFO.server_logs.api_key
    var contractAddress = BLOCKCHAIN_INFO.network
    var tradeTopic = constants.TRADE_TOPIC

    //var url = `${serverPoint}/api?module=logs&action=getLogs&fromBlock=${fromBlock}&toBlock=${toBlock}&address=${contractAddress}&topic0=${tradeTopic}&apikey=${api}`
    var options = {
      host: serverPoint,
      path: `/api?module=logs&action=getLogs&fromBlock=${fromBlock}&toBlock=${toBlock}&address=${contractAddress}&topic0=${tradeTopic}&apikey=${api}`
    }
    return new Promise((resolve, rejected) => {
      https.get(options, res => {
        var statusCode = res.statusCode;
        if (statusCode != 200) {
          console.log("non-200 response status code:");
          console.log(res.statusCode)
          console.log("for url:")
          console.log(serverPoint)
          resolve([]);
          return
        }

        res.setEncoding("utf8");
        let body = ""
        res.on("data", data => {
          body += data
        })
        res.on("end", () => {
          try {
            body = JSON.parse(body)
            resolve(body.result)
          } catch (e) {
            console.log(e)
            resolve([])
          }

        }).on("error", function () {
          console.log("GET request error")
          resolve([])
        })
      })
    })
  }
}


module.exports = BaseEthereumProvider