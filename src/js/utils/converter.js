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
  var bigSource = new BigNumber(source)
  var bigRate = new BigNumber(rate)
  if (bigSource == 'NaN' || bigSource == 'Infinity' || acceptableTyping(source) ||
    bigRate == 'NaN' || bigRate == 'Infinity' || acceptableTyping(rate)) {
    return "0"
  }
  var dest = bigSource.times(bigRate).div(1000000000000000000)
  return dest
}

export function caculateSourceAmount(destAmount, offeredRate, precision){
  if(!destAmount || !offeredRate || acceptableTyping(destAmount) || acceptableTyping(offeredRate)){
    return "0"
  }
  var bigDest = new BigNumber(destAmount)
  var bigOfferedRate = new BigNumber(offeredRate)
  
  bigOfferedRate = bigOfferedRate.div(1000000000000000000)
  var result = bigDest.div(bigOfferedRate)
  if(precision){
    return result.toFixed(precision)
  } else {
    return result.toString()
  }
}

export function caculateDestAmount(sourceAmount, offeredRate, precision){
  if(!sourceAmount || !offeredRate || acceptableTyping(sourceAmount) || acceptableTyping(offeredRate)){
    return "0"
  }
  var bigSource = new BigNumber(sourceAmount)
  var bigOfferedRate = new BigNumber(offeredRate)
  
  bigOfferedRate = bigOfferedRate.div(1000000000000000000)
  var result = bigSource.times(bigOfferedRate)
  if(precision){
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

function acceptableTyping(number) {
  // ends with a dot
  if (number.length > 0 && number[number.length - 1] == ".") {
    return true
  }

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

export function toTWei(number) {
  var bigNumber = new BigNumber(number)
  if (bigNumber == 'NaN' || bigNumber == 'Infinity') {
    return number
  } else if (acceptableTyping(number)) {
    return number
  } else {
    return bigNumber.times(1000000000000000000).toString()
  }
}

export function gweiToWei(number) {
  var bigNumber = new BigNumber(number)
  if (bigNumber == 'NaN' || bigNumber == 'Infinity') {
    return number
  } else if (acceptableTyping(number)) {
    return number
  } else {
    return bigNumber.times(1000000000).toString()
  }
}

export function gweiToEth(number) {
  if( number === "" || isNaN(number)){
    return "0"
  }
  var bigNumber = new BigNumber(number)
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
  var bigNumber = new BigNumber(number)
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
  if(round){
    return result.round(round).toString()
  }else{
    return result.toString()
  }
}

export function pairID(source, dest) {
  return source.address + "-" + dest.address
}

export function numberToHex(number) {
  return "0x" + (new BigNumber(number)).toString(16)
}

export function biggestNumber() {
  var initNumber = new BigNumber(2)
  return "0x" + (initNumber.pow(255).toString(16))
  //return "0x" + (new BigNumber(Math.pow(2,256)-1)).toString(16)
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
  var param = new BigNumber(10).pow(decimal ? decimal : 18)
  var bigNumber = new BigNumber(number).times(param)
  return "0x" + bigNumber.toString(16)
}

export function roundingNumber(number) {
  const MAX_DIGIS = 7;
  number = +number;
  if (isNaN(number) || number <= 0) return 0;

  let numberStr = number.toString();
  if (Number.isInteger(number)) {
    return number;
  }
  if(number < 1e-7){
    return 0;
  }
  let result = number.toPrecision(number < 1 ? MAX_DIGIS - 1 : MAX_DIGIS);
  return +result;
}

export function toPrimitiveNumber(x) {
  var bigNum = new BigNumber(x)
  return bigNum.toString(10)
};

export function caculateTokenEpsilon(rate, decimal, symbol){
  var tokenRate = rate
  if (symbol === "ETH"){
    tokenRate = new BigNumber(10).pow(18)
  }
  var ts = new BigNumber(10).pow(decimal).times(constants.EPSILON)
  return ts.div(tokenRate)
}