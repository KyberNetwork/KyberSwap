import GLOBAL from "../constants/globalActions"

export function updateBlock(ethereum, block) {
  return {
    type: GLOBAL.NEW_BLOCK_INCLUDED_PENDING,
    payload: ethereum
  }
}
export function updateBlockComplete(block) {
  return {
    type: GLOBAL.NEW_BLOCK_INCLUDED_FULFILLED,
    payload: block
  }
}

export function updateBlockFailed(error) {
  return {
    type: GLOBAL.GET_NEW_BLOCK_FAILED,
    payload: error
  }
}

export function updateRate(ethereum, source, dest, reserve, ownerAddr) {
  return {
    type: GLOBAL.RATE_UPDATED_PENDING,
    payload: {ethereum, source, dest, reserve, ownerAddr}
  }
}

export function updateRateComplete(rate) {
  return {
    type: GLOBAL.RATE_UPDATED_FULFILLED,
    payload: rate
  }
}

export function updateBalance(address) {
  return {
    type: GLOBAL.TOKEN_UPDATE_BALANCE_PENDING,
    payload: address
  }
}

export function updateBalanceComplete(balance) {
  return {
    type: GLOBAL.TOKEN_UPDATE_BALANCE_FULFILLED,
    payload: balance
  }
}

export function acceptTermOfService() {
  return {
    type: GLOBAL.TERM_OF_SERVICE_ACCEPTED
  }
}
