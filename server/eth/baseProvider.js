

var Web3 = require("web3")
//var constants = require("../../src/js/services/constants")
var ethUtil = require('ethereumjs-util')
var BLOCKCHAIN_INFO = require("../../env")
const https = require("https")
const request = require('request');

const constants = {
  ERC20: [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "minter", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_recipient", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "createIlliquidToken", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_recipient", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "endMintingTime", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_recipient", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "createToken", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "illiquidBalance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_recipient", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "LOCKOUT_PERIOD", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "o_remaining", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "makeLiquid", "outputs": [], "payable": false, "type": "function" }, { "inputs": [{ "name": "_minter", "type": "address" }, { "name": "_endMintingTime", "type": "uint256" }], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_recipient", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_spender", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Approval", "type": "event" }],
  KYBER_NETWORK: [{"constant":false,"inputs":[{"name":"alerter","type":"address"}],"name":"removeAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"reserve","type":"address"},{"name":"src","type":"address"},{"name":"dest","type":"address"},{"name":"add","type":"bool"}],"name":"listPairForReserve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"perReserveListedPairs","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"enabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOperators","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"maxGasPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newAlerter","type":"address"}],"name":"addAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"negligibleRateDiff","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeBurnerContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"expectedRateContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"whiteListContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getUserCapInWei","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_enable","type":"bool"}],"name":"setEnable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"claimAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isReserve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAlerters","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"},{"name":"dest","type":"address"},{"name":"srcQty","type":"uint256"}],"name":"getExpectedRate","outputs":[{"name":"expectedRate","type":"uint256"},{"name":"slippageRate","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"reserves","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOperator","type":"address"}],"name":"addOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"reserve","type":"address"},{"name":"add","type":"bool"}],"name":"addReserve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"operator","type":"address"}],"name":"removeOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_whiteList","type":"address"},{"name":"_expectedRate","type":"address"},{"name":"_feeBurner","type":"address"},{"name":"_maxGasPrice","type":"uint256"},{"name":"_negligibleRateDiff","type":"uint256"}],"name":"setParams","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"},{"name":"dest","type":"address"},{"name":"srcQty","type":"uint256"}],"name":"findBestRate","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"destAddress","type":"address"},{"name":"maxDestAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"},{"name":"walletId","type":"address"}],"name":"trade","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getNumReserves","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"token","type":"address"},{"name":"user","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_admin","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"EtherReceival","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"src","type":"address"},{"indexed":false,"name":"dest","type":"address"},{"indexed":false,"name":"actualSrcAmount","type":"uint256"},{"indexed":false,"name":"actualDestAmount","type":"uint256"}],"name":"ExecuteTrade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"reserve","type":"address"},{"indexed":false,"name":"add","type":"bool"}],"name":"AddReserveToNetwork","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"reserve","type":"address"},{"indexed":false,"name":"src","type":"address"},{"indexed":false,"name":"dest","type":"address"},{"indexed":false,"name":"add","type":"bool"}],"name":"ListReservePairs","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"TokenWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"EtherWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pendingAdmin","type":"address"}],"name":"TransferAdminPending","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAdmin","type":"address"},{"indexed":false,"name":"previousAdmin","type":"address"}],"name":"AdminClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAlerter","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"AlerterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOperator","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"OperatorAdded","type":"event"}],
  ETH: {
    address:"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  }
}
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

  getRateAtSpecificBlock(source, dest, srcAmount, blockno) {
    var data = this.networkContract.methods.getExpectedRate(source, dest, srcAmount).encodeABI()
    return new Promise((resolve, reject) => {
        this.rpc.eth.call({
            to: BLOCKCHAIN_INFO.network,
            data: data
        }, blockno)
            .then(result => {
                var rates = this.rpc.eth.abi.decodeParameters([{
                    type: 'uint256',
                    name: 'expectedPrice'
                }, {
                    type: 'uint256',
                    name: 'slippagePrice'
                }], result)
                console.log(rates)
                resolve(rates)
            }).catch((err) => {
                reject(err)
            })
    })
}

  version() {
    return this.rpc.version.api
  }
  // getLatestBlock(){
  //   return new Promise((resolve, rejected)=>{
  //     try{
  //       var blockNumber = this.getLatestBlockFromEtherScan()
  //     }
  //   })
  // }
  getLatestBlockFromEtherScan() {
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
          //console.log("non-200 response status code:")
          //console.log(res.statusCode)
          //console.log("for url:")
          //console.log(serverPoint)
          rejected(new Error("Status code from etherscan is not 200 when get block number"));
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
            rejected(new Error("Cannot parse blockNumber from etherscan"));
          }

        })
        res.on("error", function () {
          console.log("GET request error")
          rejected(new Error("Cannot request blocknumber from etherscan"));
        })
      })
    })
  }

  getLatestBlockFromNode() {
    return new Promise((resolve, rejected) => {
      this.rpc.eth.getBlock("latest", false).then((block) => {
        if (block != null) {
          resolve(block.number)
        }
      }).catch(e => {
        rejected(e)        
      })
    })
  }

  // getBalance(address) {
  //   return new Promise((resolve, reject) => {
  //     this.rpc.eth.getBalance(address).then((balance) => {
  //       if (balance != null) {
  //         resolve(balance)
  //       }
  //     })
  //   })
  // }

  // getNonce(address) {
  //   return new Promise((resolve, reject) => {
  //     this.rpc.eth.getTransactionCount(address, "pending").then((nonce) => {
  //       //console.log(nonce)
  //       if (nonce != null) {
  //         resolve(nonce)
  //       }
  //     })
  //   })
  // }

  // getTokenBalance(address, ownerAddr) {
  //   var instance = this.erc20Contract
  //   instance.options.address = address
  //   return new Promise((resolve, reject) => {
  //     instance.methods.balanceOf(ownerAddr).call().then((result) => {
  //       if (result != null) {

  //         resolve(blockNumber)
  //       }
  //     })
  //   })

  // }

  // exchangeData(sourceToken, sourceAmount, destToken, destAddress,
  //   maxDestAmount, minConversionRate, throwOnFailure) {
  //   return this.networkContract.methods.trade(
  //     sourceToken, sourceAmount, destToken, destAddress,
  //     maxDestAmount, minConversionRate, throwOnFailure).encodeABI()
  // }

  // approveTokenData(sourceToken, sourceAmount) {
  //   var tokenContract = this.erc20Contract
  //   tokenContract.options.address = sourceToken
  //   return tokenContract.methods.approve(this.networkAddress, sourceAmount).encodeABI()
  // }

  // sendTokenData(sourceToken, sourceAmount, destAddress) {
  //   var tokenContract = this.erc20Contract
  //   tokenContract.options.address = sourceToken
  //   return tokenContract.methods.transfer(destAddress, sourceAmount).encodeABI()
  // }

  // getAllowance(sourceToken, owner) {
  //   var tokenContract = this.erc20Contract
  //   tokenContract.options.address = sourceToken
  //   return new Promise((resolve, reject) => {
  //     tokenContract.methods.allowance(owner, this.networkAddress).call().then((result) => {
  //       if (result !== null) {
  //         resolve(result)
  //       }
  //     })
  //   })
  // }

  // getDecimalsOfToken(token) {
  //   var tokenContract = this.erc20Contract
  //   tokenContract.options.address = token
  //   return new Promise((resolve, reject) => {
  //     tokenContract.methods.decimals().call().then((result) => {
  //       if (result !== null) {
  //         resolve(result)
  //       }
  //     })
  //   })
  // }

  // txMined(hash) {
  //   return new Promise((resolve, reject) => {
  //     this.rpc.eth.getTransactionReceipt(hash).then((result) => {
  //       if (result != null) {
  //         resolve(result)
  //       }
  //     })
  //   })

  // }

  getRate(source, dest, quantity) {
    return new Promise((resolve, rejected) => {
      this.networkContract.methods.getExpectedRate(source, dest, quantity).call().then((result) => {
        if (result != null) {
          resolve(result)
        }
      }).catch(e =>{
        rejected(e)
      })        
    })
  }

  getAllRate(sources, dests, quantity) {
    var serverPoint = BLOCKCHAIN_INFO.server_logs.url
    var api = BLOCKCHAIN_INFO.server_logs.api_key
   // console.log(sources)
   // console.log(dests)
   // console.log(quantity)
    var dataAbi = this.wrapperContract.methods.getExpectedRates(this.networkAddress, sources, dests, quantity).encodeABI()
    var options = {
      host: serverPoint,
      path: `/api?module=proxy&action=eth_call&to=${this.wrapperAddress}&data=${dataAbi}&tag=latest&apikey=${api}`
    }

    // console.log(options)
    return new Promise((resolve, rejected) => {
      https.get(options, res => {
        var statusCode = res.statusCode;
        if (statusCode != 200) {
          rejected(new Error("Status etherscan is not 200 when get all rate"))
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
            var dataMapped = this.rpc.eth.abi.decodeParameters([
              {
                type: 'uint256[]',
                name: 'expectedPrice'
              },
              {
                type: 'uint256[]',
                name: 'slippagePrice'
              }
            ], body.result)
            //console.log("aaaa")
            // console.log(body.result)
            resolve(dataMapped)
          } catch (e) {
            console.log(e)
            rejected(new Error("Cannot get rate from etherscan"))
          }
        }).on("error", function () {
          console.log("GET request error")
          rejected(new Error("Request get rate error"))
        })
      })
    })
  }

  getAllRatesFromEtherscan(tokensObj, reserve) {
    var arrayTokenAddress = Object.keys(tokensObj).map((tokenName) => {
      return tokensObj[tokenName].address
    });

    var arrayEthAddress = Array(arrayTokenAddress.length).fill(constants.ETH.address)
    var arrayQty = Array(arrayTokenAddress.length * 2).fill("0x0")

    return this.getAllRate(arrayTokenAddress.concat(arrayEthAddress), arrayEthAddress.concat(arrayTokenAddress), arrayQty).then((result) => {
      if (!result) return []
      // console.log(result)
      return Object.keys(tokensObj).map((tokenName, i) => {
        return [
          tokenName,
          'ETH',
          {
            expectedPrice: result.expectedPrice[i],
            slippagePrice: result.slippagePrice[i]
          },
          {
            expectedPrice: result.expectedPrice[i + arrayTokenAddress.length],
            slippagePrice: result.slippagePrice[i + arrayTokenAddress.length]
          }
        ]
      });
    })
  }

  getAllRatesFromBlockchain(tokensObj, reserve) {
    var arrayTokenAddress = Object.keys(tokensObj).map((tokenName) => {
      return tokensObj[tokenName].address
    });

    var arrayEthAddress = Array(arrayTokenAddress.length).fill(constants.ETH.address)

    var arrayQty = Array(arrayTokenAddress.length * 2).fill("0x0")

    return this.getAllRateFromNode(arrayTokenAddress.concat(arrayEthAddress), arrayEthAddress.concat(arrayTokenAddress), arrayQty).then((result) => {
      var returnData = []
      Object.keys(tokensObj).map((tokenSymbol, i) => {
        returnData.push([
          tokenSymbol,
          'ETH',
          {
            expectedPrice: result.expectedPrice[i],
            slippagePrice: result.slippagePrice[i]
          },
          {
            expectedPrice: result.expectedPrice[i + arrayTokenAddress.length],
            slippagePrice: result.slippagePrice[i + arrayTokenAddress.length]
          }
        ])
      });
      return returnData
    })
  }

  getAllRateFromNode(sources, dests, quantity) {
    var dataAbi = this.wrapperContract.methods.getExpectedRates(this.networkAddress, sources, dests, quantity).encodeABI()

    return new Promise((resolve, rejected) => {
      this.rpc.eth.call({
        to: this.wrapperAddress,
        data: dataAbi
      })
        .then((data) => {
          try {
            var dataMapped = this.rpc.eth.abi.decodeParameters([
              {
                type: 'uint256[]',
                name: 'expectedPrice'
              },
              {
                type: 'uint256[]',
                name: 'slippagePrice'
              }
            ], data)
            resolve(dataMapped)
          } catch (e) {
            console.log(e)
            rejected(new Error("Cannot get rate from blockchain"))
          }
        })
        .catch((err) => {
          console.log("GET request error")
          rejected(new Error("Request get rate from node error"))
        })
    })
  }
  // var promises = Object.keys(tokensObj).map((tokenName) => {
  //   return Promise.all([
  //     Promise.resolve(tokenName),
  //     Promise.resolve(constants.ETH.symbol),
  //     this.getRate(tokensObj[tokenName].address, constants.ETH.address, '0x0'),
  //     this.getRate(constants.ETH.address, tokensObj[tokenName].address, '0x0'),
  //   ])
  // })
  // return Promise.all(promises)
  //}

  // sendRawTransaction(tx) {
  //   return new Promise((resolve, rejected) => {
  //     this.rpc.eth.sendSignedTransaction(
  //       ethUtil.bufferToHex(tx.serialize()), (error, hash) => {
  //         if (error != null) {
  //           rejected(error)
  //         } else {
  //           resolve(hash)
  //         }
  //       })
  //   })
  // }


  getAllRateUSD(tokensObj) {
    var promises = Object.values(tokensObj).map((value) => {
      return this.getRateUSD(value.usd_id)
    })
    return Promise.all(promises)
  }

  getRateUSD(tokenId) {
    var serverPoint = BLOCKCHAIN_INFO.api_usd
    var path = `/v1/ticker/${tokenId}`
    return new Promise((resolve, rejected) => {
      request.get({
        url: serverPoint + path,
        json: true
      }, (err, resp, body) => {
        if (err) return rejected(new Error('Can\'t reach coin market cap server.'));
        if (resp && resp.statusCode == 404) return rejected(new Error('Currency id not found.'));
        if (!resp || resp.statusCode != 200) return rejected(new Error('Invalid response from coin market cap server.'));

        if (body.length === 1) {
          return resolve(body[0])
        } else {
          return rejected(new Error('Rate usd is not in right format'))
        }
      })
    })
  }

  getLogExchange(fromBlock, toBlock) {
    var serverPoint = BLOCKCHAIN_INFO.server_logs.url
    var api = BLOCKCHAIN_INFO.server_logs.api_key
    var contractAddress = BLOCKCHAIN_INFO.network
    var tradeTopic = BLOCKCHAIN_INFO.trade_topic

    //var url = `${serverPoint}/api?module=logs&action=getLogs&fromBlock=${fromBlock}&toBlock=${toBlock}&address=${contractAddress}&topic0=${tradeTopic}&apikey=${api}`
    var options = {
      host: serverPoint,
      path: `/api?module=logs&action=getLogs&fromBlock=${fromBlock}&toBlock=${toBlock}&address=${contractAddress}&topic0=${tradeTopic}&apikey=${api}`
    }
    console.log(options)
    return new Promise((resolve, rejected) => {
      https.get(options, res => {
        var statusCode = res.statusCode;
        if (statusCode != 200) {
          // console.log("non-200 response status code:");
          // console.log(res.statusCode)
          // console.log("for url:")
          // console.log(serverPoint)
          rejected(new Error("Status code is not 200 in etherscan when get logs"));
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
            rejected(new Error("Cannot parse log"));
          }

        }).on("error", function () {
          console.log("GET request error")
          rejected(new Error("Get request logs error"));
        })
      })
    })
  }

  getLogExchangeFromNode(fromBlock, toBlock) {
    var contractAddress = BLOCKCHAIN_INFO.network
    var tradeTopic = BLOCKCHAIN_INFO.trade_topic

    return new Promise((resolve, rejected) => {
      this.networkContract.getPastEvents('ExecuteTrade', {
        filter: { topic0: tradeTopic },
        fromBlock: fromBlock,
        toBlock: toBlock
      })
        .then(function (events) {
          console.log(events)
          resolve(events)
        }).catch(e => {
          rejected(e)
        })
    })
  }

}





module.exports = BaseEthereumProvider