import { joinedKyberWallet } from "./accountActions"
import { addWallet } from "./walletActions"
import store from "../store"

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
      tx.sync(ethereum, (tx) => {
        if (tx.address && tx.address != "") {
          store.dispatch(joinedKyberWallet(tx.from, tx.address))
          store.dispatch(addWallet(tx.address, tx.from, "default name", "default desc"))
        }
        resolve(tx)
      })
    })
  }
}
