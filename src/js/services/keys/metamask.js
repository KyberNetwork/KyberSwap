import * as keyService from "./baseKey"
import EthereumTx from "ethereumjs-tx"

export default class Metamask {

  callSignTransaction = (funcName, ...args) => {
    const { txParams, keystring, password } = keyService[funcName](...args)
    return this.sealTx(txParams, keystring, password)
  }

  sealTx = (txParams, web3Service, password) => {
    return new Promise((resolve, reject) => {
      web3Service.web3.eth.sendTransaction(txParams, function(err, transactionHash) {
        if (!err){
          resolve(transactionHash)
        }else{
          reject(err)
        }
      })
    })
  }
}
