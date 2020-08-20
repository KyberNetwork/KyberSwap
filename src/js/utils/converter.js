import BigNumber from 'bignumber.js'
import constants from "../services/constants"
import BLOCKCHAIN_INFO from "../../../env"
import abiDecoder from "abi-decoder"

export function calculateMinAmount(source, rate) {
  var bigSource = new BigNumber(source)
  var bigRate = new BigNumber(rate)
  if (bigSource == 'NaN' || bigSource == 'Infinity' || acceptableTyping(source) ||
    bigRate == 'NaN' || bigRate == 'Infinity' || acceptableTyping(rate)) {
    return "0"
  }
  var minAmount = bigSource.times(bigRate).div(1000000000000000000)
  return minAmount
}

export function calculateDest(source, rate, precision) {
  if (isNaN(source) || source === ""){
    source = 0;
    return "";
  }

  var bigSource = new BigNumber(source)
  var bigRate = new BigNumber(rate)
  if (bigSource == 'NaN' || bigSource == 'Infinity' || acceptableTyping(source) ||
    bigRate == 'NaN' || bigRate == 'Infinity' || acceptableTyping(rate)) {
    return "0"
  }

  var dest = bigSource.times(bigRate).div(1000000000000000000)

  if (dest != 0 && precision) {
    return formatNumberByPrecision(dest, precision);
  }

  return dest
}

export function caculateSourceAmount(destAmount, offeredRate, precision) {
  if (!destAmount || !offeredRate || acceptableTyping(destAmount) || acceptableTyping(offeredRate)) {
    return ""
  }

  var bigOfferedRate = new BigNumber(offeredRate)

  if (bigOfferedRate.comparedTo(0) === 0) {
    return ""
  }

  var bigDest = new BigNumber(destAmount)
  bigOfferedRate = bigOfferedRate.div(1000000000000000000)
  var result = bigDest.div(bigOfferedRate)

  if (precision) {
    return formatNumberByPrecision(result, precision);
  } else {
    return result.toString()
  }
}

export function caculateDestAmount(sourceAmount, offeredRate, precision) {
  if (!sourceAmount || !offeredRate || acceptableTyping(sourceAmount) || acceptableTyping(offeredRate)) {
    return "";
  }


  var bigSource = new BigNumber(sourceAmount.toString())
  var bigOfferedRate = new BigNumber(offeredRate)

  bigOfferedRate = bigOfferedRate.div(1000000000000000000)
  var result = bigSource.times(bigOfferedRate)

  if (precision) {
    return formatNumberByPrecision(result, precision);
  } else {
    return result.toString()
  }
}

export function caculateTriggerRate(sourceAmount, destAmount, precision) {
  if (isNaN(sourceAmount) || sourceAmount === "" || sourceAmount == "0") {
    return 0
  }
  if (isNaN(destAmount) || destAmount === "" || destAmount == "0") {
    return 0
  }

  var bigSource = new BigNumber(sourceAmount.toString())
  var bigDest = new BigNumber(destAmount.toString())

  var result = bigDest.div(bigSource)
  if (precision) {
    // return result.toFixed(precision)
    return result.toPrecision(precision, 0)
  } else {
    return result.toString()
  }
}

export function roundingRate(rate) {
  if (isNaN(rate) || rate === "") {
    return 0
  }

  var bigRate = new BigNumber(rate).times(Math.pow(10, 18))
  return bigRate.toFixed(0)
}

export function calculateRate(source, dest) {
  var bigSource = new BigNumber(source)
  var bigDest = new BigNumber(dest)
  if (bigSource == 'NaN' || bigSource == 'Infinity' || acceptableTyping(source) ||
    bigDest == 'NaN' || bigDest == 'Infinity' || acceptableTyping(dest)) {
    return "0"
  }
  var rate = bigDest.times(1000000000000000000).div(bigSource)
  return rate
}

export function caculateEthBalance(token) {
  if (token.symbol.toLowerCase() == 'eth' || token.balance === "0") {
    return token.balance
  } else {
    var rateBig = new BigNumber(token.rate)
    var balanceBig = new BigNumber(token.balance)
    //var weiParam = new BigNumber(10)
    var balanceToken = balanceBig.div(Math.pow(10, token.decimals))

    var balanceEth = balanceToken.times(rateBig)
    return balanceEth.toString()
  }
}

export function mergeSort(arr, type) {
  if (arr.length === 1) {
    return arr
  }
  const middle = Math.floor(arr.length / 2)
  const left = arr.slice(0, middle)
  const right = arr.slice(middle)
  return merge(
    mergeSort(left, type),
    mergeSort(right, type),
    type
  )
}

function merge(left, right, type) {
  let result = []
  let indexLeft = 0
  let indexRight = 0

  while (indexLeft < left.length && indexRight < right.length) {
    var balanceEthA = new BigNumber(caculateEthBalance(left[indexLeft]))
    var balanceEthB = new BigNumber(caculateEthBalance(right[indexRight]))
    if (balanceEthA.comparedTo(balanceEthB) * type > 0) {
      result.push(left[indexLeft])
      indexLeft++
    } else if (balanceEthA.comparedTo(balanceEthB) * type < 0) {
      result.push(right[indexRight])
      indexRight++
    } else if (balanceEthA.comparedTo(balanceEthB) === 0) {
      var leftIsNew = left[indexLeft].isNew ? 1 : 0
      var rightIsNew = right[indexRight].isNew ? 1 : 0
      if (leftIsNew >= rightIsNew) {
        result.push(left[indexLeft])
        indexLeft++
      } else {
        result.push(right[indexRight])
        indexRight++
      }
    }
  }

  return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight))
}

export function sortETHBalance(tokens, isDesc, WETHToTop) {
  var sortedTokens = [];
  let tokensWithoutETH = { ...tokens };
  
  if (WETHToTop && tokensWithoutETH['WETH']) delete tokensWithoutETH['WETH'];
  if (tokensWithoutETH['ETH']) delete tokensWithoutETH['ETH'];
  
  if (tokens) {
    sortedTokens = mergeSort(Object.values(tokensWithoutETH), isDesc ? 1 : -1)
  }
  
  if (WETHToTop && tokens['WETH']) sortedTokens.unshift(tokens['WETH']);
  if (tokens['ETH']) sortedTokens.unshift(tokens['ETH']);
  
  return sortedTokens
}

function acceptableTyping(number) {
  // ends with a dot
  // if (number.length > 0 && number[number.length - 1] == ".") {
  //   return true
  // }

  // TODO refactor format
  // zero suffixed with real number
  // if (number.length > 0 && number[number.length - 1] == "0") {
  //   for (var i = 0; i < number.length; i++) {
  //     if (number[i] == ".") {
  //       return true
  //     }
  //   }
  // }
  return false
}

export function toTWei(number, decimal = 18) {
  //console.log({number, decimal})
  var bigNumber = new BigNumber(number.toString())
  if (bigNumber == 'NaN' || bigNumber == 'Infinity') {
    return number
  } else if (acceptableTyping(number)) {
    return number
  } else {

    return bigNumber.times(Math.pow(10, decimal)).toFixed(0)
  }
}

export function gweiToWei(number) {
  if (number === "" || isNaN(number)) {
    return "0"
  }
  var bigNumber = new BigNumber(number.toString())
  if (bigNumber == 'NaN' || bigNumber == 'Infinity') {
    return number
  } else if (acceptableTyping(number)) {
    return number
  } else {
    return bigNumber.times(1000000000).toFixed(0)
  }
}

export function gweiToEth(number) {
  if (number === "" || isNaN(number)) {
    return "0"
  }
  var bigNumber = new BigNumber(number.toString())
  if (bigNumber == 'NaN' || bigNumber == 'Infinity') {
    return number
  } else if (acceptableTyping(number)) {
    return number
  } else {
    return bigNumber.div(1000000000).toString()
  }
}

export function weiToGwei(number) {
  var bigNumber = new BigNumber(number)
  if (bigNumber == 'NaN' || bigNumber == 'Infinity') {
    return number
  } else if (acceptableTyping(number)) {
    return number
  } else {
    return bigNumber.div(1000000000).toString()
  }
}

export function toT(number, decimal, round) {
  BigNumber.config({ EXPONENTIAL_AT: 1e+9 })
  var bigNumber = new BigNumber(number.toString())
  var result
  if (bigNumber == 'NaN' || bigNumber == 'Infinity') {
    return number
  } else if (acceptableTyping(number)) {
    return number
  }
  if (decimal) {
    result = bigNumber.div(Math.pow(10, decimal));
  }
  else {
    result = bigNumber.div(1000000000000000000)
  }
  if (round) {
    return result.toFixed(round)
  } else {
    return result.toString()
  }
}

export function convertSellRate(rate) {
  var bigNumber = new BigNumber(rate.toString())
  var result = bigNumber.div(Math.pow(10, 18));
  return result.toString()
}

export function convertBuyRate(rate) {
  var bigNumber = new BigNumber(rate.toString())
  var result = bigNumber.div(Math.pow(10, 18));
  var zero = new BigNumber(0)
  if (result.comparedTo(zero) !== 0) {
    var oneNumber = new BigNumber(1)
    result = oneNumber.div(result)
    return result.toString()
  } else {
    return 0
  }
}

export function pairID(source, dest) {
  return source.address + "-" + dest.address
}

export function numberToHex(number) {
  return "0x" + (new BigNumber(number)).toString(16)
}

export function numberToHexAddress(number) {
  var hex = (new BigNumber(number)).toString(16)
  if (hex.length > 40) {
    return "0x" + Array(41).join("0")
  } else {
    return "0x" + Array(40 - hex.length + 1).join("0") + hex.toLowerCase()
  }
}

export function biggestNumber() {
  var initNumber = new BigNumber(2)
  return "0x" + (initNumber.pow(256).minus(1).toString(16))
}

export function maskNumber() {
  var initNumber = new BigNumber(2)
  return "0x" + (initNumber.pow(255).toString(16))
}

export function biggestNumberDecimal() {
  var initNumber = new BigNumber(10)
  return initNumber.pow(30).toString(10)
}

export function hexToNumber(hex) {
  return new BigNumber(hex).toNumber()
}

export function hexToString(hex) {
  return new BigNumber(hex).toString()
}

export function hexToBigNumber(hex) {
  return new BigNumber(hex)
}


export function toEther(number) {
  var bigNumber = new BigNumber(number)
  if (bigNumber == 'NaN' || bigNumber == 'Infinity') {
    return "0"
  } else {
    return bigNumber.dividedBy(1000000000000000000).toString()
  }
}

export function errorName(message) {
  var parts = message.split(". ")
  if (parts.length > 0) {
    return parts[0]
  } else {
    return message
  }
}


export function stringEtherToBigNumber(number, decimal) {
  var param = new BigNumber(10).pow(decimal ? decimal : 18)
  var bigNumber = new BigNumber(number.toString()).times(param)
  return bigNumber
}
export function stringToBigNumber(number) {
  var bigNumber = new BigNumber(number)
  return bigNumber
}

export function stringToNumber(str) {
  var bigNumber = new BigNumber(str)
  if (bigNumber == 'NaN' || bigNumber == 'Infinity') {
    return 0
  }
  return bigNumber.toNumber()
}

export function getBigNumberValueByPercentage(number, percentage) {
  if (percentage === 100) return number
  return stringToBigNumber(number.toString()).multipliedBy(percentage / 100);
}

export function stringToHex(number, decimal) {
  if (number === "" || isNaN(number)) return "0x0"
  var param = new BigNumber(10).pow(decimal ? decimal : 18)
  var bigNumber = new BigNumber(number).times(param)
  bigNumber = new BigNumber(bigNumber.toFixed(0))
  return "0x" + bigNumber.toString(16)
}

export function roundingNumber(number) {
  var MAX_DIGIS = 7, SIZE = 3;
  number = +number;
  let numberStr = number.toString();
  if (isNaN(number) || number <= 0) number = 0;
  if (number < 1e-7) number = 0;
  if (('' + Math.floor(number)).length >= MAX_DIGIS) {
    return Math.floor(number).toLocaleString();
  }

  let count_0 = 0
  for (let j of numberStr) {
    if (j == '.') continue
    if (j == 0)
      count_0++
    else
      break
  }

  let minDisplay = MAX_DIGIS - count_0 < 4 ? 4 : MAX_DIGIS - count_0

  let precision = number.toPrecision((number < 1 && number > 0) ? minDisplay : MAX_DIGIS);
  precision = (precision * 1).toString();

  let arr = precision.split('.'),
    intPart = arr[0],
    i = intPart.length % SIZE || SIZE,
    result = intPart.substr(0, i);

  for (; i < intPart.length; i += SIZE) {
    result +=  intPart.substr(i, SIZE);
  }
  if (arr[1]) {
    result += '.' + arr[1];
  }
  return result;
}

export function roundingRateNumber(number) {
  var MAX_DIGIS = 7, SIZE = 3;
  number = +number;
  let numberStr = number.toString();
  if (isNaN(number) || number <= 0) number = 0;
  if (number < 1e-18) number = 0;
  if (('' + Math.floor(number)).length >= MAX_DIGIS) {
    return Math.floor(number).toLocaleString();
  }

  let count_0 = 0
  for (let j of numberStr) {
    if (j == '.') continue
    if (j == 0)
      count_0++
    else
      break
  }

  let minDisplay = MAX_DIGIS - count_0 < 4 ? 4 : MAX_DIGIS - count_0

  let precision

  const numBig = new BigNumber(number);

  if (numBig.comparedTo(0) > 0 && numBig.comparedTo(0.0001) < 0) {
    precision = new BigNumber(number).toPrecision(4)
  } else {
    precision = number.toPrecision((number < 1 && number > 0) ? minDisplay : MAX_DIGIS);
    precision = (precision * 1).toString();
  }

  let arr = precision.split('.'),
    intPart = arr[0],
    i = intPart.length % SIZE || SIZE,
    result = intPart.substr(0, i);

  for (; i < intPart.length; i += SIZE) {
    result +=  intPart.substr(i, SIZE);
  }
  if (arr[1]) {
    result += '.' + arr[1];
  }
  return result;
}

export function toPrimitiveNumber(x) {
  var bigNum = new BigNumber(x)
  return bigNum.toString(10)
};

export function caculateTokenEpsilon(rate, decimal, symbol) {
  var tokenRate = rate
  if (symbol === "ETH") {
    tokenRate = new BigNumber(10).pow(18)
  }
  var epsilon = new BigNumber(constants.EXCHANGE_CONFIG.EPSILON)
  var ts = epsilon.times(Math.pow(10, decimal))
  return ts.div(tokenRate)
}

export function getDifferentAmount(sourceAmount, prevAmount, sourceDecimal,
  minRate, sourceTokenSymbol) {
  if ((sourceAmount === "") || isNaN(sourceAmount)) sourceAmount = 0
  if (sourceTokenSymbol === 'ETH') {
    return Math.abs(sourceAmount - prevAmount)
  } else {
    var valueChange = Math.abs(sourceAmount - prevAmount)
    var rate = new BigNumber(minRate)
    var rateWeight = new BigNumber(10).pow(18)
    rate = rate.div(rateWeight)

    var value = new BigNumber(valueChange + "")
    value = value.multipliedBy(rate)

    return value.toNumber()
  }
}

export function compareTwoNumber(num1, num2) {
  var num1Big = new BigNumber(num1.toString())
  var num2Big = new BigNumber(num2.toString())
  return num1Big.comparedTo(num2Big)
}

export function compareRate(minRate, expectedRate) {
  if ((minRate === "") || isNaN(minRate)) return -1
  if ((expectedRate === "") || isNaN(expectedRate)) return -1

  var minRateBig = new BigNumber(minRate)
  var rateWeight = Math.pow(10, 18)
  minRateBig = minRateBig.times(rateWeight)

  var expectedRateBig = new BigNumber(expectedRate)
  return minRateBig.comparedTo(expectedRateBig)
}

export function calculatePercentRate(minRate, expectedRate) {
  if ((minRate === "") || isNaN(minRate)) return 0
  if ((expectedRate === "") || isNaN(expectedRate)) return 0
  if (+expectedRate == 0) return 0

  var minRateBig = new BigNumber(minRate)
  var rateWeight = new BigNumber(10).pow(20)
  minRateBig = minRateBig.times(rateWeight)

  var expectedRateBig = new BigNumber(expectedRate)

  var percent = minRateBig.dividedBy(expectedRate)

  var fullNumber = new BigNumber(100)

  var remainPercent = fullNumber.minus(percent)

  var remainPercentStr = remainPercent.toFixed(1)

  return parseFloat(remainPercentStr)
}

export function totalFee(gasPrice, gasUsed) {
  var gasPrice = stringToBigNumber(gweiToWei(gasPrice))
  var fee = gasPrice.multipliedBy(gasUsed)
  return fee.toString()
}

export function calculateGasFee(gasPrice, gasUsed) {
  var gasPrice = stringToBigNumber(gweiToEth(gasPrice))
  var totalGas = gasPrice.multipliedBy(gasUsed)
  return roundingNumber(totalGas.toString())
}

export function findNetworkName(networkId) {
  switch (networkId) {
    case 0:
      return "Olympic Network"
    case 1:
      return "Mainnet"
    case 2:
      return "Morden Network"
    case 3:
      return "Ropsten Network"
    case 4:
      return "Rinkeby Network"
    case 42:
      return "Kovan Network"
    default:
      return null
  }
}

export function findNetworkCode(networkId) {
  switch (networkId) {
    case 1:
      return "mainnet";
    case 3:
      return "ropsten";
    case 4:
      return "rinkeby";
    default:
      return 'mainnet';
  }
}

export function sliceErrorMsg(err) {
  if (err.length > 70) {
    err = err.slice(0, 70) + '...'
  }
  return err
}



export function calculatePercent(numerator, denumerator) {
  if (denumerator === 0) return 0
  var percent = ((numerator - denumerator) / numerator) * 100
  var roundPercent = Math.round(percent * 10) / 10
  return roundPercent
}

export function percentChange(newPrice, oldPrice) {
  if (oldPrice === 0) return 0
  var percent = ((newPrice - oldPrice) / oldPrice) * 100
  var roundPercent = Math.round(percent * 10) / 10
  return roundPercent
}

export function formatNumber(number, round = null, groupSeparator = '') {
  var format = {
    decimalSeparator: '.',
    groupSeparator: groupSeparator,
    groupSize: 3,
  }
  BigNumber.config({ FORMAT: format })
  var numberStr = number.toString()
  var numberFormat = new BigNumber(numberStr.replace(",",""))

  if (numberFormat == 'NaN' || numberFormat == 'Infinity') {
    return "0";
  }

  if (groupSeparator !== '' && isNaN(numberFormat.toFormat())) {
    return numberFormat.toFormat(round);
  } else {
    return +numberFormat.toFormat(round);
  }
}

export function caculatorPercentageToRate(number, total) {
  if (new BigNumber(total) !== 0) {
    return (new BigNumber(number) / new BigNumber(total)) * 100000000000000000000
  }
  return 0;
}

export function caculatorRateToPercentage(number, total) {
  if (new BigNumber(total) !== 0) {
    return (new BigNumber(number) * new BigNumber(total)) / 100000000000000000000
  }
  return 0;
}


export function estimateSlippagerate(expectedRate) {
  var bigNumber = new BigNumber(expectedRate.toString())
  var result = bigNumber.div(1000000000000000000).times(0.97)
  return result.toString()
}


export function getMinrate(rate, minRate) {
  if (isNaN(rate) || rate === "") {
    rate = 0
  }
  if (isNaN(minRate) || minRate === "") {
    minRate = 0
  }
  rate = rate.toString()
  minRate = minRate.toString()

  if (minRate === "0") {
    var bigNumber = new BigNumber(rate)
    var result = bigNumber.div(1000000000000000000).times(0.97)
    return result.toString()
  } else {
    return minRate
  }
}


export function calculateMinSource(sourceTokenSymbol, sourceAmount, decimal, rateSell) {
  if ((sourceAmount === "") || isNaN(sourceAmount)) sourceAmount = 0

  var minSourceAllow = new BigNumber(getSourceAmountZero(sourceTokenSymbol, decimal, rateSell))

  var sourceAmountBig = new BigNumber(sourceAmount.toString())
  sourceAmountBig = sourceAmountBig.times(Math.pow(10, decimal))
  if (minSourceAllow.comparedTo(sourceAmountBig) === 1) {
    return "0x" + minSourceAllow.toString(16)
  } else {
    var sourceAmountDecimal = sourceAmountBig.toFixed(0)
    var sourceAmountHex = new BigNumber(sourceAmountDecimal)
    return "0x" + sourceAmountHex.toString(16)
  }
}


export function getSourceAmountZero(sourceTokenSymbol, decimal, rateSell) {
  var minAmount = toTWei(BLOCKCHAIN_INFO.min_accept_amount)

  var minETHAllow = new BigNumber(minAmount.toString())

  if (sourceTokenSymbol === "ETH") {
    return minETHAllow.toFixed(0)
  }
  var rate = new BigNumber(rateSell)
  if (rate.comparedTo(0) === 0) {
    var minNumber
    if (sourceTokenSymbol !== "REN") {
      minNumber = Math.pow(10, Math.round(decimal / 2))
    } else {
      minNumber = Math.pow(10, decimal)
    }

    return minNumber.toString()
  }
  var minSourceAllow = minETHAllow.div(rate).times(Math.pow(10, decimal))
  return minSourceAllow.toFixed(0)
}


export function toHex(number) {
  var bigNumber = new BigNumber(number)
  return "0x" + bigNumber.toString(16)
}


export function subOfTwoNumber(num1, num2) {
  var num1 = new BigNumber(num1.toString())
  var num2 = new BigNumber(num2.toString())
  var sum = num1.minus(num2)
  return sum.toString()
}

export function sumOfTwoNumber(num1, num2) {
  var num1 = new BigNumber(num1.toString())
  var num2 = new BigNumber(num2.toString())
  var sum = num1.plus(num2)
  return sum.toString()
}

export function multiplyOfTwoNumber(first, second) {
  const firstBig = new BigNumber(first.toString());
  const secondBig = new BigNumber(second.toString());

  if (firstBig == 'NaN' || firstBig == 'Infinity' || secondBig == 'NaN' || secondBig == 'Infinity') {
    return "0";
  }

  const result = firstBig.times(secondBig);
  return result.toString();
}

export function divOfTwoNumber(first, second) {
  const firstBig = new BigNumber(first.toString());
  const secondBig = new BigNumber(second.toString());

  if (firstBig == 'NaN' || firstBig == 'Infinity' || secondBig == 'NaN' || secondBig == 'Infinity') {
    return "0";
  }

  const result = firstBig.div(secondBig);
  return result.toString();
}

export function bigPow(n, m) {
  var x = new BigNumber(n)
  x.exponentiatedBy(m)
  return x
}

export function concatTokenAddresses(source, dest) {
  var sourceFactor = source.substring(0, source.length - 8)
  var destFactor = dest.substring(2, dest.length - 8)

  return sourceFactor + destFactor
}

export function base64toHEX(base64) {

  var raw = atob(base64);

  var HEX = '';

  for (var i = 0; i < raw.length; i++) {

    var _hex = raw.charCodeAt(i).toString(16)

    HEX += (_hex.length == 2 ? _hex : '0' + _hex);

  }
  return HEX.toUpperCase();
}


export function calculateMinNonce(address) {
  var addrFactor = address.substring(0, address.length - 8)
  return addrFactor.toLowerCase() + "00000000000000000000000000000000"
}

/**
 * Find nonce in format which bigger than contract nonce, even though contract nonce is in correct format or not.
 * @param String contractNonce: Nonce in number format
 * @param String address: 
 * 
 * Return Nonce in hex format
 */
export function calculateContractNonce(contractNonce, address) {
  const minNonce = calculateMinNonce(address);
  const minNonceBig = new BigNumber(minNonce);

  const contractNonceBig = new BigNumber(contractNonce);

  const compare = minNonceBig.comparedTo(contractNonceBig);
  switch(compare) {
    case 0: 
      return minNonce.substring(0, minNonce.length - 1) + "1";
    case 1: {
      return minNonce;
    }
    case -1: {
      const diff = contractNonceBig.minus(minNonceBig);
      const maxSuffix = "0x" + "f".repeat(32);
      const maxSuffixBig = new BigNumber(maxSuffix);

      if (diff.comparedTo(maxSuffixBig) < 0) {
        const suffix = diff.plus(1).toString(16);
        return minNonce.substring(0, 34) + "0".repeat(32).substring(0, 32 - suffix.length) + suffix;
      } else {
        throw new Error("Cannot find a nonce, that is greater than nonce from the smartcontract.");
      }
    }
    default: {
      throw new Error("Invalid nonce");
    }
  }
}

export function findMaxNumber(arr) {
  if (arr.length === 0) return false
  var maxNum = arr[0]
  for (var i = 1; i < arr.length; i++) {
    if (compareTwoNumber(arr[i], maxNum) == 1) {
      maxNum = arr[i]
    }
  }
  return maxNum
}

export function displayNumberWithDot(num, numDigit = 7) {
  var numDisplay = parseFloat(num)
  numDisplay = isNaN(numDisplay) ? 0 : numDisplay.toFixed(10).replace(/\.?0+$/,"")
  numDisplay = numDisplay.toString()
  if (numDisplay.length > numDigit) {
    numDisplay = numDisplay.substring(0, numDigit) + "..."
  }
  return numDisplay
}

export function formatNumberByPrecision(number, precision = 4) {
  if (number === undefined) return;

  const amountBigNumber = new BigNumber(number);

  if (amountBigNumber == 'NaN' || amountBigNumber == 'Infinity') {
    return "0";
  }

  const amountString = amountBigNumber.toFixed().toString();
  const indexOfDecimal = amountString.indexOf('.');

  return indexOfDecimal !== -1 ? amountString.slice(0, indexOfDecimal + (precision + 1)) :amountString;
}

export function decodeTxInput(input, abi) {
  abiDecoder.addABI(abi);
  return abiDecoder.decodeMethod(input);
}

export function convertToETHBalance(balance, decimals, symbol, rate) {
  return toT(multiplyOfTwoNumber(toT(balance, decimals), symbol === "ETH" ? "1000000000000000000" : rate));
}

export function convertTimestampToTime(timestamp) {
  const date = new Date(timestamp*1000);
  return `${addZeroToSingleNumber(date.getHours())}:${addZeroToSingleNumber(date.getMinutes())}:${addZeroToSingleNumber(date.getSeconds())}`;
}

function addZeroToSingleNumber(number) {
  if (number < 10) number = `0${number}`;
  return number;
}

export function splitArrayToChunks(array, chunk = 8){
  let i,j,temparray;
  const returnArray = []
  for (i=0,j=array.length; i<j; i+=chunk) {
      temparray = array.slice(i,i+chunk);
      returnArray.push(temparray)
  }
  return returnArray
}

export function formatAddress(address, first = 15, last = -4) {
  return `${address.slice(0, first)}...${address.slice(last)}`;
}

export function shortenBigNumber(amount, exponential = 1) {
  return Number.parseFloat(amount).toExponential(exponential);
}

export function calculateExpectedRateWithFee(expectedRate, fee) {
  const pow = Math.pow(10, 18);
  const feeInPercentage = fee / 10000;
  const bigExpectedRate = new BigNumber(expectedRate).div(pow);
  const feeInNumber = multiplyOfTwoNumber(bigExpectedRate, feeInPercentage);
  const rateWithFee = new BigNumber(subOfTwoNumber(bigExpectedRate, feeInNumber));

  return rateWithFee.times(pow).toString();
}

export function calculateSrcAmountWithFee(srcAmount, fee) {
  const feeInPercentage = fee / 10000;
  const feeInNumber = multiplyOfTwoNumber(srcAmount, feeInPercentage);

  return sumOfTwoNumber(srcAmount, feeInNumber);
}
