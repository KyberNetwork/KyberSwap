import TX from "../constants/txActions"

export function addTx(tx) {
  return {
    type: TX.TX_ADDED,
    payload: tx
  }
}

export function updateTx(ethereum, tx) {
  return {
    type: TX.UPDATE_TX_PENDING,
    payload: {ethereum, tx}
  }
}

export function updateTxComplete(tx) {
  return {
    type: TX.UPDATE_TX_FULFILLED,
    payload: tx
  }
}