import BigNumber from 'bignumber.js';
import constants from "../services/constants";


const initState = {
  selectedAccount: "",
  sourceToken: constants.ETHER_ADDRESS,
  sourceAmount: 0,
  destToken: constants.ETHER_ADDRESS,
  minConversionRate: 0,
  destAddress: "",
  maxDestAmount: (new BigNumber(2)).pow(255).toString(10),
  throwOnFailure: false,
  gas: 1000000,
  gasPrice: 20000000000,
  error: "",
}

const exchangeForm = (state=initState, action) => {
  switch (action.type) {
    case "ACCOUNT_SELECTED": {
      return {...state, selectedAccount: action.payload};
    }
    case "SOURCE_TOKEN_SELECTED": {
      return {...state, sourceToken: action.payload};
    }
    case "DEST_TOKEN_SELECTED": {
      return {...state, destToken: action.payload};
    }
    case "SOURCE_AMOUNT_SPECIFIED": {
      return {...state, sourceAmount: action.payload};
    }
    case "MIN_CONVERSION_RATE_SPECIFIED": {
      return {...state, minConversionRate: action.payload};
    }
    case "RECIPIENT_SPECIFIED": {
      return {...state, destAddress: action.payload};
    }
    case "GAS_PRICE_SPECIFIED": {
      return {...state, gasPrice: action.payload};
    }
    case "GAS_SPECIFIED": {
      return {...state, gas: action.payload};
    }
    case "ERROR_THREW": {
      return {...state, error: action.payload};
    }
    case "EXCHANGE_FORM_EMPTIED": {
      return {...initState}
    }
    case "EXCHANGE_FORM_SUGGEST_RATE": {
      return {...state, minConversionRate: action.payload}
    }
  }
  return state;
}

export default exchangeForm;

