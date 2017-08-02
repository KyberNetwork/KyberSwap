const initState = {
  keystring: "",
  name: "",
  desc: "",
  address: "",
  error: "",
}


const createKeyStore = (state=initState, action) => {
  switch (action.type) {    
    case "ACCOUNT_NAME_SPECIFIED": {
      return {...state, name: action.payload}
    }
    case "ACCOUNT_DESC_SPECIFIED": {
      return {...state, desc: action.payload}
    }
    case "ACCOUNT_ERROR_THREW": {
      return {...state, error: action.payload, keystring: ""}
    }
    case "ACCOUNT_FORM_EMPTIED": {
      return {...initState}
    }
  }
  return state
}

export default createKeyStore;
