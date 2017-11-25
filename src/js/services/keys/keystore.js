import * as keyService from "./baseKey"
import EthereumTx from "ethereumjs-tx"
import { unlock } from "../../utils/keys"

export default class KeyStore {

  callSignTransaction = (funcName, ...args) =>{
    const { txParams, keystring, password } = keyService[funcName](...args)
    const tx = this.sealTx(txParams, keystring, password)
    return new Promise((resolve) => {
      resolve(tx)
    })
  }

  sealTx = (txParams, keystring, password) => {
    const tx = new EthereumTx(txParams)
    const privKey = unlock(keystring, password, true)
    tx.sign(privKey)
    return tx
  }
}
