// in this package, all number are in 18 decimals precision

import BigNumber from 'bignumber.js'

import supported_tokens from "../services/supported_tokens"
import constants from "../services/constants"


export function calculateRate(source, dest) {
  var bigSource = new BigNumber(source)
  var bigDest = new BigNumber(dest)
  if (bigSource == 'NaN' || bigSource == 'Infinity' ||
    bigDest == 'NaN' || bigDest == 'Infinity') {
    return "0"
  }
  var rate = bigDest.times(1000000000000000000).div(bigSource)
  return rate
}

export function calculateDest(source, rate) {
  var bigSource = new BigNumber(source)
  var bigRate = new BigNumber(rate)
  if (bigSource == 'NaN' || bigSource == 'Infinity' ||
    bigRate == 'NaN' || bigRate == 'Infinity') {
    return "0"
  }
  var dest = bigSource.times(bigRate).div(1000000000000000000)
  return dest
}

export function toTWei(number) {
  var bigNumber = new BigNumber(number)
  if (bigNumber == 'NaN' || bigNumber == 'Infinity') {
    return "0"
  } else {
    return bigNumber.times(1000000000000000000).toString(10)
  }
}

export function toT(number) {
  var bigNumber = new BigNumber(number)
  if (bigNumber == 'NaN' || bigNumber == 'Infinity') {
    return "0"
  } else {
    return bigNumber.div(1000000000000000000).toString(10)
  }
}

export function getToken(address) {
  console.log(address);
  console.log(supported_tokens);
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
        return {...tok}
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
    return bigNumber.dividedBy(1000000000000000000).toString(10)
  }
}