import Web3 from "web3"
import constants from "../../constants"
import * as ethUtil from 'ethereumjs-util'
import BLOCKCHAIN_INFO from "../../../../../env"
import * as converters from "../../../utils/converter"

export default class BaseProvider {

    initContract() {
        this.rpc = new Web3(new Web3.providers.HttpProvider(this.rpcUrl, constants.CONNECTION_TIMEOUT))

        this.erc20Contract = new this.rpc.eth.Contract(constants.ERC20)
        this.networkAddress = BLOCKCHAIN_INFO.network
        this.wrapperAddress = BLOCKCHAIN_INFO.wrapper
        this.kyberswapAddress = BLOCKCHAIN_INFO.kyberswapAddress
        // console.log(BLOCKCHAIN_INFO)
        // console.log(this.wrapperAddress)
        this.networkContract = new this.rpc.eth.Contract(constants.KYBER_NETWORK, this.networkAddress)
        this.wrapperContract = new this.rpc.eth.Contract(constants.KYBER_WRAPPER, this.wrapperAddress)

        this.kyberswapContract = new this.rpc.eth.Contract(constants.KYBER_SWAP_ABI, this.kyberswapAddress)

        // this.getSignatureParameters("0x3ebf9366a33aa9877c339f6b52e6911b583251d1e0139751e4ff0d9e551638274811d1b31a7b7e3b7458559571a906a0996c98f4e95b1d35fbc2a44eb6dd6bcc1c")
        // this.getSignatureParameters("0x112b82204e41184696fe6e83e2637870f7922672ecf1dc603815a4c25098bfde1cf6ed4ddc6a76b77cc103f844eddc2e1e39a6062e3e09da4f2b53cfab620c5c1c")
        // this.getMessageHashTest("hello")
        
        // console.log(Buffer.from("test").toString("hex"))
        // var message = "0x6d1ffaf4dc86fa4249bc6a81620bfa187114044dd961cfe6cf8193737a16598a"
        // console.log(message)
        // console.log(Buffer.from(message.substring(2)).toString("hex"))
        // console.log(Buffer.from(message).toString("hex"))
    }

    version() {
        return this.rpc.version.api
    }


    isConnectNode() {
        return new Promise((resolve, reject) => {
            this.rpc.eth.getBlock("latest", false).then((block) => {
                resolve(true)
            }).catch((errr) => {
                reject(false)
            })
        })
    }

    getLatestBlock() {
        return new Promise((resolve, reject) => {
            this.rpc.eth.getBlockNumber().then((block) => {
                resolve(block)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    getBalanceAtLatestBlock(address) {
        return new Promise((resolve, reject) => {
            this.rpc.eth.getBalance(address)
                .then((balance) => {
                    if (balance != null) {
                        resolve(balance)
                    }
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    getBalanceToken(owner, token) {
        var tokenContract = this.erc20Contract
        tokenContract.options.address = token
        

        return new Promise((resolve, reject) => {
            var data = tokenContract.methods.balanceOf(owner).encodeABI()

            
                this.rpc.eth.call({
                    to: token,
                    data: data
                })
                    .then(result => {
                        var balance = this.rpc.eth.abi.decodeParameters(['uint256'], result)
                        resolve(balance[0])
                    }).catch((err) => {
                        console.log(err)
                        reject(err)
                    })
            
        })
    }

    getAllBalancesTokenAtLatestBlock(address, tokens) {
        var listToken = []
        var listSymbol = []
        Object.keys(tokens).map(index => {
            var token = tokens[index]
            listToken.push(token.address)
            listSymbol.push(token.symbol)
        })

        return new Promise((resolve, reject) => {
            var data = this.wrapperContract.methods.getBalances(address, listToken).call().then(result => {
                if (result.length !== listToken.length){
                    console.log("Cannot get balances from node")
                    reject("Cannot get balances from node")
                }
                var listTokenBalances = []
                listSymbol.map((symbol, index) => {
                    listTokenBalances.push({
                        symbol: symbol,
                        balance: result[index] ? result[index]: "0"
                    })
                })
                resolve(listTokenBalances)
            }).catch(err => {
                console.log(err)
                reject(err)
            })
        })
    }

    

    getAllBalancesTokenAtSpecificBlock(address, tokens, blockNumber) {
      var listToken = []
      var listSymbol = []
      Object.keys(tokens).map(index => {
        var token = tokens[index]
        listToken.push(token.address)
        listSymbol.push(token.symbol)
      })

      return new Promise((resolve, reject) => {
        var data = this.wrapperContract.methods.getBalances(address, listToken).call(
          {},
          blockNumber
        ).then(result => {
          if (result.length !== listToken.length){
            console.log("Cannot get balances from node")
            reject("Cannot get balances from node")
          }
          var listTokenBalances = []
          listSymbol.map((symbol, index) => {
            listTokenBalances.push({
              symbol: symbol,
              balance: result[index] ? result[index]: "0"
            })
          })
          resolve(listTokenBalances)
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      })
    }

    getMaxCapAtLatestBlock(address) {
        var data = this.networkContract.methods.getUserCapInWei(address).encodeABI()
        return new Promise((resolve, reject) => {
            this.rpc.eth.call({
                to: BLOCKCHAIN_INFO.network,
                data: data
            })
                .then(result => {
                    var cap = this.rpc.eth.abi.decodeParameters(['uint256'], result)
                    resolve(cap[0])
                }).catch((err) => {
                    reject(err)
                })
        })
    }

    getNonce(address) {
        return new Promise((resolve, reject) => {
            this.rpc.eth.getTransactionCount(address)
                .then((nonce) => {
                    resolve(nonce)
                })
                .catch((err) => {
                    reject(err)
                })
        })


    }

    getTokenBalanceAtLatestBlock(address, ownerAddr) {
        var instance = this.erc20Contract
        instance.options.address = address

        var data = instance.methods.balanceOf(ownerAddr).encodeABI()

        return new Promise((resolve, reject) => {
            this.rpc.eth.call({
                to: address,
                data: data
            })
                .then(result => {
                    var balance = this.rpc.eth.abi.decodeParameters(['uint256'], result)
                    resolve(balance[0])
                }).catch((err) => {
                    // console.log(err)
                    reject(err)
                })
        })
    }

    estimateGas(txObj) {
        return new Promise((resolve, reject) => {
            this.rpc.eth.estimateGas(txObj)
                .then((result) => {
                   // console.log("gas_result: " + result)
                    if (result != null) {
                        resolve(result)
                    }
                })
                .catch((err) => {
                    console.log(err)
                    reject(err)
                })
        })
    }

    exchangeData(sourceToken, sourceAmount, destToken, destAddress,
        maxDestAmount, minConversionRate, walletId) {

        if (!this.rpc.utils.isAddress(walletId)) {
            walletId = "0x" + Array(41).join("0")
        }
        var hint = this.rpc.utils.utf8ToHex(constants.PERM_HINT)
        var data = this.networkContract.methods.tradeWithHint(
            sourceToken, sourceAmount, destToken, destAddress,
            maxDestAmount, minConversionRate, walletId, hint).encodeABI()

        return new Promise((resolve, reject) => {
            resolve(data)
        })
    }

    approveTokenData(sourceToken, sourceAmount, delegator = this.networkAddress) {
        var tokenContract = this.erc20Contract
        tokenContract.options.address = sourceToken

        var data = tokenContract.methods.approve(delegator, sourceAmount).encodeABI()
        return new Promise((resolve, reject) => {
            resolve(data)
        })
    }

    sendTokenData(sourceToken, sourceAmount, destAddress) {
        var tokenContract = this.erc20Contract
        tokenContract.options.address = sourceToken
        var data = tokenContract.methods.transfer(destAddress, sourceAmount).encodeABI()
        return new Promise((resolve, reject) => {
            resolve(data)
        })
    }

    getAllowanceAtLatestBlock(sourceToken, owner, delegator = this.networkAddress) {
        var tokenContract = this.erc20Contract
        tokenContract.options.address = sourceToken

        var data = tokenContract.methods.allowance(owner, delegator).encodeABI()

        return new Promise((resolve, reject) => {
            this.rpc.eth.call({
                to: sourceToken,
                data: data
            })
                .then(result => {
                    var allowance = this.rpc.eth.abi.decodeParameters(['uint256'], result)
                    resolve(allowance[0])
                }).catch((err) => {
                    reject(err)
                })
        })
    }

    getDecimalsOfToken(token) {
        var tokenContract = this.erc20Contract
        tokenContract.options.address = token
        return new Promise((resolve, reject) => {
            tokenContract.methods.decimals().call().then((result) => {
                resolve(result)
            }).catch(err => {
                reject(err)
            })
        })
    }

    txMined(hash) {
        return new Promise((resolve, reject) => {
            this.rpc.eth.getTransactionReceipt(hash).then((result) => {
                resolve(result)
            }).catch(err => {
                reject(err)
            })
        })

    }

    getRate(source, dest, srcAmount) {
        var mask = converters.maskNumber()
        var srcAmountEnableFirstBit = converters.sumOfTwoNumber(srcAmount,  mask)
        srcAmountEnableFirstBit = converters.toHex(srcAmountEnableFirstBit)

        return new Promise((resolve, reject) => {
            this.networkContract.methods.getExpectedRate(source, dest, srcAmountEnableFirstBit).call()
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

    // getRateTest(source, dest, quantity) {
    //     return new Promise((resolve, reject) => {
    //         this.networkContract.methods.getExpectedRate(source, dest, quantity).call()
    //             .then((result) => {
    //                 if (result != null) {
    //                    // resolve(result)
    //                 }
    //             })
    //             .catch((err) => {
    //                 reject(err)
    //             })
    //     })
    // }

    checkKyberEnable() {
        return new Promise((resolve, reject) => {
            this.networkContract.methods.enabled().call()
                .then((result) => {
                    resolve(result)
                })
                .catch((err) => {
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



    getAllRate(sources, dests, quantity) {
        var dataAbi = this.wrapperContract.methods.getExpectedRates(this.networkAddress, sources, dests, quantity).encodeABI()

        return new Promise((resolve, reject) => {
            this.rpc.eth.call({
                to: this.wrapperAddress,
                data: dataAbi
            })
                .then((data) => {
                   // console.log(data)
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
                        reject(err)
                    }
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    getAllRates(tokensObj) {        

        var arrayTokenAddress = Object.keys(tokensObj).map((tokenSymbol) => {
            return tokensObj[tokenSymbol].address
        });
        var arrayEthAddress = Array(arrayTokenAddress.length).fill(constants.ETH.address)

        var mask = converters.maskNumber()

        //tokens
        var arrayAmount = Object.keys(tokensObj).map((tokenSymbol) => {
           var minAmount = converters.getSourceAmountZero(tokenSymbol, tokensObj[tokenSymbol].decimals, tokensObj[tokenSymbol].rateEth)
           console.log(minAmount)
           var srcAmountEnableFistBit = converters.sumOfTwoNumber(minAmount,  mask)
           srcAmountEnableFistBit = converters.toHex(srcAmountEnableFistBit)
           return srcAmountEnableFistBit
        });

        //eth 
        var minAmountEth = converters.getSourceAmountZero("ETH", 18, 0)
        var srcAmountETHEnableFistBit = converters.sumOfTwoNumber(minAmountEth,  mask)
        srcAmountETHEnableFistBit = converters.toHex(srcAmountETHEnableFistBit)

        var arrayQtyEth = Array(arrayTokenAddress.length).fill(srcAmountETHEnableFistBit)

        var arrayQty = arrayAmount.concat(arrayQtyEth)

        // console.log("arrayQty")
        // console.log(arrayQty)

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
                    rejected(new Error("Cannot get tx hash"))
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

    extractExchangeEventData(data) {
        return new Promise((resolve, rejected) => {
            try {
                const { src, dest, srcAmount, destAmount } = this.rpc.eth.abi.decodeParameters([{
                    type: "address",
                    name: "src"
                }, {
                    type: "address",
                    name: "dest"
                }, {
                    type: "uint256",
                    name: "srcAmount"
                }, {
                    type: "uint256",
                    name: "destAmount"
                }], data)
                resolve({ src, dest, srcAmount, destAmount })
            } catch (e) {
                reject(e)
            }

        })
    }


    exactTradeData(data) {
        return new Promise((resolve, reject) => {
            try {
                //get trade abi from 
                var tradeAbi = this.getAbiByName("tradeWithHint", constants.KYBER_NETWORK)
                //  console.log(tradeAbi)
                // addABI(tradeAbi)
                //  console.log(abiDecoder)
                var decoded = this.decodeMethod(tradeAbi, data);
                //      console.log(decoded)
                resolve(decoded.params)
            } catch (e) {
                reject(e)
            }

        })
    }

    decodeMethod(abiArray, data) {
        const state = {
            savedABIs: [],
            methodIDs: {}
        }
        if (Array.isArray(abiArray)) {
            abiArray.map(abi => {
                if (abi.name) {
                    const signature = this.rpc.utils.sha3(
                        `${abi.name}(${abi.inputs.map(item => item.type).join(",")})`
                    );

                    if (abi.type === "event") {
                        state.methodIDs[signature.slice(2)] = abi;
                    } else {
                        state.methodIDs[signature.slice(2, 10)] = abi;
                    }
                }
            });

            state.savedABIs = state.savedABIs.concat(abiArray);
        } else {
            throw new Error("Expected ABI array, got " + typeof abiArray);
        }

        const methodID = data.slice(2, 10);
        const abiItem = state.methodIDs[methodID];
        if (abiItem) {
            const params = abiItem.inputs.map(item => ({
                type: item.type,
                name: item.name
            }));
            let decoded = this.rpc.eth.abi.decodeParameters(params, "0x" + data.slice(10));
            let retData = {
                name: abiItem.name,
                params: []
            }

            Object.keys(decoded).forEach(key => {
                const foundItems = abiItem.inputs.filter(t => t.name === key);
                if (foundItems.length > 0) {
                    const field = foundItems[0];
                    const isUint = field.type.indexOf("uint") === 0;
                    const isInt = field.type.indexOf("int") === 0;
                    const isAddress = field.type.indexOf("address") === 0;
                    const param = decoded[field.name];
                    let parsedParam = param;

                    if (isUint || isInt) {
                        const isArray = Array.isArray(param);

                        if (isArray) {
                            parsedParam = param.map(val => this.rpc.utils.toBN(val).toString());
                        } else {
                            parsedParam = this.rpc.utils.toBN(param).toString();
                        }
                    }

                    if (isAddress) {
                        const isArray = Array.isArray(param);

                        if (isArray) {
                            parsedParam = param.map(val => val.toLowerCase());
                        } else {
                            parsedParam = param.toLowerCase();
                        }
                    }

                    retData.params.push({
                        name: field.name,
                        value: parsedParam,
                        type: field.type
                    });
                }
            });

            return retData;
        }
    }


    //************************ API for prune MODE *******************/
    //*****
    //************* */
    getBalanceAtSpecificBlock(address, blockno) {
        return new Promise((resolve, reject) => {
            this.rpc.eth.getBalance(address, blockno)
                .then((balance) => {
                    resolve(balance)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    getMaxCapAtSpecificBlock(address, blockno) {
        var data = this.networkContract.methods.getUserCapInWei(address).encodeABI()
        return new Promise((resolve, reject) => {
            this.rpc.eth.call({
                to: BLOCKCHAIN_INFO.network,
                data: data
            }, blockno)
                .then(result => {
                    var cap = this.rpc.eth.abi.decodeParameters(['uint256'], result)
                    resolve(cap[0])
                }).catch((err) => {
                    reject(err)
                })
        })
    }


    getTokenBalanceAtSpecificBlock(address, ownerAddr, blockno) {
        var instance = this.erc20Contract
        instance.options.address = address

        var data = instance.methods.balanceOf(ownerAddr).encodeABI()

        return new Promise((resolve, reject) => {
            this.rpc.eth.call({
                to: address,
                data: data
            }, blockno)
                .then(result => {
                    var balance = this.rpc.eth.abi.decodeParameters(['uint256'], result)
                    resolve(balance[0])
                }).catch((err) => {
                    reject(err)
                })
        })
    }

    getGasPrice() {
        return new Promise((resolve, reject) => {
            this.rpc.eth.getGasPrice()
                .then(result => {
                    // console.log("gas price")
                    // console.log(result)

                    var gasPrice = parseInt(result, 10)
                    gasPrice = gasPrice / 1000000000
                    if (gasPrice < 1) {
                        resolve({
                            low: 1,
                            default: 1,
                            standard: 1,
                            fast: 1
                        })
                    } else {
                        gasPrice = Math.round(gasPrice * 10) / 10
                        resolve({
                            low: gasPrice.toString(),
                            default: gasPrice.toString(),
                            standard: gasPrice.toString(),
                            fast: (gasPrice * 1.3).toString()
                        })
                    }

                }).catch((err) => {
                    reject(err)
                })
        })
    }

    getAllowanceAtSpecificBlock(sourceToken, owner, blockno) {
        var tokenContract = this.erc20Contract
        tokenContract.options.address = sourceToken

        var data = tokenContract.methods.allowance(owner, this.networkAddress).encodeABI()

        return new Promise((resolve, reject) => {
            this.rpc.eth.call({
                to: sourceToken,
                data: data
            }, blockno)
                .then(result => {
                    var allowance = this.rpc.eth.abi.decodeParameters(['uint256'], result)
                    resolve(allowance[0])
                }).catch((err) => {
                    reject(err)
                })
        })
    }

    wrapperGetGasCap(blockno) {
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
                    reject(err)
                })
        })
    }

    getRateAtSpecificBlock(source, dest, srcAmount, blockno) {
        //special handle for official reserve
        var mask = converters.maskNumber()
        var srcAmountEnableFistBit = converters.sumOfTwoNumber(srcAmount,  mask)
        srcAmountEnableFistBit = converters.toHex(srcAmountEnableFistBit)
        // console.log("srcAmountEnableFistBit")
        // console.log(srcAmountEnableFistBit)

        var data = this.networkContract.methods.getExpectedRate(source, dest, srcAmountEnableFistBit).encodeABI()

        return new Promise((resolve, reject) => {
            this.rpc.eth.call({
                to: BLOCKCHAIN_INFO.network,
                data: data
            }, blockno)
                .then(result => {
                    //    console.log({source, dest, srcAmount, blockno})
                    //     console.log("rate: " + result)
                    if (result === "0x") {
                        // reject(new Error("Cannot get rate"))
                        resolve({
                            expectedPrice: "0",
                            slippagePrice: "0"
                        })
                        return
                    }
                    try {
                        var rates = this.rpc.eth.abi.decodeParameters([{
                            type: 'uint256',
                            name: 'expectedPrice'
                        }, {
                            type: 'uint256',
                            name: 'slippagePrice'
                        }], result)
                        //   console.log(rates)
                        resolve(rates)
                    } catch (e) {
                        reject(e)
                        // resolve({
                        //     expectedPrice: "0",
                        //     slippagePrice: "0"
                        // })
                    }
                }).catch((err) => {
                    console.log(err)
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

    getLimitOrderNonce(address, pair){
        return new Promise((resolve, reject) => {
            this.kyberswapContract.methods.nonces(address, pair).call().then(result => {
                resolve(result)
            }).catch(err => {
                console.log(err)
                reject(err)
            })
        })
    }

    getMessageHashTest(message){        
        return new Promise((resolve) => {
            var signature = this.rpc.utils.soliditySha3(message);     
            console.log(signature)       
            resolve(signature)
        })
    }

    getMessageHash(user, nonce, srcToken, srcQty, destToken, destAddress, minConversionRate, feeInPrecision){        
        return new Promise((resolve) => {
            var signature = this.rpc.utils.soliditySha3({t: 'address', v: user}, {t: 'uint256', v: nonce}, {t: 'address', v: srcToken}, {t: 'uint256', v: srcQty}, {t: 'address', v: destToken},
            {t: 'address', v: destAddress}, {t: 'uint256', v: minConversionRate}, {t: 'uint256', v: feeInPrecision});            
            resolve(signature)
        })
    }

    getSignatureParameters(signature){
        return new Promise((resolve) => {       
            var {v, r, s} = ethUtil.fromRpcSig(signature)
            r = ethUtil.bufferToHex(r)    
            s = ethUtil.bufferToHex(s)    

            console.log({v, s, r})
            resolve({v, r,s})
        })
    }
}
