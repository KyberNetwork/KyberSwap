import PAYMENT from "../constants/joinPaymentFormActions"

const initState = {
  selectedAccount: "",
  gas: 2000000,
  gasPrice: 20000000000,
  name: "",
  bcError: "",
  errors: {
    selectedAccountError: "",
    passwordError: "",
  },
}

const joinPaymentForm = (state=initState, action) => {
  switch (action.type) {
    case PAYMENT.JOIN_PAYMENT_ACCOUNT_SELECTED: {
      return {...state,
        selectedAccount: action.payload,
        errors: {...state.errors, selectedAccountError: ""}
      }
    }
    case PAYMENT.JOIN_PAYMENT_FORM_TX_BROADCAST_REJECTED: {
      return {...state, bcError: action.payload}
    }
    case PAYMENT.JOIN_PAYMENT_GAS_PRICE_SPECIFIED: {
      return {...state, gasPrice: action.payload}
    }
    case PAYMENT.JOIN_PAYMENT_NAME_SPECIFIED: {
      return {...state, name: action.payload}
    }
    case PAYMENT.JOIN_PAYMENT_GAS_SPECIFIED: {
      return {...state, gas: action.payload }
    }
    case PAYMENT.JOIN_PAYMENT_ERROR_THREW: {
      return {...state, errors: {...state.errors, ...action.payload}}
    }
    case PAYMENT.JOIN_PAYMENT_EMPTIED: {
      return {...initState}
    }
  }
  return state
}

export default joinPaymentForm
