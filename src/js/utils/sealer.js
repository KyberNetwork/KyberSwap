import EthereumTx from "ethereumjs-tx"
import { unlock } from "./keys"

export function sealTxByKeystore(params, keystore, password) {
  const tx = new EthereumTx(params)
  const privKey = unlock(keystore, password, true)
  tx.sign(privKey)
  return tx
}
