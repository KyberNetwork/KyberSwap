import IMPORT_KEY from "../constants/importKeyStoreActions"

export function specifyName(name) {
  return {
    type: IMPORT_KEY.ACCOUNT_NAME_SPECIFIED,
    payload: name
  }
}

export function specifyDesc(desc) {
  return {
    type: IMPORT_KEY.ACCOUNT_DESC_SPECIFIED,
    payload: desc
  }
}

export function uploadKey(address, keystring) {
  return {
    type: IMPORT_KEY.ACCOUNT_KEY_UPLOADED,
    payload: { address, keystring },
  }
}

export function throwError(message) {
  return {
    type: IMPORT_KEY.ACCOUNT_ERROR_THREW,
    payload: message
  }
}

export function emptyForm() {
  return {
    type: IMPORT_KEY.ACCOUNT_FORM_EMPTIED
  }
}
