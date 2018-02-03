import * as keyService from "./baseKey"
import EthereumTx from "ethereumjs-tx"
import { unlock } from "../../utils/keys"

export default class KeyStore {

  callSignTransaction = (funcName, ...args) =>{
    return new Promise((resolve) => {
      keyService[funcName](...args).then(result => {
        const { txParams, keystring, password } = result
        const tx = this.sealTx(txParams, keystring, password)
        resolve(tx)
      })
    })
  }

  sealTx = (txParams, keystring, password) => {
    const tx = new EthereumTx(txParams)
    const privKey = unlock(keystring, password, true)
    tx.sign(privKey)
    return tx
  }
}
