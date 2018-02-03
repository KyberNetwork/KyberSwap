import * as keyService from "./baseKey"
import EthereumTx from "ethereumjs-tx"

export default class PrivateKey {
  callSignTransaction = (funcName, ...args) => {
    return new Promise((resolve, reject) => {
      keyService[funcName](...args).then(result => {
        const { txParams, keystring, } = result
        const tx = this.sealTx(txParams, keystring)
        resolve(tx)
      }).catch(e => {
        console.log(e)
        reject(e)
      })
    })

    // const { txParams, keystring, } = keyService[funcName](...args)
    // console.log(txParams, keystring)
    // const tx = this.sealTx(txParams, keystring)
    // console.log(tx)
    // return new Promise((resolve) => {
    //   resolve(tx)
    // })
  }

  sealTx = (params, keystring) => {
    const tx = new EthereumTx(params)
    const privateKey = Buffer.from(keystring, 'hex')
    tx.sign(privateKey)
    return tx
  }
}
