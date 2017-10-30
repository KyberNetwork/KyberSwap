
//import {RATE_EPSILON} from "../services/constants.js"
import constants from "../services/constants"

export function selectTokenAsync(symbol, address, type, ethereum) {
	return {
		type: "EXCHANGE.SELECT_TOKEN_ASYNC",
		payload: { symbol, address, type, ethereum }
	}
}
export function selectToken(symbol, address, type) {
	return {
		type: "EXCHANGE.SELECT_TOKEN",
		payload: { symbol, address, type }
	}
}
export function checkSelectToken() {
	return {
		type: "EXCHANGE.CHECK_SELECT_TOKEN"
	}
}

export function thowErrorSourceAmount(message) {
	return {
		type: "EXCHANGE.THROW_SOURCE_AMOUNT_ERROR",
		payload: message
	}
}

export function errorSelectToken(message) {
	return {
		type: "EXCHANGE.THOW_ERROR_SELECT_TOKEN",
		payload: message
	}
}


export function goToStep(step) {
	return {
		type: "EXCHANGE.GO_TO_STEP",
		payload: step
	}
}

export function specifyGas(value) {
	return {
		type: "EXCHANGE_SPECIFY_GAS",
		payload: value
	}
}

export function specifyGasPrice(value) {
	return {
		type: "EXCHANGE_SPECIFY_GAS_PRICE",
		payload: value
	}
}

export function showAdvance() {
	return {
		type: "EXCHANGE.SHOW_ADVANCE",
	}
}

export function hideAdvance() {
	return {
		type: "EXCHANGE.HIDE_ADVANCE",
	}
}

export function changeSourceAmout(amount) {
	return {
		type: "EXCHANGE.CHANGE_SOURCE_AMOUNT",
		payload: amount
	}
}

export function updateRateExchange(rate) {
	//console.log(rate)
	if (rate) {
		var offeredRate = rate[0].times(1 - constants.RATE_EPSILON).toString(10)
		var expirationBlock = rate[1].toString(10)
		var reserveBalance = rate[2].toString(10)
		return {
			type: "EXCHANGE.UPDATE_RATE",
			payload: { offeredRate, expirationBlock, reserveBalance }
		}
	} else {
		return {
			type: "EXCHANGE.UPDATE_RATE",
			payload: { offeredRate: 0, expirationBlock: 0, reserveBalance: 0 }
		}
	}

	// var bigRate = rate.rate
	//    //if (epsilon) {
	//      bigRate = bigRate.times(1-RATE_EPSILON)
	//    //}
	//    return {
	//      type: "EXCHANGE_FORM_SUGGEST_RATE",
	//      payload: {
	//        rate: bigRate.toString(10),
	//        reserve: rate.reserve,
	//        expirationBlock: rate.expirationBlock,
	//        balance: rate.balance.toString(10),
	//      },
	//      meta: id,
	//    }

	// return {
	// 	type: "EXCHANGE.UPDATE_RATE",
	// 	payload: rate
	// }				
}


export function openPassphrase() {
	return {
		type: "EXCHANGE.OPEN_PASSPHRASE",
	}
}

export function hidePassphrase() {
	return {
		type: "EXCHANGE.HIDE_PASSPHRASE",
	}
}

export function hideConfirm() {
	return {
		type: "EXCHANGE.HIDE_CONFIRM",
	}
}

export function showConfirm() {
	return {
		type: "EXCHANGE.SHOW_CONFIRM",
	}
}

export function hideApprove() {
	return {
		type: "EXCHANGE.HIDE_APPROVE",
	}
}

export function showApprove() {
	return {
		type: "EXCHANGE.SHOW_APPROVE",
	}
}
export function hideConfirmApprove() {
	return {
		type: "EXCHANGE.HIDE_CONFIRM_APPROVE",
	}
}

export function showConfirmApprove() {
	return {
		type: "EXCHANGE.SHOW_CONFIRM_APPROVE",
	}
}
export function changePassword() {
	return {
		type: "EXCHANGE.CHANGE_PASSPHRASE",
	}
}

export function finishExchange() {
	return {
		type: "EXCHANGE.FINISH_EXCHANGE"
	}
}

export function throwPassphraseError(message) {
	return {
		type: "EXCHANGE.THROW_ERROR_PASSPHRASE",
		payload: message
	}
}

export function processExchange(formId, ethereum, address, sourceToken,
	sourceAmount, destToken, destAddress,
	maxDestAmount, minConversionRate,
	throwOnFailure, nonce, gas,
	gasPrice, keystring, type, password, account, data) {
	return {
		type: "EXCHANGE.PROCESS_EXCHANGE",
		payload: {
			formId, ethereum, address, sourceToken,
			sourceAmount, destToken, destAddress,
			maxDestAmount, minConversionRate,
			throwOnFailure, nonce, gas,
			gasPrice, keystring, type, password, account, data
		}
	}
}

export function processExchangeAfterConfirm(formId, ethereum, address, sourceToken,
	sourceAmount, destToken, destAddress,
	maxDestAmount, minConversionRate,
	throwOnFailure, nonce, gas,
	gasPrice, keystring, type, password, account, data) {
	return {
		type: "EXCHANGE.PROCESS_EXCHANGE_AFTER_CONFIRM",
		payload: {
			formId, ethereum, address, sourceToken,
			sourceAmount, destToken, destAddress,
			maxDestAmount, minConversionRate,
			throwOnFailure, nonce, gas,
			gasPrice, keystring, type, password, account, data
		}
	}
}

// export function processExchangeAfterApprove(formId, ethereum, address, sourceToken,
// 	sourceAmount, destToken, destAddress,
// 	maxDestAmount, minConversionRate,
// 	throwOnFailure, nonce, gas,
// 	gasPrice, keystring, type, password, account, data) {
// 	return {
// 		type: "EXCHANGE.PROCESS_EXCHANGE_AFTER_APPROVE",
// 		payload: {
// 			formId, ethereum, address, sourceToken,
// 			sourceAmount, destToken, destAddress,
// 			maxDestAmount, minConversionRate,
// 			throwOnFailure, nonce, gas,
// 			gasPrice, keystring, type, password, account, data
// 		}
// 	}
// }

export function doApprove(ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
	keystring, password, accountType, account) {
	return {
		type: "EXCHANGE.PROCESS_APPROVE",
		payload: {
			ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
			keystring, password, accountType, account
		}
	}
}
export function doTransaction(id, ethereum, tx, account, data) {
	return {
		type: "EXCHANGE.TX_BROADCAST_PENDING",
		payload: { ethereum, tx, account, data },
		meta: id,
	}
}

export function doTransactionComplete(txHash) {
	return {
		type: "EXCHANGE.TX_BROADCAST_FULFILLED",
		payload: txHash,
	}
}

export function doTransactionFail(error) {
	return {
		type: "EXCHANGE.TX_BROADCAST_REJECTED",
		payload: error
	}
}

export function doApprovalTransaction(id, ethereum, tx, callback) {
	return {
		type: "EXCHANGE.APPROVAL_TX_BROADCAST_PENDING",
		payload: { ethereum, tx, callback },
		meta: id,
	}
}

export function doApprovalTransactionComplete(txHash, id) {
	return {
		type: "EXCHANGE.APPROVAL_TX_BROADCAST_FULFILLED",
		payload: txHash,
		meta: id,
	}
}

export function doApprovalTransactionFail(error) {
	return {
		type: "EXCHANGE.APPROVAL_TX_BROADCAST_REJECTED",
		payload: error,
	}
}

export function makeNewExchange() {
	return {
		type: "EXCHANGE.MAKE_NEW_EXCHANGE"
	}
}

export function saveRawExchangeTransaction(tx) {
	return {
		type: "EXCHANGE.SAVE_RAW_TRANSACTION",
		payload: tx
	}
}

export function throwErrorSignExchangeTransaction(error) {
	return {
		type: "EXCHANGE.THROW_ERROR_SIGN_TRANSACTION",
		payload: error
	}
}