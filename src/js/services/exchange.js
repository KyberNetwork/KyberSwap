import { sealTxByKeystore } from "../utils/sealer"
import { verifyNonce } from "../utils/validators"
import store from "../store"
import { incManualNonceAccount } from "../actions/accountActions"
import constants from "../services/constants"
import SupportedTokens from "./supported_tokens"
import Rate from "./rate"

export function etherToOthers(
  ethereum, account, sourceToken, sourceAmount, destToken,
  destAddress, maxDestAmount, minConversionRate,
  throwOnFailure, nonce, gas, gasPrice, keystring,
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
  const tx = sealTxByKeystore(txParams, keystring, password)
  const broadcasted = ethereum.sendRawTransaction(tx)
  store.dispatch(incManualNonceAccount(account))
  return broadcasted
}

export function tokenToOthers(
  ethereum, account, sourceToken, sourceAmount, destToken,
  destAddress, maxDestAmount, minConversionRate,
  throwOnFailure, nonce, gas, gasPrice, keystring,
  password) {

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
  const broadcastedApprovalTx = ethereum.sendRawTransaction(approvalTx)
  store.dispatch(incManualNonceAccount(account))
  console.log(broadcastedApprovalTx)

  // actual exchange
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
  const broadcasted = ethereum.sendRawTransaction(exchangeTx)
  store.dispatch(incManualNonceAccount(account))
  return broadcasted
}

export function fetchRates(ethereum) {
  var tokens = [{
    name: "Ether",
    icon: "/img/ether.png",
    address: constants.ETHER_ADDRESS}]
  for (var i = 0; i < SupportedTokens.length; i++) {
    tokens.push({
      name: SupportedTokens[i].name,
      icon: SupportedTokens[i].icon,
      address: SupportedTokens[i].address
    })
  }
  var rates = {}
  for (var i = 0; i < tokens.length; i++) {
    for (var j = 0; j < tokens.length; j++) {
      if (i != j) {
        for (var k = 0; k < constants.RESERVES.length; k++) {
          var reserve = constants.RESERVES[k]
          var rateFromContract = ethereum.getRate(
            tokens[i].address, tokens[j].address, reserve.index)
          var rate = new Rate(
            tokens[i],
            tokens[j],
            reserve,
            rateFromContract[0],
            rateFromContract[1],
            rateFromContract[2],
          )
          rates[rate.id()] = rate
        }
      }
    }
  }
  return rates
}
