// in this package, all number are in 18 decimals precision

import BigNumber from 'bignumber.js'
import constants from "../services/constants"


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

export function calculateDest(source, rate) {
  //console.log({source, rate})
  if (isNaN(source) || source === ""){
    source = 0
  }
  var bigSource = new BigNumber(source)
  var bigRate = new BigNumber(rate)
  if (bigSource == 'NaN' || bigSource == 'Infinity' || acceptableTyping(source) ||
    bigRate == 'NaN' || bigRate == 'Infinity' || acceptableTyping(rate)) {
    return "0"
  }
  var dest = bigSource.times(bigRate).div(1000000000000000000)
  return dest
}

export function caculateSourceAmount(destAmount, offeredRate, precision) {
  if (!destAmount || !offeredRate || acceptableTyping(destAmount) || acceptableTyping(offeredRate)) {
    return "0"
  }
  var bigDest = new BigNumber(destAmount)
  var bigOfferedRate = new BigNumber(offeredRate)

  bigOfferedRate = bigOfferedRate.div(1000000000000000000)
  var result = bigDest.div(bigOfferedRate)
  if (precision) {
    return result.toFixed(precision)
  } else {
    return result.toString()
  }
}

export function caculateDestAmount(sourceAmount, offeredRate, precision) {
  if (!sourceAmount || !offeredRate || acceptableTyping(sourceAmount) || acceptableTyping(offeredRate)) {
    return "0"
  }
  var bigSource = new BigNumber(sourceAmount)
  var bigOfferedRate = new BigNumber(offeredRate)

  bigOfferedRate = bigOfferedRate.div(1000000000000000000)
  var result = bigSource.times(bigOfferedRate)
  if (precision) {
    return result.toFixed(precision)
  } else {
    return result.toString()
  }
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

export function caculateEthBalance(token){
  if(token.symbol.toLowerCase() == 'eth'){
    return token.balance
  } else {
    var rateBig = new BigNumber(token.rate)
    var balanceBig = new BigNumber(token.balance)
    var weiParam = new BigNumber(10)
    var balanceToken = balanceBig.div(weiParam.pow(token.decimal))

    var balanceEth = balanceToken.times(rateBig)
    return balanceEth.toString()
  }
}

export function shortEthBalance(tokens){
  var shortedTokens = []
  let removedEth = {...tokens}
  delete removedEth[constants.ETH.symbol]
  if(tokens){
    shortedTokens = Object.values(removedEth).sort((a, b) => {
      var balanceEthA = new BigNumber(caculateEthBalance(a)) 
      var balanceEthB = new BigNumber(caculateEthBalance(b)) 
      return balanceEthB.minus(balanceEthA)
    })
  } 
  if(tokens[constants.ETH.symbol]){
    shortedTokens.unshift(tokens[constants.ETH.symbol])
  }
  return shortedTokens
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
    return bigNumber.times(1000000000).toString()
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

export function convertSellRate(rate){
  var bigNumber = new BigNumber(rate.toString())
  var  result = bigNumber.div(Math.pow(10, 18));
  return result.toString()
}

export function convertBuyRate(rate){
  var bigNumber = new BigNumber(rate.toString())
  var  result = bigNumber.div(Math.pow(10, 18));
  var zero = new BigNumber(0)
  if (result.comparedTo(zero) !== 0){
    var oneNumber = new BigNumber(1)
    result = oneNumber.div(result)
    return result.toString()
  }else{
    return 0
  }
}

export function pairID(source, dest) {
  return source.address + "-" + dest.address
}

export function numberToHex(number) {
  return "0x" + (new BigNumber(number)).toString(16)
}

export function numberToHexAddress(number){
  var hex =  (new BigNumber(number)).toString(16)
  if(hex.length > 40){
    return  "0x" + Array(41).join("0")
  }else{
    return  "0x" + Array(40 - hex.length + 1).join("0") + hex.toLowerCase()
  }
}

export function biggestNumber() {
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
  var bigNumber = new BigNumber(number).times(param)
  return bigNumber
}
export function stringToBigNumber(number) {
  var bigNumber = new BigNumber(number)
  return bigNumber
}

export function stringToHex(number, decimal) {
  if (number === "" || isNaN(number)) return "0x0"
  var param = new BigNumber(10).pow(decimal ? decimal : 18)
  var bigNumber = new BigNumber(number).times(param)
  bigNumber = new BigNumber(bigNumber.toFixed(0))
  return "0x" + bigNumber.toString(16)
}

export function roundingNumber(number) {
  const MAX_DIGIS = 7, SIZE = 3;
  number = +number;
  let numberStr = number.toString();
  if (isNaN(number) || number <= 0) number = 0;
  if (number < 1e-7) number = 0;
  if (('' + Math.floor(number)).length >= MAX_DIGIS) {
    return Math.floor(number).toLocaleString();
  }

  let count_0 = 0
  for (let j of numberStr) {
    if(j == '.') continue
    if(j == 0) 
      count_0++ 
    else 
      break
  }

  let precision = number.toPrecision((number < 1 && number > 0) ? MAX_DIGIS - count_0 : MAX_DIGIS),
    arr = precision.split('.'),
    intPart = arr[0],
    i = intPart.length % SIZE || SIZE,
    result = intPart.substr(0, i);

  for (; i < intPart.length; i += SIZE) {
    result += ',' + intPart.substr(i, SIZE);
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
  var ts = new BigNumber(10).pow(decimal).times(constants.EPSILON)
  return ts.div(tokenRate)
}

export function getDifferentAmount(sourceAmount, prevAmount, sourceDecimal,
  minRate, sourceTokenSymbol) {
    if((sourceAmount === "") || isNaN(sourceAmount)) sourceAmount = 0
    if(sourceTokenSymbol === 'ETH'){
      return Math.abs(sourceAmount - prevAmount) 
    }else{
      var valueChange = Math.abs(sourceAmount - prevAmount) 
      var rate = new BigNumber(minRate)
      var rateWeight = new BigNumber(10).pow(18)
      rate = rate.div(rateWeight)

      var value = new BigNumber(valueChange + "")
      value = value.multipliedBy(rate)

      return value.toNumber()
    }
}

export function compareTwoNumber(num1, num2){
  var num1Big = new BigNumber(num1.toString())
  var num2Big = new BigNumber(num2.toString())
  return num1Big.comparedTo(num2Big)
}

export function compareRate(minRate, expectedRate){
  if((minRate === "") || isNaN(minRate)) return -1
  if((expectedRate === "") || isNaN(expectedRate)) return -1

  var minRateBig = new BigNumber(minRate)
  var rateWeight = new BigNumber(10).pow(18)
  minRateBig = minRateBig.times(rateWeight)

  var expectedRateBig = new BigNumber(expectedRate)
  return minRateBig.comparedTo(expectedRateBig)
}

export function calculatePercentRate(minRate, expectedRate){
  if((minRate === "") || isNaN(minRate)) return 0
  if((expectedRate === "") || isNaN(expectedRate)) return 0
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


export function calculateGasFee(gasPrice, gasUsed){
  var gasPrice = stringToBigNumber(gweiToEth(gasPrice))
  var totalGas = gasPrice.multipliedBy(gasUsed)
  return roundingNumber(totalGas.toString())
}

export function findNetworkName(networkId){
  switch(networkId){
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

export function sliceErrorMsg(err){
  if(err.length > 70){
    err = err.slice(0,70) + '...'
  }
  return err
}

