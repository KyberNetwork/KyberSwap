import * as keyService from "./baseKey"
import { sealTxByKeystore} from "../../utils/sealer"

export default class KeyStore {

  callSignTransaction = (funcName, ...args) =>{
    const { txParams, keystring, password } = keyService[funcName](...args)
    const tx = sealTxByKeystore(txParams, keystring, password)
    return new Promise((resolve) => {
      resolve(tx)
    })
  }
}
