import MODIFY_WALLET from "../constants/modifyWalletActions"

export function specifyName(name) {
  return {
    type: MODIFY_WALLET.MODIFY_WALLET_NAME_SPECIFIED,
    payload: name
  }
}
export function addNameModifyWallet(address, name) {
  return {
    type: MODIFY_WALLET.MODIFY_WALLET,
    payload: {address: address, name:name}
  }
}

export function throwError(message) {
  return {
    type: MODIFY_WALLET.MODIFY_WALLET_ERROR_THREW,
    payload: message
  }
}

export function emptyForm() {
  return {
    type: MODIFY_WALLET.MODIFY_WALLET_FORM_EMPTIED
  }
}
