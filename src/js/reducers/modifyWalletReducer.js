import MODIFY_WALLET from "../constants/modifyWalletActions"

const initState = {
  name: "",
  address:"",
  error:""
}


const modifyWallet = (state=initState, action) => {
  switch (action.type) {
  	case MODIFY_WALLET.MODIFY_WALLET:{
  		return {...state, address:action.payload.address ,name: action.payload.name}	
  	}
    case MODIFY_WALLET.MODIFY_WALLET_NAME_SPECIFIED: {
      return {...state, name: action.payload}
    }
    case MODIFY_WALLET.MODIFY_WALLET_ERROR_THREW: {
      return {...state, error: action.payload, name: ""}
    }
    case MODIFY_WALLET.MODIFY_WALLET_FORM_EMPTIED: {
      return {...initState}
    }
  }
  return state
}

export default modifyWallet;
