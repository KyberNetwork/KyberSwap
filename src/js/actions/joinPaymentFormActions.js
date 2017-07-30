export function doTransaction(ethereum, tx, callback) {
  return {
    type: "JOIN_PAYMENT_FORM_TX_BROADCAST",
    payload: new Promise((resolve, reject) => {
      ethereum.sendRawTransaction(tx, (hash) => {
        callback(hash)
        resolve(hash)
      })
    })
  }
}

export function selectAccount(addr) {
  return {
    type: "JOIN_PAYMENT_ACCOUNT_SELECTED",
    payload: addr,
  }
}

export function specifyName(name) {
  return {
    type: "JOIN_PAYMENT_NAME_SPECIFIED",
    payload: name,
  }
}

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
