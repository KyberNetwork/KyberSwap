export function specifyName(name) {
  return {
    type: "ACCOUNT_NAME_SPECIFIED",
    payload: name
  }
}

export function specifyDesc(desc) {
  return {
    type: "ACCOUNT_DESC_SPECIFIED",
    payload: desc
  }
}

export function uploadKey(address, keystring) {
  return {
    type: "ACCOUNT_KEY_UPLOADED",
    payload: { address, keystring },
  }
}

export function throwError(message) {
  return {
    type: "ACCOUNT_ERROR_THREW",
    payload: message
  }
}

export function emptyForm() {
  return {
    type: "ACCOUNT_FORM_EMPTIED"
  }
}
