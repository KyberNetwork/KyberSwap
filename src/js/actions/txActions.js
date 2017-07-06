export function addTx(tx) {
  return {
    type: "TX_ADDED",
    payload: tx
  }
}

export function updateTxs(newTxs) {
  return {
    type: "UPDATE_TXS",
    payload: newTxs
  }
}
