


export function selectTokenAsync(symbol, address, type) {
  return {
    type: "LIMIT_ORDER.SELECT_TOKEN_ASYNC",
    payload: { symbol, address, type }
  }
}


export function selectToken(symbol, address, type) {
  return {
    type: "LIMIT_ORDER.SELECT_TOKEN",
    payload: { symbol, address, type }
  }
}

export function inputChange(focus, value) {
  return {
    type: "LIMIT_ORDER.INPUT_CHANGE",
    payload: { focus, value }
  }
}

export function updateRate(source, dest, sourceAmount, sourceTokenSymbol, isManual = false) {
  return {
    type: "LIMIT_ORDER.UPDATE_RATE_PENDING",
    payload: { source, dest, sourceAmount, sourceTokenSymbol, isManual }
  }
}

export function updateRateComplete(rateInit, expectedPrice, slippagePrice, blockNo, isManual, isSuccess) {
  return {
    type: "LIMIT_ORDER.UPDATE_RATE",
    payload: { rateInit, expectedPrice, slippagePrice, blockNo, isManual, isSuccess }
  }

}

export function setIsSelectTokenBalance(value) {
  return {
    type: "LIMIT_ORDER.SET_IS_SELECT_TOKEN_BALANCE",
    payload: value
  }
}

export function fetchFee(userAddr, source, dest) {
  return {
    type: "LIMIT_ORDER.FETCH_FEE",
    payload: { userAddr, source, dest }
  }
}

export function fetchFeeComplete(fee, err) {
  return {
    type: "LIMIT_ORDER.FETCH_FEE_COMPLETE",
    payload: { fee, err }
  }
}


export function throwError(key, msg){
  return {
    type: "LIMIT_ORDER.THROW_ERROR",
    payload: { key, msg }
  }
}

