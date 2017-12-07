import * as keyService from "./baseKey"
import EthereumTx from "ethereumjs-tx"

export default class KeyStore {
  callSignTransaction = (funcName, ...args) => {
    const { txParams, keystring, } = keyService[funcName](...args)
    const tx = this.sealTx(txParams, keystring)
    return new Promise((resolve) => {
      resolve(tx)
    })
  }

  sealTx = (params, keystring) => {
    const tx = new EthereumTx(params)
    const privateKey = Buffer.from(keystring, 'hex')
    tx.sign(privateKey)
    return tx
  }
}
