


export function selectTokenAsync(symbol, address, type) {
  return {
    type: "LIMIT_ORDER.SELECT_TOKEN_ASYNC",
    payload: {symbol, address, type }
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

export function updateRate(ethereum, source, dest, sourceAmount, sourceTokenSymbol, isManual = false) {
  return {
    type: "LIMIT_ORDER.UPDATE_RATE_PENDING",
    payload: {ethereum, source, dest, sourceAmount, sourceTokenSymbol, isManual }
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


export function updateOrderPath(orderPath, currentPathIndex){
  return {
    type: "LIMIT_ORDER.UPDATE_ORDER_PATH",
    payload: { orderPath, currentPathIndex }
  }
}

export function resetOrderPath() {
  return {
    type: "LIMIT_ORDER.RESET_ORDER_PATH"
  }
}

export function  forwardOrderPath() {
  return {
    type: "LIMIT_ORDER.FORWARD_ORDER_PATH"
  }
}

export function addNewOrder(order) {
  return {
    type: "LIMIT_ORDER.ADD_NEW_ORDER",
    payload: {order}
  }
}

export function removeOrder(order) {
  return {
    type: "LIMIT_ORDER.REMOVE_ORDER",
    payload: { order }
  }
}

export function addListOrder(listOrder) {
  return {
    type: "LIMIT_ORDER.ADD_LIST_ORDER",
    payload: listOrder
  }
}

export function updateOrder(order) {
  return {
    type: "LIMIT_ORDER.UPDATE_ORDER",
    payload: { order }
  }
}

export function focusInput(focus) {
  return {
    type: "LIMIT_ORDER.FOCUS_INPUT",
    payload: focus
  }
}

export function setGasPriceLimitOrderComplete(safeLowGas, standardGas, fastGas, defaultGas, selectedGas) {
  return {
    type: "LIMIT_ORDER.SET_GAS_PRICE_LIMIT_ORDER_COMPLETE",
    payload: { safeLowGas, standardGas, defaultGas, fastGas, selectedGas }
  }
}