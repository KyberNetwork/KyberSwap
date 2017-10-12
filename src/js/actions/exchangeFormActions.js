import store from '../store'
import EXCHANGE from "../constants/exchangeFormActions"

export function selectAccount(id, addr) {
  return {
    type: EXCHANGE.ACCOUNT_SELECTED,
    payload: addr,
    meta: id,
  }
}

export function selectSourceToken(id, addr) {
  return {
    type: EXCHANGE.SOURCE_TOKEN_SELECTED,
    payload: addr,
    meta: id,
  }
}

export function specifySourceAmount(id, amount) {
  return {
    type: EXCHANGE.SOURCE_AMOUNT_SPECIFIED,
    payload: amount,
    meta: id,
  }
}

export function selectDestToken(id, addr) {
  return {
    type: EXCHANGE.DEST_TOKEN_SELECTED,
    payload: addr,
    meta: id,
  }
}

export function specifyMinRate(id, rate) {
  return {
    type: EXCHANGE.MIN_CONVERSION_RATE_SPECIFIED,
    payload: rate,
    meta: id,
  }
}

export function specifyMinAmount(id, amount) {
  return {
    type: EXCHANGE.MIN_AMOUNT_SPECIFIED,
    payload: amount,
    meta: id,
  }
}

export function specifyRecipient(id, addr) {
  return {
    type: EXCHANGE.RECIPIENT_SPECIFIED,
    payload: addr,
    meta: id,
  }
}

export function specifyGasLimit(id, gas) {
  return {
    type: EXCHANGE.GAS_SPECIFIED,
    payload: gas,
    meta: id,
  }
}

export function specifyGasPrice(id, price) {
  return {
    type: EXCHANGE.GAS_PRICE_SPECIFIED,
    payload: price,
    meta: id,
  }
}

export function throwError(id, errors) {
  return {
    type: EXCHANGE.ERROR_THREW,
    payload: errors,
    meta: id,
  }
}

export function emptyForm(id) {
  return {
    type: EXCHANGE.EXCHANGE_FORM_EMPTIED,
    meta: id,
  }
}

export function resetStep(id) {
  return {
    type: EXCHANGE.EXCHANGE_FORM_RESET_STEP,
    meta: id,
  }
}

export function nextStep(id) {
  return {
    type: EXCHANGE.EXCHANGE_FORM_NEXT_STEP,
    meta: id,
  }
}

export function specifyStep(id, step) {
  return {
    type: EXCHANGE.EXCHANGE_FORM_STEP_SPECIFIED,
    payload: step,
    meta: id,
  }
}

export function previousStep(id) {
  return {
    type: EXCHANGE.EXCHANGE_FORM_PREVIOUS_STEP,
    meta: id,
  }
}

export function suggestRate(id, epsilon) {
  var exchange = store.getState().exchangeForm[id]
  var source = exchange.sourceToken
  var dest = exchange.destToken
  var rate = store.getState().global.rates[source + "-" + dest]
  if (rate) {
    var bigRate = rate.rate
    if (epsilon) {
      bigRate = bigRate.times(1-epsilon)
    }
    return {
      type: EXCHANGE.EXCHANGE_FORM_SUGGEST_RATE,
      payload: {
        rate: bigRate.toString(10),
        reserve: rate.reserve,
        expirationBlock: rate.expirationBlock,
        balance: rate.balance.toString(10),
      },
      meta: id,
    }
  } else {
    return {
      type: EXCHANGE.EXCHANGE_FORM_SUGGEST_RATE,
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
    type: EXCHANGE.EXCHANGE_FORM_APPROVAL_TX_BROADCAST_PENDING,
    payload: {ethereum, tx, callback},
    meta: id,
  }
}

export function doApprovalTransactionComplete(txHash, id) {
  return {
    type: EXCHANGE.EXCHANGE_FORM_APPROVAL_TX_BROADCAST_FULFILLED,
    payload: txHash,
    meta: id,
  }
}

export function doApprovalTransactionFail(error, id) {
  return {
    type: EXCHANGE.EXCHANGE_FORM_APPROVAL_TX_BROADCAST_REJECTED,
    payload: error,
    meta: id,
  }
}

export function selectCrossSend(id) {
  return {
    type: EXCHANGE.CROSS_SEND_SELECTED,
    meta: id,
  }
}

export function deselectCrossSend(id) {
  return {
    type: EXCHANGE.CROSS_SEND_DESELECTED,
    meta: id,
  }
}

export function selectAdvance(id) {
  return {
    type: EXCHANGE.ADVANCE_SELECTED,
    meta: id,
  }
}

export function deselectAdvance(id) {
  return {
    type: EXCHANGE.ADVANCE_DESELECTED,
    meta: id,
  }
}

export function doTransaction(id, ethereum, tx, callback) {
  return {
    type: EXCHANGE.EXCHANGE_FORM_TX_BROADCAST_PENDING,
    payload: {ethereum, tx, callback},
    meta: id,
  }
}

export function doTransactionComplete(txHash, id) {
  return {
    type: EXCHANGE.EXCHANGE_FORM_TX_BROADCAST_FULFILLED,
    payload: txHash,
    meta: id,
  }
}

export function doTransactionFail(error, id) {
  return {
    type: EXCHANGE.EXCHANGE_FORM_TX_BROADCAST_REJECTED,
    payload: error,
    meta: id,
  }
}
