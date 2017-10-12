//import { joinedKyberWallet } from "./accountActions"
//import { addWallet } from "./walletActions"
//import store from "../store"
import TX from "../constants/txActions"

export function addTx(tx) {
  return {
    type: TX.TX_ADDED,
    payload: tx
  }
}

// export function updateTx(ethereum, tx) {
//   return {
//     type: "UPDATE_TX",
//     payload: new Promise((resolve, error) => {
//       tx.sync(ethereum, (tx) => {
//         if (tx.address && tx.address != "") {
//           store.dispatch(joinedKyberWallet(tx.from, tx.address))
//           store.dispatch(addWallet(tx.address, tx.from, tx.data, "default desc"))
//         }
//         resolve(tx)
//       })
//     })
//   }
// }


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