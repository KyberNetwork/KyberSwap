import IMPORT_KEY from "../constants/importKeyStoreActions"

const initState = {
  keystring: "",
  name: "",
  desc: "",
  address: "",
  error: "",
}


const importKeystore = (state=initState, action) => {
  switch (action.type) {
    case IMPORT_KEY.ACCOUNT_KEY_UPLOADED: {
      return {...state,
        keystring: action.payload.keystring,
        address: action.payload.address,
        error: "",
        }
    }
    case IMPORT_KEY.ACCOUNT_NAME_SPECIFIED: {
      return {...state, name: action.payload}
    }
    case IMPORT_KEY.ACCOUNT_DESC_SPECIFIED: {
      return {...state, desc: action.payload}
    }
    case IMPORT_KEY.ACCOUNT_ERROR_THREW: {
      return {...state, error: action.payload, keystring: ""}
    }
    case IMPORT_KEY.ACCOUNT_FORM_EMPTIED: {
      return {...initState}
    }
  }
  return state
}

export default importKeystore;
