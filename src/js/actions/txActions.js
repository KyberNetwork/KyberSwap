
export function addTx(tx) {
  return {
    type: "TX.TX_ADDED",
    payload: tx
  }
}

export function updateTx(ethereum, tx, tokens, account) {
  return {
    type: "TX.UPDATE_TX_PENDING",
    payload: {ethereum, tx, tokens, account}
  }
}

export function updateTxComplete(tx) {
  return {
    type: "TX.UPDATE_TX_FULFILLED",
    payload: tx
  }
}

export function clearTxs(){
  return {
    type: 'TX.CLEAR',
  }
}