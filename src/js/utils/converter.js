// in this package, all number are in 18 decimals precision

import BigNumber from 'bignumber.js'

import supported_tokens from "../services/supported_tokens"
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

export function toT(number, precision) {
  var bigNumber = new BigNumber(number)
  var result
  if (bigNumber == 'NaN' || bigNumber == 'Infinity') {
    return number
  } else if (acceptableTyping(number)) {
    return number
  } else {
    result = bigNumber.div(1000000000000000000)
  }
  if (precision) {
    return result.toFixed(precision)
  } else {
    return result.toString()
  }
}

export function getToken(address) {
  if (address == constants.ETHER_ADDRESS) {
    return {
      name: "Ether",
      icon: "https://www.ethereum.org/images/logos/ETHEREUM-ICON_Black_small.png",
      symbol: "ETH",
      address: constants.ETHER_ADDRESS,
    }
  } else {
    for (var i = 0; i < supported_tokens.length; i++) {
      var tok = supported_tokens[i]
      if (tok.address == address) {
        return { ...tok }
      }
    }
    throw new Error("Unsupported token")
  }
}

export function pairID(source, dest) {
  return source.address + "-" + dest.address
}

export function numberToHex(number) {
  return "0x" + (new BigNumber(number)).toString(16)
}

export function hexToNumber(hex) {
  return new BigNumber(hex).toNumber()
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
