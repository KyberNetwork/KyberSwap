
export function addTx(tx) {
  return {
    type: "TX.TX_ADDED",
    payload: tx
  }
}

export function updateApproveTxsData(){
  return {
    type: "TX.UPDATE_APPROVE_TXS",
  }
}

export function updateTx(ethereum, tx, account, listToken) {
  return {
    type: "TX.UPDATE_TX_PENDING",
    payload: {ethereum, tx, account, listToken}
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