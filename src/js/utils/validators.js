import BigNumber from 'bignumber.js';
import * as ethUtil from 'ethereumjs-util';
import TOKENS from "../services/supported_tokens";
import constants from "../services/constants";

export function verifyAccount(addr) {
  if (ethUtil.isValidAddress(addr)) {
    return addr
  } else {
    throw new Error("Invalid address")
  }
}

export function verifyToken(addr) {
  if (!ethUtil.isValidAddress(addr)) {
    console.log("invalid addr: " + addr)
    throw new Error("Invalid token address")
  } else {
    for (var i = 0; i < TOKENS.length; i++) {
      console.log("supported " + TOKENS[i].address + " - sending: " + addr)
      if (TOKENS[i].address == addr) {
        return addr
      }
    }
    if (addr != constants.ETHER_ADDRESS) {
      console.log("supported: " + constants.ETHER_ADDRESS)
      console.log("  sending: " + addr)
      throw new Error("Unsupported token")
    } else {
      return addr
    }
  }
}

export function verifyAmount(amount, max) {
  var result = new BigNumber(amount)
  if (result == 'NaN' || result == 'Infinity') {
    throw new Error("Invalid number")
  }
  if (max != undefined) {
    var maxBig = new BigNumber(max)
    if (maxBig == 'NaN' || maxBig == 'Infinity') {
      throw new Error("Invalid upper bound for amount")
    }
    if (result.cmp(maxBig) > 0) {
      throw new Error("Amount is too high")
    }
    if (result.cmp(constants.EPSILON) < 0) {
      throw new Error("Amount is too low")
    }
  }
  return "0x" + result.toString(16)
}

export function verifyNumber(amount) {
  var result = new BigNumber(amount)
  if (result == 'NaN' || result == 'Infinity') {
    throw new Error("Invalid number")
  }
  if (result.cmp(0) < 0) {
    throw new Error("Number is negative")
  }
  return "0x" + result.toString(16)
}

export function verifyNonce(nonce, future) {
  return (new BigNumber(nonce).plus(future || 0)).toNumber()
}
