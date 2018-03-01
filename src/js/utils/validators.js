import BigNumber from 'bignumber.js'
import constants from "../services/constants"

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
  rate, destDecimal, maxCap) {
  //verify number for source amount
  var testAmount = parseFloat(sourceAmount)
  if (isNaN(testAmount)) {
    return "not a number"
  }
  var sourceAmountWei = new BigNumber(sourceAmount)
  if (sourceAmountWei == 'NaN' || sourceAmountWei == 'Infinity') {
    return "not a number"
  }
  var weiParam = new BigNumber(10)
  sourceAmountWei = sourceAmountWei.times(weiParam.pow(sourceDecimal))

  //verify balance for source amount
  var sourceBalance = new BigNumber(balance)
  if (sourceBalance == 'NaN' || sourceBalance == 'Infinity') {
    throw new Error("Invalid upper bound for amount")
  }
  if (sourceAmountWei.isGreaterThan(sourceBalance)) {
    return "too high"
  }

  //verify min source amount
  var rateBig = new BigNumber(rate)
  var estimateValue = sourceAmountWei
  if (sourceSymbol !== "ETH") {
    estimateValue = rateBig.times(sourceAmountWei).div(weiParam.pow(sourceDecimal))
  }
  var epsilon = new BigNumber(constants.EPSILON)
  if (estimateValue.isLessThan(epsilon)) {
    return "too small"
  }

  //verify max cap
  //estimate value based on eth
  var maxCap = new BigNumber(maxCap)
  if(sourceSymbol !=="ETH"){
    maxCap = maxCap.multipliedBy(constants.MAX_CAP_PERCENT)
  }
  if (estimateValue.isGreaterThan(maxCap)) {
    return "too high cap"
  }
  return null
}

export function verifyBalanceForTransaction(
  ethBalance, sourceSymbol, sourceAmount, 
  gas, gasPrice
) {

  var bigEthBalance = new BigNumber(ethBalance)

  //calcualte tx fee
  if (gasPrice === "") gasPrice = 0
  var gasPriceBig = new BigNumber(gasPrice)
  var txFee = gasPriceBig.times(1000000000).times(gas)

  var totalFee
  if (sourceSymbol === "ETH"){
    console.log(sourceAmount)
    if (sourceAmount === "") sourceAmount = 0
    var value = new BigNumber(sourceAmount)
    value = value.times(1000000000000000000)
    totalFee = txFee.plus(value)
  } else{
    totalFee = txFee
  } 
  

  if (totalFee.isGreaterThan(bigEthBalance)){
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
  event.target.value = str
  if(preVal == str) return false
  return true
}
