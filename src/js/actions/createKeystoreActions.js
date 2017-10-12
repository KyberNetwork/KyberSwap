
import CREATE_ACC_ACTION from "../constants/createKeyStoreActions"

export function specifyName(name) {
  return {
    type: CREATE_ACC_ACTION.CREATE_ACCOUNT_NAME_SPECIFIED,
    payload: name
  }
}

export function specifyDesc(desc) {
  return {
    type: CREATE_ACC_ACTION.CREATE_ACCOUNT_DESC_SPECIFIED,
    payload: desc
  }
}

export function throwError(message) {
  return {
    type: CREATE_ACC_ACTION.CREATE_ACCOUNT_ERROR_THREW,
    payload: message
  }
}

export function emptyForm() {
  return {
    type: CREATE_ACC_ACTION.CREATE_ACCOUNT_FORM_EMPTIED
  }
}
