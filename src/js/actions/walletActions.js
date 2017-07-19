import * as service from "../services/accounts"

export function addWallet(address, ownerAddress, name, desc) {
  return {
    type: "NEW_WALLET_ADDED",
    payload: new Promise((resolve, reject) => {
      service.newWalletInstance(
        address, ownerAddress, name, desc, resolve)
    })
  }
}
export function deleteWallet(address) {
  return {
    type: "DELETE_WALLET",
    payload: address
  }
}

export function updateWallet(ethereum, wallet) {
  return {
    type: "UPDATE_WALLET",
    payload: new Promise((resolve, reject) => {
      wallet.sync(ethereum, resolve)
    })
  }
}
