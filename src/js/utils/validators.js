import BigNumber from 'bignumber.js'
import * as ethUtil from 'ethereumjs-util'
import TOKENS from "../services/supported_tokens"
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
    console.log(e)
    return "Malformed JSON keystore file"
  }
  return null
}

export function verifyToken(addr) {
  if (!ethUtil.isValidAddress(addr)) {
    return "invalid"
  } else {
    for (var i = 0; i < TOKENS.length; i++) {
      if (TOKENS[i].address == addr) {
        return null
      }
    }
    if (addr != constants.ETHER_ADDRESS) {
      return "unsupported"
    } else {
      return null
    }
  }
}

export function verifyAmount(amount, max) {
  var result = new BigNumber(amount)
  if (result == 'NaN' || result == 'Infinity') {
    return "not a number"
  }
  if (max != undefined) {
    var maxBig = new BigNumber(max)
    if (maxBig == 'NaN' || maxBig == 'Infinity') {
      throw new Error("Invalid upper bound for amount")
    }
    if (result.cmp(maxBig) > 0) {
      return "too high"
    }
    if (result.cmp(constants.EPSILON) < 0) {
      return "too low"
    }
  }
  return null
  // return "0x" + result.toString(16)
}

export function verifyNumber(amount) {
  var result = new BigNumber(amount)
  if (result == 'NaN' || result == 'Infinity') {
    return "invalid number"
  }
  if (result.cmp(0) < 0) {
    return "nagative"
  }
  return null
  // return "0x" + result.toString(16)
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
  if (passphrase !== repassphrase){
    return "Passphrase confirmation is not match"
  }else{
    return null
  }
}
