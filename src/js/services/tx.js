import * as ethUtil from 'ethereumjs-util'
import constants from "../services/constants"
import BLOCKCHAIN_INFO from "../../../env"

export default class Tx {
  constructor(
    hash, from, gas, gasPrice, nonce, status = "pending",
    type, data, address) {
    this.hash = hash
    this.from = from
    this.gas = gas
    this.gasPrice = gasPrice
    this.nonce = nonce
    this.status = status
    this.type = type
    this.data = data // data can be used to store wallet name
    this.address = address
    this.threw = false
    this.error = null
    this.errorInfo = null
  }

  shallowClone() {
    return new Tx(
      this.hash, this.from, this.gas, this.gasPrice, this.nonce,
      this.status, this.type, this.data, this.address, this.threw,
      this.error, this.errorInfo, this.recap)
  }

  sync = (ethereum, tx) => {
    return new Promise((resolve, reject) => {
      ethereum.call("txMined")(tx.hash).then((receipt) => {
        var newTx = tx.shallowClone()
        newTx.address = receipt.contractAddress
        newTx.gas = receipt.gasUsed
        var logs = receipt.logs
        if (newTx.type == "exchange") {
          if (logs.length == 0) {
            newTx.threw = true
            newTx.status = "failed"
            newTx.error = "Warning! Log is empty"
          } else {
            var theLog
            for (var i = 0; i < logs.length; i++) {
              if (logs[i].address.toLowerCase() == BLOCKCHAIN_INFO.network &&
                logs[i].topics[0].toLowerCase() == constants.TRADE_TOPIC) {
                theLog = logs[i]
                break
              }
            }
            newTx.status = theLog ? "success" : "failed"
            newTx.error = theLog ? "" : "Warning! Error encountered during contract execution"
          }
        } else {
          newTx.status = "success"
        }
        resolve(newTx)
      })
    })
  }
}
