import MODIFY_ACCOUNT from "../constants/modifyAccountActions"

export function specifyName(name) {
  return {
    type: MODIFY_ACCOUNT.MODIFY_ACCOUNT_NAME_SPECIFIED,
    payload: name
  }
}
export function addNameModifyAccount(address, name) {
  return {
    type: MODIFY_ACCOUNT.MODIFY_ACCOUNT,
    payload: {address: address, name:name}
  }
}

export function throwError(message) {
  return {
    type: MODIFY_ACCOUNT.MODIFY_ACCOUNT_ERROR_THREW,
    payload: message
  }
}

export function emptyForm() {
  return {
    type: MODIFY_ACCOUNT.MODIFY_ACCOUNT_FORM_EMPTIED
  }
}
