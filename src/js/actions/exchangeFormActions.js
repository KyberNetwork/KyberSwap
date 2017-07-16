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

export function specifyMinAmount(amount) {
  return {
    type: "MIN_AMOUNT_SPECIFIED",
    payload: amount,
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

export function throwError(errors) {
  return {
    type: "ERROR_THREW",
    payload: errors,
  }
}

export function emptyForm() {
  return {
    type: "EXCHANGE_FORM_EMPTIED"
  }
}

export function nextStep() {
  return {
    type: "EXCHANGE_FORM_NEXT_STEP"
  }
}

export function previousStep() {
  return {
    type: "EXCHANGE_FORM_PREVIOUS_STEP"
  }
}

export function suggestRate(source, dest) {
  console.log(source + '-' + dest)
  var rate = store.getState().global.rates[source + "-" + dest]
  if (rate) {
    return {
      type: "EXCHANGE_FORM_SUGGEST_RATE",
      payload: {
        rate: rate.rate.toString(10),
        reserve: rate.reserve,
        expirationBlock: rate.expirationBlock,
        balance: rate.balance.toString(10),
      }
    }
  } else {
    return {
      type: "EXCHANGE_FORM_SUGGEST_RATE",
      payload: {
        rate: 0,
        expirationBlock: 0,
        balance: 0,
        reserve: 0,
      }
    }
  }
}
