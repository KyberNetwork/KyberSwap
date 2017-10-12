import PAYMENT from "../constants/joinPaymentFormActions"

export function doTransaction(ethereum, tx, callback) {
  return {
    type: PAYMENT.JOIN_PAYMENT_FORM_TX_BROADCAST_PENDING,
    payload: {ethereum, tx, callback}
  }
}

export function doTransactionComplete(hash) {
  return {
    type: PAYMENT.JOIN_PAYMENT_FORM_TX_BROADCAST_FULFILLED,
    payload: hash
  }
}

export function doTransactionFail(hash) {
  return {
    type: PAYMENT.JOIN_PAYMENT_FORM_TX_BROADCAST_REJECTED,
    payload: hash
  }
}

export function selectAccount(addr) {
  return {
    type: PAYMENT.JOIN_PAYMENT_ACCOUNT_SELECTED,
    payload: addr,
  }
}

export function specifyName(name) {
  return {
    type: PAYMENT.JOIN_PAYMENT_NAME_SPECIFIED,
    payload: name,
  }
}

export function specifyGasLimit(gas) {
  return {
    type: PAYMENT.JOIN_PAYMENT_GAS_SPECIFIED,
    payload: gas,
  }
}

export function specifyGasPrice(price) {
  return {
    type: PAYMENT.JOIN_PAYMENT_GAS_PRICE_SPECIFIED,
    payload: price,
  }
}

export function throwError(error) {
  return {
    type: PAYMENT.JOIN_PAYMENT_ERROR_THREW,
    payload: error,
  }
}

export function emptyForm() {
  return {
    type: PAYMENT.JOIN_PAYMENT_EMPTIED
  }
}
