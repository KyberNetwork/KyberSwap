import { sealTxByKeystore } from "../utils/sealer"
import { incManualNonceAccount } from "../actions/accountActions"
import constants from "../services/constants"
import store from "../store"


export function deployKyberWallet(
  ethereum, account, nonce, gas, gasPrice, keystring, password) {

  var txData = ethereum.deployKyberWalletData(account.address)
  const txParams = {
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gas,
    data: txData,
    chainId: 42
  }
  const tx = sealTxByKeystore(txParams, keystring, password)
  const broadcasted = ethereum.sendRawTransaction(tx)
  store.dispatch(incManualNonceAccount(account.address))
  return broadcasted
}
