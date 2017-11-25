import * as keyService from "./baseKey"
import EthereumTx from "ethereumjs-tx"
import { signLedgerTransaction, connectLedger } from "../../services/device/device"

export default class Ledger {

  callSignTransaction = (funcName, ...args) => {
    const { txParams, keystring, } = keyService[funcName](...args)
    txParams.address_n = keystring
    return this.sealTx(txParams)
  }

  sealTx = (params) => {
    const eTx = new EthereumTx(params)
    eTx.raw[6] = Buffer.from([params.chainId])
    let txToSign = ethUtil.rlp.encode(eTx.raw)
    return new Promise((resolve, reject) => {
      connectLedger().then((eth) => {
        signLedgerTransaction(eth, params.address_n, txToSign.toString('hex')).then((response) => {
          if (response.status) {
            params.v = "0x" + response['v']
            params.r = "0x" + response['r']
            params.s = "0x" + response['s']
            var tx = new EthereumTx(params)
            resolve(tx);
          } else {
            reject(response.error)
          }
        })
      }).catch((err) => {
        reject(err)
      })
    })
  }
}
