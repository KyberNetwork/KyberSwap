import { sealTxByKeystore } from "../utils/sealer"
import { verifyNonce } from "../utils/validators"
import store from "../store"
import { doTransaction, doApprovalTransaction } from "../actions/exchangeFormActions"
import constants from "../services/constants"
import Rate from "./rate"

export function sendEtherFromWallet(
  id, ethereum, account, sourceToken, sourceAmount,
  destAddress, nonce, gas, gasPrice, keystring,
  password, callback, wallet) {

  var txData = ethereum.executeWalletData(
    wallet.address, destAddress, sourceAmount, "")
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
  store.dispatch(doTransaction(id, ethereum, tx, callback))
}

export function sendTokenFromWallet(
  id, ethereum, account, sourceToken, sourceAmount,
  destAddress, nonce, gas, gasPrice, keystring,
  password, callback, wallet) {

  var sendTokenData = ethereum.sendTokenData(
    sourceToken, sourceAmount, destAddress)
  var txData = ethereum.executeWalletData(
    wallet.address, sourceToken, 0, sendTokenData)
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
  store.dispatch(doTransaction(id, ethereum, tx, callback))
}

export function sendEtherFromAccount(
  id, ethereum, account, sourceToken, sourceAmount,
  destAddress, nonce, gas, gasPrice, keystring,
  password, callback) {

  const txParams = {
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gas,
    to: destAddress,
    value: sourceAmount,
    // EIP 155 chainId - mainnet: 1, ropsten: 3
    chainId: 42
  }
  const tx = sealTxByKeystore(txParams, keystring, password)
  store.dispatch(doTransaction(id, ethereum, tx, callback))
}

export function sendTokenFromAccount(
  id, ethereum, account, sourceToken, sourceAmount,
  destAddress, nonce, gas, gasPrice, keystring,
  password, callback) {

  var txData = ethereum.sendTokenData(
    sourceToken, sourceAmount, destAddress)
  const txParams = {
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gas,
    to: sourceToken,
    value: 0,
    data: txData,
    // EIP 155 chainId - mainnet: 1, ropsten: 3
    chainId: 42
  }
  const tx = sealTxByKeystore(txParams, keystring, password)
  store.dispatch(doTransaction(id, ethereum, tx, callback))
}

export function etherToOthersFromAccount(
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

export function exchangeFromWallet(
  id, ethereum, account, sourceToken, sourceAmount, destToken,
  destAddress, maxDestAmount, minConversionRate,
  throwOnFailure, nonce, gas, gasPrice, keystring,
  password, callback, wallet) {

  var txData = ethereum.paymentData(
    wallet.address, sourceToken, sourceAmount,
    destToken, maxDestAmount, minConversionRate,
    destAddress, "", false, throwOnFailure)
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
  store.dispatch(doTransaction(id, ethereum, tx, callback))
}

export function tokenToOthersFromAccount(
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

export function fetchRatePromise(ethereum, source, dest, reserve) {
  return new Promise((resolve, reject)=>{
    ethereum.getRate(source.address, dest.address, reserve.index,
    (result) => {
      resolve(new Rate(
        source, dest, reserve,
        result[0], result[1], result[2]))
    })  
  })  
}
