import { sealTxByKeystore, sealTxByTrezor, sealTxByLedger } from "../utils/sealer"
import { verifyNonce } from "../utils/validators"
import store from "../store"
import { doTransaction, doApprovalTransaction, saveRawExchangeTransaction, throwErrorSignExchangeTransaction } from "../actions/exchangeActions"
import { doTransaction as doTransactionTransfer, saveRawTransferTransaction, throwErrorSignTransferTransaction } from "../actions/transferActions"
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
  store.dispatch(doTransactionTransfer(id, ethereum, tx, callback))
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
  store.dispatch(doTransactionTransfer(id, ethereum, tx, callback))
}

export function sendEtherFromAccount(
  id, ethereum, account, sourceToken, sourceAmount,
  destAddress, nonce, gas, gasPrice, keystring, accountType,
  password) {

  const txParams = {
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gas,
    to: destAddress,
    value: sourceAmount,
    // EIP 155 chainId - mainnet: 1, ropsten: 3
    chainId: 42
  }
  switch (accountType) {
    case "keystore":
      const tx = sealTxByKeystore(txParams, keystring, password)
      return new Promise((resolve) => {
        resolve(tx)
      })
      //store.dispatch(doTransactionTransfer(id, ethereum, tx, callback))
      break
    case "trezor":
      txParams.address_n = keystring
      return sealTxByTrezor(txParams)
      // sealTxByTrezor(txParams, (tx) => {
      //   store.dispatch(saveRawTransferTransaction(tx))
      // }, (error) => {
      //   store.dispatch(throwErrorSignTransferTransaction(error))
      // })
      break
    case "ledger":
      txParams.address_n = keystring
      return sealTxByLedger(txParams)
      // sealTxByLedger(txParams, (tx) => {
      //   store.dispatch(saveRawTransferTransaction(tx))
      // }, (error) => {
      //   store.dispatch(throwErrorSignTransferTransaction(error))
      // })
      break
  }
}

export function sendTokenFromAccount(
  id, ethereum, account, sourceToken, sourceAmount,
  destAddress, nonce, gas, gasPrice, keystring, accountType,
  password) {

  var txData = ethereum.sendTokenData(
    sourceToken, sourceAmount, destAddress)
  const txParams = {
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gas,
    to: sourceToken,
    value: '0x0',
    data: txData,
    // EIP 155 chainId - mainnet: 1, ropsten: 3
    chainId: 42
  }

  switch (accountType) {
    case "keystore":
      const tx = sealTxByKeystore(txParams, keystring, password)
      return new Promise((resolve) => {
        resolve(tx)
      })
      //store.dispatch(doTransactionTransfer(id, ethereum, tx, callback))
      break
    case "trezor":
      txParams.address_n = keystring
      return sealTxByTrezor(txParams)
      // sealTxByTrezor(txParams, (tx) => {
      //   store.dispatch(saveRawTransferTransaction(tx))
      // }, (error) => {
      //   store.dispatch(throwErrorSignTransferTransaction(error))
      // })
      break
    case "ledger":
      txParams.address_n = keystring
      return sealTxByLedger(txParams)
      // sealTxByLedger(txParams, (tx) => {
      //   store.dispatch(saveRawTransferTransaction(tx))
      // }, (error) => {        
      //   store.dispatch(throwErrorSignTransferTransaction(error))
      // })
      break
  }

}

export function etherToOthersFromAccount(
  id, ethereum, account, sourceToken, sourceAmount, destToken,
  destAddress, maxDestAmount, minConversionRate,
  throwOnFailure, nonce, gas, gasPrice, keystring, accountType,
  password) {

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
  switch (accountType) {
    case "keystore":
      var tx = sealTxByKeystore(txParams, keystring, password)
      return new Promise((resolve) => {
        resolve(tx)
      })
      //store.dispatch(doTransaction(id, ethereum, tx, callback))
      break
    case "trezor":
      txParams.address_n = keystring
      return sealTxByTrezor(txParams)
      // sealTxByTrezor(txParams, (tx) => {
      //   store.dispatch(saveRawExchangeTransaction(tx))
      // }, (error) => {
      //   store.dispatch(throwErrorSignExchangeTransaction(error))
      // })
      break
    case "ledger":
      txParams.address_n = keystring
      return sealTxByLedger(txParams)
    // sealTxByLedger(txParams, (tx) => {
    //   store.dispatch password)

  }
  // }, (error) => {
  //   store.dispatch(throwErrorSignExchangeTransaction(error))
  // })
}
//const tx = sealTxByKeystore(txParams, keystring,

export function getAppoveToken(ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
  keystring, password, accountType) {
  const approvalData = ethereum.approveTokenData(sourceToken, sourceAmount)
  const txParams = {
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gas,
    to: sourceToken,
    value: '0x0',
    data: approvalData,
    // EIP 155 chainId - mainnet: 1, ropsten: 3
    chainId: 42
  }
  switch (accountType) {
    case "keystore":
      const approvalTx = sealTxByKeystore(txParams, keystring, password)
      return new Promise((resolve) => {
        resolve(approvalTx)
      })
    case "trezor":
      txParams.address_n = keystring
      return sealTxByTrezor(txParams)
    case "ledger":
      txParams.address_n = keystring
      return sealTxByLedger(txParams)

  }
}
export function tokenToOthersFromAccount(
  id, ethereum, account, sourceToken, sourceAmount, destToken,
  destAddress, maxDestAmount, minConversionRate,
  throwOnFailure, nonce, gas, gasPrice, keystring, accountType,
  password) {
    const exchangeData = ethereum.exchangeData(
      sourceToken, sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate, throwOnFailure)
    const newNonce = verifyNonce(nonce, 1)
    const exchangeTxParams = {
      nonce: newNonce,
      gasPrice: gasPrice,
      gasLimit: gas,
      to: ethereum.networkAddress,
      value: '0x0',
      data: exchangeData,
      // EIP 155 chainId - mainnet: 1, ropsten: 3
      chainId: 42
    }
  switch (accountType) {
    case "keystore":      
      const exchangeTx = sealTxByKeystore(exchangeTxParams, keystring, password)
      //console.log(exchangeTx)
      return new Promise((resolve) => {
        resolve(exchangeTx)
      })
      //store.dispatch(doTransaction(id, ethereum, exchangeTx, callback))
    case "trezor":
      exchangeTxParams.address_n = keystring
      return sealTxByTrezor(exchangeTxParams)
    case "ledger":
      exchangeTxParams.address_n = keystring
      return sealTxByLedger(txParaexchangeTxParamsms)
  }

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
  return new Promise((resolve, reject) => {
    ethereum.getRate(source.address, dest.address, reserve.index,
      (result) => {
        resolve(new Rate(
          source.name,
          source.symbol,
          source.icon,
          source.address,
          result[0],
          result[2]
        ))
      })
  })
}
