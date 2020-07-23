import BigNumber from 'bignumber.js'
import constants from "../services/constants"
import { compareTwoNumber } from "./converter";

export function verifyAccount(addr) {
  var valid = /^0x[0-9a-fA-F]{40}$/.test(addr)

  return valid ? null : "invalid"
}

export function verifyKey(keystring) {
  try {
    var key = JSON.parse(keystring)
    if (!key.address || key.address == "" || !key.crypto || key.crypto == "") {
      return "Invalid keystore file"
    }
  } catch (e) {
    return "Malformed JSON keystore file"
  }
  return null
}

export function verifyAmount(sourceAmount,
  balance,
  sourceSymbol,
  sourceDecimal,
  rate, destSymbol, destDecimal, maxCap) {

  var testAmount = parseFloat(sourceAmount)
  if (isNaN(testAmount)) {
    return "not a number"
  }
  var sourceAmountWei = new BigNumber(sourceAmount)
  if (sourceAmountWei == 'NaN' || sourceAmountWei == 'Infinity') {
    return "not a number"
  }
  //var weiParam = new BigNumber(10)
  sourceAmountWei = sourceAmountWei.times(Math.pow(10, sourceDecimal))


  //verify min source amount
  var rateBig = new BigNumber(rate)
  var estimateValue = sourceAmountWei
  if (sourceSymbol !== "ETH") {
    estimateValue = rateBig.times(sourceAmountWei).div(Math.pow(10, sourceDecimal))
  }
  var epsilon = new BigNumber(constants.EXCHANGE_CONFIG.EPSILON)
  var delta = estimateValue.minus(epsilon).abs()
  var acceptDetal = new BigNumber(constants.EXCHANGE_CONFIG.MIN_ACCEPT_DELTA)

  if (compareTwoNumber(rateBig, 0) === 1 && estimateValue.isLessThan(epsilon) && !delta.div(epsilon).isLessThan(acceptDetal)) {
    return "too small"
  }

  //verify max cap
  //estimate value based on eth
  if ((sourceSymbol !== "ETH" || destSymbol !== "WETH") && (sourceSymbol !== "WETH" || destSymbol !== "ETH")){
    if (maxCap !== "infinity") {
      var maxCap = new BigNumber(maxCap)
      if (sourceSymbol !== "ETH") {
        maxCap = maxCap.multipliedBy(constants.EXCHANGE_CONFIG.MAX_CAP_PERCENT)
      }
      if (estimateValue.isGreaterThan(maxCap)) {
        return "too high cap"
      }
    }
  }

  //verify balance for source amount
  var sourceBalance = new BigNumber(balance)
  if (sourceBalance == 'NaN' || sourceBalance == 'Infinity') {
    throw new Error("Invalid upper bound for amount")
  }
  if (sourceAmountWei.isGreaterThan(sourceBalance)) {
    return "too high"
  }


  return null
}

export function verifyBalanceForTransaction(ethBalance, sourceSymbol, sourceAmount, gas, gasPrice) {
  var bigEthBalance = new BigNumber(ethBalance.toString())

  if (typeof gasPrice === "undefined" || gasPrice === "") gasPrice = 0

  var gasPriceBig = new BigNumber(gasPrice.toString())
  var txFee = gasPriceBig.times(1000000000).times(gas)
  var totalFee

  if (sourceSymbol === "ETH") {
    if (sourceAmount === "") sourceAmount = 0
    var value = new BigNumber(sourceAmount.toString())
    value = value.times(1000000000000000000)
    totalFee = txFee.plus(value)
  } else {
    totalFee = txFee
  }

  if (totalFee.isGreaterThan(bigEthBalance)) {
    return "not enough"
  }

  return null
}

export function verifyNumber(amount) {
  var result = new BigNumber(amount)
  if (result == 'NaN' || result == 'Infinity') {
    return "invalid number"
  }
  if (result.isLessThan(0) < 0) {
    return "nagative"
  }
  return null
}

export function verifyNonce(nonce, future) {
  return (new BigNumber(nonce).plus(future || 0)).toNumber()
}

export function anyErrors(errors) {
  var keys = Object.keys(errors)
  for (var i = 0; i < keys.length; i++) {
    if (errors[keys[i]] != null && errors[keys[i]] != "") {
      return true
    }
  }
  return false
}

export function verifyPassphrase(passphrase, repassphrase) {
  if (passphrase !== repassphrase) {
    return "Password confirmation is not match"
  } else {
    return null
  }
}

export function filterInputNumber(event, value, preVal) {
  var strRemoveText = value.replace(/[^0-9.]/g, '')
  var str = strRemoveText.replace(/\./g, (val, i) => {
    if (strRemoveText.indexOf('.') != i) val = ''
    return val
  })
  if(str === "."){
    str = "0."
  }
  event.target.value = str

  if (preVal === str) return false
  return true
}
