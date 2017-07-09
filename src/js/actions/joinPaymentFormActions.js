export function specifyGasLimit(gas) {
  return {
    type: "JOIN_PAYMENT_GAS_SPECIFIED",
    payload: gas,
  }
}

export function specifyGasPrice(price) {
  return {
    type: "JOIN_PAYMENT_GAS_PRICE_SPECIFIED",
    payload: price,
  }
}

export function throwError(error) {
  return {
    type: "JOIN_PAYMENT_ERROR_THREW",
    payload: error,
  }
}

export function emptyForm() {
  return {
    type: "JOIN_PAYMENT_EMPTIED"
  }
}
