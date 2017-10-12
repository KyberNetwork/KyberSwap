import MODIFY_ACCOUNT from "../constants/modifyAccountActions"

const initState = {
  name: "",
  address:"",
  error:""
}


const modifyAccount = (state=initState, action) => {
  switch (action.type) {
  	case MODIFY_ACCOUNT.MODIFY_ACCOUNT:{
  		return {...state, address:action.payload.address ,name: action.payload.name}	
  	}
    case MODIFY_ACCOUNT.MODIFY_ACCOUNT_NAME_SPECIFIED: {
      return {...state, name: action.payload}
    }
    case MODIFY_ACCOUNT.MODIFY_ACCOUNT_ERROR_THREW: {
      return {...state, error: action.payload, name: ""}
    }
    case MODIFY_ACCOUNT.MODIFY_ACCOUNT_FORM_EMPTIED: {
      return {...initState}
    }
  }
  return state
}

export default modifyAccount;
