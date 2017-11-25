import * as keyService from "./baseKey"
import { sealTxByTrezor } from "../../utils/sealer"

export default class Trezor {

  callSignTransaction = (funcName, ...args) => {
    const { txParams, keystring, } = keyService[funcName](...args)
    txParams.address_n = keystring
    console.log("---------------------------")
    console.log(txParams)
    return sealTxByTrezor(txParams)
  }
}
