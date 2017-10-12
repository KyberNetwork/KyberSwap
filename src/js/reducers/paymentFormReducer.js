import BigNumber from 'bignumber.js';
import constants from "../services/constants";
import PAYMENT from "../constants/paymentFormActions"

const initState = {
  selectedWallet: "",
  sourceToken: constants.ETHER_ADDRESS,
  sourceAmount: 0,
  destToken: constants.ETHER_ADDRESS,
  minConversionRate: 0,
  destAddress: "",
  maxDestAmount: (new BigNumber(2)).pow(255).toString(10),
  throwOnFailure: false,
  onlyApproveToken: true,
  gas: 1000000,
  gasPrice: 20000000000,
  error: "",
}

const paymentForm = (state=initState, action) => {
  switch (action.type) {
    case PAYMENT.PAYMENT_FORM_WALLET_SELECTED: {
      return {...state, selectedWallet: action.payload};
    }
    case PAYMENT.PAYMENT_FORM_SOURCE_TOKEN_SELECTED: {
      return {...state, sourceToken: action.payload};
    }
    case PAYMENT.PAYMENT_FORM_DEST_TOKEN_SELECTED: {
      return {...state, destToken: action.payload};
    }
    case PAYMENT.PAYMENT_FORM_SOURCE_AMOUNT_SPECIFIED: {
      return {...state, sourceAmount: action.payload};
    }
    case PAYMENT.PAYMENT_FORM_MIN_CONVERSION_RATE_SPECIFIED: {
      return {...state, minConversionRate: action.payload};
    }
    case PAYMENT.PAYMENT_FORM_RECIPIENT_SPECIFIED: {
      return {...state, destAddress: action.payload};
    }
    case PAYMENT.PAYMENT_FORM_GAS_PRICE_SPECIFIED: {
      return {...state, gasPrice: action.payload};
    }
    case PAYMENT.PAYMENT_FORM_GAS_SPECIFIED: {
      return {...state, gas: action.payload};
    }
    case PAYMENT.PAYMENT_FORM_ONLY_APPROVE_TOKEN_SPECIFIED: {
      return {...state, onlyApproveToken: action.payload};
    }
    case PAYMENT.PAYMENT_FORM_ERROR_THREW: {
      return {...state, error: action.payload};
    }
    case PAYMENT.PAYMENT_FORM_EMPTIED: {
      return {...initState}
    }
    case PAYMENT.PAYMENT_FORM_SUGGEST_RATE: {
      return {...state, minConversionRate: action.payload}
    }
  }
  return state
}

export default paymentForm

