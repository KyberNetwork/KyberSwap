import store from '../store'
import PAYMENT from "../constants/paymentFormActions"

export function selectWallet(addr) {
  return {
    type: PAYMENT.PAYMENT_FORM_WALLET_SELECTED,
    payload: addr,
  }
}

export function selectSourceToken(addr) {
  return {
    type: PAYMENT.PAYMENT_FORM_SOURCE_TOKEN_SELECTED,
    payload: addr,
  }
}

export function specifySourceAmount(amount) {
  return {
    type: PAYMENT.PAYMENT_FORM_SOURCE_AMOUNT_SPECIFIED,
    payload: amount,
  }
}

export function selectDestToken(addr) {
  return {
    type: PAYMENT.PAYMENT_FORM_DEST_TOKEN_SELECTED,
    payload: addr,
  }
}

export function specifyMinRate(rate) {
  return {
    type: PAYMENT.PAYMENT_FORM_MIN_CONVERSION_RATE_SPECIFIED,
    payload: rate,
  }
}

export function specifyRecipient(addr) {
  return {
    type: PAYMENT.PAYMENT_FORM_RECIPIENT_SPECIFIED,
    payload: addr,
  }
}

export function specifyGasLimit(gas) {
  return {
    type: PAYMENT.PAYMENT_FORM_GAS_SPECIFIED,
    payload: gas,
  }
}

export function specifyGasPrice(price) {
  return {
    type: PAYMENT.PAYMENT_FORM_GAS_PRICE_SPECIFIED,
    payload: price,
  }
}

export function throwError(error) {
  return {
    type: PAYMENT.PAYMENT_FORM_ERROR_THREW,
    payload: error,
  }
}

export function emptyForm() {
  return {
    type: PAYMENT.PAYMENT_FORM_EMPTIED
  }
}

export function specifyOnlyApproveToken(onlyApprove) {
  return {
    type: PAYMENT.PAYMENT_FORM_ONLY_APPROVE_TOKEN_SPECIFIED,
    payload: onlyApprove
  }
}

export function suggestRate(source, dest) {
  var rate = store.getState().global.rates[source + "-" + dest]
  if (rate == undefined) {
    return {
      type: PAYMENT.PAYMENT_FORM_SUGGEST_RATE,
      payload: 0
    }
  } else {
    var suggestedRate = rate.rate.times(0.994).round().toString(10)
    return {
      type: PAYMENT.PAYMENT_FORM_SUGGEST_RATE,
      payload: suggestedRate
    }
  }
}
