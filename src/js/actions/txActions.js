export function addTx(tx) {
  return {
    type: "TX_ADDED",
    payload: tx
  }
}

export function updateTx(ethereum, tx) {
  return {
    type: "UPDATE_TX",
    payload: new Promise((resolve, error) => {
      tx.sync(ethereum, resolve)
    })
  }
}
