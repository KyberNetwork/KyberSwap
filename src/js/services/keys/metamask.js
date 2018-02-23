import * as keyService from "./baseKey"
import EthereumTx from "ethereumjs-tx"

export default class Metamask {

  callSignTransaction = (funcName, ...args) => {
    return new Promise((resolve, reject) => {
      keyService[funcName](...args).then(result => {
        const { txParams, keystring, password } = result
        this.sealTx(txParams, keystring, password).then(result => {
          resolve(result)
        }).catch(e => {
          console.log(e.message)
          reject(e)
        })
      })
    })
    // const { txParams, keystring, password } = keyService[funcName](...args)
    // return this.sealTx(txParams, keystring, password)
  }

  sealTx = (txParams, web3Service, password) => {
    txParams.gas = txParams.gasLimit
    delete(txParams.gasLimit)

    return new Promise((resolve, reject) => {
      web3Service.web3.eth.sendTransaction(txParams, function(err, transactionHash) {
        if (!err){
          resolve(transactionHash)
        }else{
          console.log(err)
          reject(err.message)
        }
      })
    })
  }
}
