import * as keyService from "./baseKey"
import { sealTxByPrivateKey } from "../../utils/sealer"

export default class KeyStore {
  callSignTransaction = (funcName, ...args) => {
    const { txParams, keystring, } = keyService[funcName](...args)
    const tx = sealTxByPrivateKey(txParams, keystring)
    return new Promise((resolve) => {
      resolve(tx)
    })
  }
}
