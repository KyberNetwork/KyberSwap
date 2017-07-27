import { sealTxByKeystore } from "../utils/sealer"
import { verifyNonce } from "../utils/validators"
import store from "../store"
import { doTransaction, doApprovalTransaction } from "../actions/exchangeFormActions"
import constants from "../services/constants"
import Rate from "./rate"

export function etherToOthers(
  id, ethereum, account, sourceToken, sourceAmount, destToken,
  destAddress, maxDestAmount, minConversionRate,
  throwOnFailure, nonce, gas, gasPrice, keystring,
  password, callback) {

  var txData = ethereum.exchangeData(
    sourceToken, sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate, throwOnFailure)
  const txParams = {
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gas,
    to: ethereum.networkAddress,
    value: sourceAmount,
    data: txData,
    // EIP 155 chainId - mainnet: 1, ropsten: 3
    chainId: 42
  }
  const tx = sealTxByKeystore(txParams, keystring, password)
  store.dispatch(doTransaction(id, ethereum, tx, callback))
}

export function tokenToOthers(
  id, ethereum, account, sourceToken, sourceAmount, destToken,
  destAddress, maxDestAmount, minConversionRate,
  throwOnFailure, nonce, gas, gasPrice, keystring,
  password, callback) {

  const approvalData = ethereum.approveTokenData(sourceToken, sourceAmount)
  const txParams = {
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gas,
    to: sourceToken,
    value: 0,
    data: approvalData,
    // EIP 155 chainId - mainnet: 1, ropsten: 3
    chainId: 42
  }
  const approvalTx = sealTxByKeystore(txParams, keystring, password)
  store.dispatch(
    doApprovalTransaction(id, ethereum, approvalTx, (hash) => {
      const exchangeData = ethereum.exchangeData(
        sourceToken, sourceAmount, destToken, destAddress,
        maxDestAmount, minConversionRate, throwOnFailure)
      const newNonce = verifyNonce(nonce, 1)

      const exchangeTxParams = {
        nonce: newNonce,
        gasPrice: gasPrice,
        gasLimit: gas,
        to: ethereum.networkAddress,
        value: 0,
        data: exchangeData,
        // EIP 155 chainId - mainnet: 1, ropsten: 3
        chainId: 42
      }
      const exchangeTx = sealTxByKeystore(exchangeTxParams, keystring, password)
      console.log(exchangeTx)
      store.dispatch(doTransaction(id, ethereum, exchangeTx, callback))
  }))
}

export function fetchRate(ethereum, source, dest, reserve, callback) {
  ethereum.getRate(source.address, dest.address, reserve.index,
    (result) => {
      callback(new Rate(
        source, dest, reserve,
        result[0], result[1], result[2]))
    })
}
