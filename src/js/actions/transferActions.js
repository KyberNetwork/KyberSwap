export function selectToken(symbol, address) {
	return {
		type: "TRANSFER.SELECT_TOKEN",
		payload: { symbol, address }
	}
}

export function errorSelectToken(message) {
	return {
		type: "TRANSFER.THOW_ERROR_SELECT_TOKEN",
		payload: message
	}
}

export function goToStep(step) {
	return {
		type: "TRANSFER.GO_TO_STEP",
		payload: step
	}
}

export function openPassphrase() {
	return {
		type: "TRANSFER.OPEN_PASSPHRASE",
	}
}

export function specifyGas(value) {
	return {
		type: "TRANSFER_SPECIFY_GAS",
		payload: value
	}
}

export function setRandomTransferSelectedToken(random){
	return {
		type: "TRANSFER.SET_RANDOM_SELECTED_TOKEN",
		payload: random
	}
}

export function specifyGasPrice(value) {
	return {
		type: "TRANSFER_SPECIFY_GAS_PRICE",
		payload: value
	}
}

export function showAdvance() {
	return {
		type: "TRANSFER.SHOW_ADVANCE",
	}
}

export function hideAdvance() {
	return {
		type: "TRANSFER.HIDE_ADVANCE",
	}
}

export function hideConfirm() {
	return {
		type: "TRANSFER.HIDE_CONFIRM",
	}
}

export function showConfirm() {
	return {
		type: "TRANSFER.SHOW_CONFIRM",

	}
}

export function specifyAddressReceive(value) {
	return {
		type: "TRANSFER.TRANSFER_SPECIFY_ADDRESS_RECEIVE",
		payload: value
	}
}

export function specifyAmountTransfer(value) {
	return {
		type: "TRANSFER.TRANSFER_SPECIFY_AMOUNT",
		payload: value
	}
}

export function throwErrorDestAddress(message) {
	return {
		type: "TRANSFER.THROW_ERROR_DEST_ADDRESS",
		payload: message
	}
}


export function thowErrorAmount(message) {
	return {
		type: "TRANSFER.THROW_AMOUNT_ERROR",
		payload: message
	}
}


export function hidePassphrase() {
	return {
		type: "TRANSFER.HIDE_PASSPHRASE",
	}
}

export function changePassword() {
	return {
		type: "TRANSFER.CHANGE_PASSPHRASE",
	}
}

export function finishTransfer() {
	return {
		type: "TRANSFER.FINISH_TRANSACTION"
	}
}

export function throwPassphraseError(message) {
	return {
		type: "TRANSFER.THROW_ERROR_PASSPHRASE",
		payload: message
	}
}

export function processTransfer(formId, ethereum, address,
	token, amount,
	destAddress, nonce, gas,
	gasPrice, keystring, type, password, account, data) {
	return {
		type: "TRANSFER.PROCESS_TRANSFER",
		payload: {
			formId, ethereum, address,
			token, amount,
			destAddress, nonce, gas,
			gasPrice, keystring, type, password, account, data
		}
	}
}

export function doTransaction(id, ethereum, tx, account, data) {
	return {
		type: "TRANSFER.TX_BROADCAST_PENDING",
		payload: { ethereum, tx, account, data },
		meta: id,
	}
}

export function doTransactionComplete(txHash, id) {
	return {
		type: "TRANSFER.TX_BROADCAST_FULFILLED",
		payload: txHash,
		meta: id,
	}
}

export function doTransactionFail(error, id) {
	return {
		type: "TRANSFER.TX_BROADCAST_REJECTED",
		payload: error,
		meta: id,
	}
}

export function doApprovalTransaction(id, ethereum, tx, callback) {
	return {
		type: "TRANSFER.APPROVAL_TX_BROADCAST_PENDING",
		payload: { ethereum, tx, callback },
		meta: id,
	}
}

export function doApprovalTransactionComplete(txHash, id) {
	return {
		type: "TRANSFER.APPROVAL_TX_BROADCAST_FULFILLED",
		payload: txHash,
		meta: id,
	}
}

export function doApprovalTransactionFail(error, id) {
	return {
		type: "TRANSFER.APPROVAL_TX_BROADCAST_REJECTED",
		payload: error,
		meta: id,
	}
}

// export function saveRawTransferTransaction(tx){
// 	return {
// 		type: "TRANSFER.SAVE_RAW_TRANSACTION",
// 		payload: tx			
// 	}
// }

export function throwErrorSignTransferTransaction(error) {
	return {
		type: "TRANSFER.THROW_ERROR_SIGN_TRANSACTION",
		payload: error
	}
}

export function makeNewTransfer() {
	return {
		type: "TRANSFER.MAKE_NEW_TRANSFER"
	}
}