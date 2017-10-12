import WALLET_ACTION from "../constants/walletActions"

export function addWallet(address, ownerAddress, name, desc) {
  return {
    type: WALLET_ACTION.NEW_WALLET_ADDED_PENDING,
    payload: {address, ownerAddress, name, desc}
  }
}

export function addWalletComplete(wallet) {
  return {
    type: WALLET_ACTION.NEW_WALLET_ADDED_FULFILLED,
    payload: wallet
  }
}

export function addDeleteWallet(address) {
    return {
        type: WALLET_ACTION.ADD_DELETE_WALLET,
        payload: address
    }
}

export function deleteWallet(address) {
  return {
    type: WALLET_ACTION.DELETE_WALLET,
    payload: address
  }
}

export function updateWallet(ethereum, wallet) {
  return {
    type: WALLET_ACTION.UPDATE_WALLET_PENDING,
    payload: {ethereum, wallet}
  }
}

export function updateWalletComplete(wallet) {
  return {
    type: WALLET_ACTION.UPDATE_WALLET_FULFILLED,
    payload: wallet
  }
}

export function modifyWallet(address, name){
    return {
        type: WALLET_ACTION.MODIFY_WALLET,
        payload: {address:address, name:name}
    }
}

export function sortWallet(order, field) {
    return {
        type: WALLET_ACTION.SORT_WALLET_BY_FIELD,
        payload: { order, field }
    }   
}
