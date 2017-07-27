import store from '../store'


export function selectAccount(id, addr) {
  return {
    type: "ACCOUNT_SELECTED",
    payload: addr,
    meta: id,
  }
}

export function selectSourceToken(id, addr) {
  return {
    type: "SOURCE_TOKEN_SELECTED",
    payload: addr,
    meta: id,
  }
}

export function specifySourceAmount(id, amount) {
  return {
    type: "SOURCE_AMOUNT_SPECIFIED",
    payload: amount,
    meta: id,
  }
}

export function selectDestToken(id, addr) {
  return {
    type: "DEST_TOKEN_SELECTED",
    payload: addr,
    meta: id,
  }
}

export function specifyMinAmount(id, amount) {
  return {
    type: "MIN_AMOUNT_SPECIFIED",
    payload: amount,
    meta: id,
  }
}

export function specifyRecipient(id, addr) {
  return {
    type: "RECIPIENT_SPECIFIED",
    payload: addr,
    meta: id,
  }
}

export function specifyGasLimit(id, gas) {
  return {
    type: "GAS_SPECIFIED",
    payload: gas,
    meta: id,
  }
}

export function specifyGasPrice(id, price) {
  return {
    type: "GAS_PRICE_SPECIFIED",
    payload: price,
    meta: id,
  }
}

export function throwError(id, errors) {
  return {
    type: "ERROR_THREW",
    payload: errors,
    meta: id,
  }
}

export function emptyForm(id) {
  return {
    type: "EXCHANGE_FORM_EMPTIED",
    meta: id,
  }
}

export function resetStep(id) {
  return {
    type: "EXCHANGE_FORM_RESET_STEP",
    meta: id,
  }
}

export function nextStep(id) {
  return {
    type: "EXCHANGE_FORM_NEXT_STEP",
    meta: id,
  }
}

export function previousStep(id) {
  return {
    type: "EXCHANGE_FORM_PREVIOUS_STEP",
    meta: id,
  }
}

export function suggestRate(id, source, dest) {
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
      },
      meta: id,
    }
  } else {
    return {
      type: "EXCHANGE_FORM_SUGGEST_RATE",
      payload: {
        rate: 0,
        expirationBlock: 0,
        balance: 0,
        reserve: 0,
      },
      meta: id,
    }
  }
}

export function doApprovalTransaction(id, ethereum, tx, callback) {
  return {
    type: "EXCHANGE_FORM_APPROVAL_TX_BROADCAST",
    payload: new Promise((resolve, reject) => {
      ethereum.sendRawTransaction(tx, (hash) => {
        callback(hash)
        resolve(hash)
      })
    }),
    meta: id,
  }
}

export function doTransaction(id, ethereum, tx, callback) {
  return {
    type: "EXCHANGE_FORM_TX_BROADCAST",
    payload: new Promise((resolve, reject) => {
      ethereum.sendRawTransaction(tx, (hash) => {
        callback(hash, tx)
        resolve(hash)
      })
    }),
    meta: id,
  }
}
