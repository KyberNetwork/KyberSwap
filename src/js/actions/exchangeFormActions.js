import store from '../store'


export function selectAccount(addr) {
  return {
    type: "ACCOUNT_SELECTED",
    payload: addr,
  }
}

export function selectSourceToken(addr) {
  return {
    type: "SOURCE_TOKEN_SELECTED",
    payload: addr,
  }
}

export function specifySourceAmount(amount) {
  return {
    type: "SOURCE_AMOUNT_SPECIFIED",
    payload: amount,
  }
}

export function selectDestToken(addr) {
  return {
    type: "DEST_TOKEN_SELECTED",
    payload: addr,
  }
}

export function specifyMinRate(rate) {
  return {
    type: "MIN_CONVERSION_RATE_SPECIFIED",
    payload: rate,
  }
}

export function specifyRecipient(addr) {
  return {
    type: "RECIPIENT_SPECIFIED",
    payload: addr,
  }
}

export function specifyGasLimit(gas) {
  return {
    type: "GAS_SPECIFIED",
    payload: gas,
  }
}

export function specifyGasPrice(price) {
  return {
    type: "GAS_PRICE_SPECIFIED",
    payload: price,
  }
}

export function throwError(error) {
  return {
    type: "ERROR_THREW",
    payload: error,
  }
}

export function emptyForm() {
  return {
    type: "EXCHANGE_FORM_EMPTIED"
  }
}

export function suggestRate(source, dest) {
  var rate = store.getState().global.rates[source + "-" + dest]
  return {
    type: "EXCHANGE_FORM_SUGGEST_RATE",
    payload: rate.rate.toString(10)
  }
}
