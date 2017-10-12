import CREATE_ACC_ACTION from "../constants/createKeyStoreActions"

const initState = {
  keystring: "",
  name: "",
  desc: "",
  address: "",
  error: "",
}


const createKeyStore = (state=initState, action) => {
  switch (action.type) {
    case CREATE_ACC_ACTION.CREATE_ACCOUNT_NAME_SPECIFIED: {
      return {...state, name: action.payload}
    }
    case CREATE_ACC_ACTION.CREATE_ACCOUNT_DESC_SPECIFIED: {
      return {...state, desc: action.payload}
    }
    case CREATE_ACC_ACTION.CREATE_ACCOUNT_ERROR_THREW: {
      return {...state, error: action.payload, keystring: ""}
    }
    case CREATE_ACC_ACTION.CREATE_ACCOUNT_FORM_EMPTIED: {
      return {...initState}
    }
  }
  return state
}

export default createKeyStore;
