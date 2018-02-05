import Web3 from "web3"
import constants from "../constants"
import * as ethUtil from 'ethereumjs-util'
import BLOCKCHAIN_INFO from "../../../../env"
import abiDecoder from "abi-decoder"

export default class BaseEthereumProvider {

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
        if(data.success){
          resolve(data)
        }else{
          throw "get rate from blockchain"
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

  getMaxCap(address, blockno) {
    var data =  this.networkContract.methods.getUserCapInWei(address).encodeABI()
    return new Promise((resolve, reject) => {
      this.rpc.eth.call({
        to: BLOCKCHAIN_INFO.network,
        data: data
      }, blockno ? blockno : this.rpc.eth.defaultBlock)
        .then(result => {
          var cap = this.rpc.eth.abi.decodeParameters(['uint256'], result)
          resolve(cap[0])
        }).catch((err) => {
          // console.log(err)
          reject(err)
        })
    })
    // return new Promise((resolve, reject) => {
    //   this.networkContract.methods.getUserCapInWei(address).call()
    //     .then((result) => {
    //       if (result != null) {
    //         console.log(result)
    //         resolve(result)
    //       }
    //     })
    //     .catch((err) => {
    //       reject(err)
    //     })
    // })
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

  getTokenBalance(address, ownerAddr, blockno) {
    var instance = this.erc20Contract
    instance.options.address = address

    var data = instance.methods.balanceOf(ownerAddr).encodeABI()

    return new Promise((resolve, reject) => {
      this.rpc.eth.call({
        to: address,
        data: data
      }, blockno ? blockno : this.rpc.eth.defaultBlock)
        .then(result => {
          var balance = this.rpc.eth.abi.decodeParameters(['uint256'], result)
          resolve(balance[0])
        }).catch((err) => {
          // console.log(err)
          reject(err)
        })
    })

    // return new Promise((resolve, reject) => {
    //   instance.methods.balanceOf(ownerAddr).call()
    //     .then((result) => {
    //       if (result != null) {
    //         resolve(result)
    //       }
    //     })
    //     .catch((err) => {
    //       reject(err)
    //     })
    // }) 

  }

  estimateGas(txObj) {
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
    var data = this.networkContract.methods.trade(
      sourceToken, sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate, walletId).encodeABI()
    return data
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

  getAllowance(sourceToken, owner, blockno) {
    var tokenContract = this.erc20Contract
    tokenContract.options.address = sourceToken

    var data = tokenContract.methods.allowance(owner, this.networkAddress).encodeABI()

    return new Promise((resolve, reject) => {
      this.rpc.eth.call({
        to: sourceToken,
        data: data
      }, blockno ? blockno : this.rpc.eth.defaultBlock)
        .then(result => {
          var allowance = this.rpc.eth.abi.decodeParameters(['uint256'], result)
          resolve(allowance[0])
        }).catch((err) => {
          // console.log(err)
          reject(err)
        })
    })
    // return new Promise((resolve, reject) => {
    //   tokenContract.methods.allowance(owner, this.networkAddress).call().then((result) => {
    //     if (result !== null) {
    //       resolve(result)
    //     }
    //   })
    // })
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

  checkKyberEnable(){
    return new Promise((resolve, reject) => {
      this.networkContract.methods.enabled().call()
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

  getLogOneColumn() {
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
        .then((result) => {
          if(result.success){
            var data = result.data.filter(item => {
              return (this.tokenIsSupported(item.dest) && this.tokenIsSupported(item.source))
            })

            // for (let key in data) {
            //   data[key] = data[key].filter(item => {
            //     return (this.tokenIsSupported(item.dest)
            //       && this.tokenIsSupported(item.source))
            //   })
            // }
            resolve(data)
          }else{
            rejected(new Error("Events in server not fetching"))
          }
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
      if (tokens[token].address.toLowerCase() == address.toLowerCase()) {
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

  // getAllRatesUSDFromThirdParty() {
  //   //get from third party api
  //   var promises = Object.keys(BLOCKCHAIN_INFO.tokens).map(key => {
  //     var token = BLOCKCHAIN_INFO.tokens[key]
  //     var url = BLOCKCHAIN_INFO.api_usd + '/v1/ticker/' + token.usd_id + "/"
  //     return new Promise(resolve => {
  //       axios.get(url)
  //         .then(function (response) {
  //           if (response.status === 200) {
  //             return resolve({
  //               symbol: key,
  //               price_usd: response.data[0].price_usd
  //             })
  //           } else {
  //             console.log(response)
  //             return resolve({
  //               symbol: key,
  //               price_usd: 0
  //             })
  //           }
  //         })
  //         .catch(function (error) {
  //           console.log(error)
  //           return resolve({
  //             symbol: key,
  //             price_usd: 0
  //           })
  //         });
  //     })
  //   })
  //   return Promise.all(promises)
  // }

  getLanguagePack(lang) {
    return new Promise((resolve, rejected) => {
      fetch(BLOCKCHAIN_INFO.history_endpoint + '/getLanguagePack?lang=' + lang).then(function (response) {
        resolve(response.json())
      }).catch((err) => {
        rejected(err)
      })
    })
  }

  getAllRate(sources, dests, quantity) {
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
            resolve([])
          }
        })
        .catch((err) => {
          console.log("GET request error")
          resolve([])
        })
    })
  }

  getAllRatesFromBlockchain(tokensObj) {
    var arrayTokenAddress = Object.keys(tokensObj).map((tokenName) => {
      return tokensObj[tokenName].address
    });

    var arrayEthAddress = Array(arrayTokenAddress.length).fill(constants.ETH.address)

    var arrayQty = Array(arrayTokenAddress.length * 2).fill("0x0")

    return this.getAllRate(arrayTokenAddress.concat(arrayEthAddress), arrayEthAddress.concat(arrayTokenAddress), arrayQty).then((result) => {
      var returnData = []
      Object.keys(tokensObj).map((tokenSymbol, i) => {
        returnData.push({
          source: tokenSymbol,
          dest: "ETH",
          rate: result.expectedPrice[i],
          minRate: result.slippagePrice[i]
        })

        returnData.push({
          source: "ETH",
          dest: tokenSymbol,
          rate: result.expectedPrice[i + arrayTokenAddress.length],
          minRate: result.slippagePrice[i + arrayTokenAddress.length]
        })
      });
      return returnData
    })
  }

  getMaxGasPrice() {
    return new Promise((resolve, reject) => {
      this.networkContract.methods.maxGasPrice().call()
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

  //--------------------------For debug tx functions
  getTx(txHash) {
    return new Promise((resolve, rejected) => {
      this.rpc.eth.getTransaction(txHash).then((result) => {
        if (result != null) {
          resolve(result)
        } else {
          rejected("Cannot get tx hash")
        }
      })
    })
  }

  getListReserve() {
    return Promise.resolve([BLOCKCHAIN_INFO.reserve])
  }

  getAbiByName(name, abi) {
    for (var value of abi) {
      if (value.name === name) {
        return [value]
      }
    }
    return false
  }

  exactExchangeData(data) {
    return new Promise((resolve, rejected) => {
      //get trade abi from 
      var tradeAbi = this.getAbiByName("trade", constants.KYBER_NETWORK)
      abiDecoder.addABI(tradeAbi)
      var decoded = abiDecoder.decodeMethod(data);
      resolve(decoded.params)
    })
  }  

  wrapperGetGasCap(input, blockno) {
    return new Promise((resolve, reject) => {
      var data = this.networkContract.methods.maxGasPrice().encodeABI()
      this.rpc.eth.call({
        to: BLOCKCHAIN_INFO.network,
        data: data
      }, blockno)
        .then(result => {
          var gasCap = this.rpc.eth.abi.decodeParameters(['uint256'], result)
          resolve(gasCap[0])
        }).catch((err) => {
          // console.log(err)
          reject(err)
        })

      //   this.networkContract.methods.maxGasPrice().call()
      //     .then((result) => {
      //       if (result != null) {
      //         resolve(result)
      //       }
      //     })
      //     .catch((err) => {
      //       // console.log(err)
      //       reject(err)
      //     })
      // })
    })
  }

  // wrapperGetUserCap(input, blockno) {
  //   return new Promise((resolve, rejected) => {
  //     this.networkContract.methods.getUserCapInWei(input.owner).call()
  //       .then((result) => {
  //         if (result != null) {
  //           // console.log(result)
  //           resolve(result)
  //         }
  //       })
  //       .catch((err) => {
  //         reject(err)
  //       })
  //   })
  // }

  wrapperGetConversionRate(reserve, input, blockno) {
    var data = this.networkContract.methods.getExpectedRate(input.source, input.dest, input.srcAmount).encodeABI()
   // console.log(data)
    return new Promise((resolve, reject) => {
      this.rpc.eth.call({
        to: BLOCKCHAIN_INFO.network,
        data: data
      }, blockno)
        .then(result => {
          var rates = this.rpc.eth.abi.decodeParameters([{
            type: 'uint256',
            name: 'expectedPrice'
        },{
            type: 'uint256',
            name: 'slippagePrice'
        }], result)
         resolve(rates)
        }).catch((err) => {
          // console.log(err)
          reject(err)
        })
    })
  }
  wrapperGetReasons(reserve, input, blockno) {
    return new Promise((resolve) => {
      resolve("Cannot get rate at the moment!")
    })
  }
  wrapperGetChosenReserve(input, blockno) {
    return new Promise((resolve) => {
      resolve(BLOCKCHAIN_INFO.reserve)
    })
  }

  getGasFromEthgasstation(){
    return new Promise((resolve, rejected) => {
      fetch(BLOCKCHAIN_INFO.gasstation_endpoint)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        console.log(err)
      })
    })
  }
}
