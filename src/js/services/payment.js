import { sealTxByKeystore } from "../utils/sealer"
import { doTransaction } from "../actions/joinPaymentFormActions"
import constants from "../services/constants"
import store from "../store"


export function deployKyberWallet(
  ethereum, account, nonce, gas, gasPrice,
  keystring, password, callback) {

  var txData = ethereum.deployKyberWalletData(account.address)
  const txParams = {
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gas,
    data: txData,
    chainId: 42
  }
  const tx = sealTxByKeystore(txParams, keystring, password)
  store.dispatch(doTransaction(ethereum, tx, callback))
}

export function payByEther(
  ethereum, wallet, account, sourceToken, sourceAmount, destToken,
  destAddress, maxDestAmount, minConversionRate, throwOnFailure,
  onlyApproveToken, data, nonce, gas, gasPrice, keystring, password) {

  var txData = ethereum.paymentData(wallet.address,
    sourceToken, sourceAmount, destToken, maxDestAmount, minConversionRate,
    destAddress, data, onlyApproveToken, throwOnFailure)
  const txParams = {
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gas,
    to: wallet.address,
    value: 0,
    data: txData,
    // EIP 155 chainId - mainnet: 1, ropsten: 3
    chainId: 42
  }
  const tx = sealTxByKeystore(txParams, keystring, password)
  const broadcasted = ethereum.sendRawTransaction(tx)
  store.dispatch(incManualNonceAccount(account.address))
  return broadcasted
}

export function payByToken(
  ethereum, wallet, account, sourceToken, sourceAmount, destToken,
  destAddress, maxDestAmount, minConversionRate, throwOnFailure,
  onlyApproveToken, data, nonce, gas, gasPrice, keystring, password) {

  var txData = ethereum.paymentData(wallet.address,
    sourceToken, sourceAmount, destToken, maxDestAmount, minConversionRate,
    destAddress, data, onlyApproveToken, throwOnFailure)
  const txParams = {
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gas,
    to: wallet.address,
    value: 0,
    data: txData,
    // EIP 155 chainId - mainnet: 1, ropsten: 3
    chainId: 42
  }
  const tx = sealTxByKeystore(txParams, keystring, password)
  const broadcasted = ethereum.sendRawTransaction(tx)
  store.dispatch(incManualNonceAccount(account.address))
  return broadcasted
}
