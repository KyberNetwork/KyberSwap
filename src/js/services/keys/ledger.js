import * as keyService from "./baseKey"
import { sealTxByLedger } from "../../utils/sealer"

export default class Ledger {

  callSignTransaction = (funcName, ...args) => {
    const { txParams, keystring, } = keyService[funcName](...args)
    txParams.address_n = keystring
    return sealTxByLedger(txParams)
  }
}
