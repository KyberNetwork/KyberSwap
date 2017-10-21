export function selectToken(symbol,address){
	return {
		type: "TRANSFER.SELECT_TOKEN",
		payload: {symbol,address}
	}
}

export function hidePassphrase(){
	return {
		type: "TRANSFER.HIDE_PASSPHRASE",		
	}					
}

export function  errorSelectToken(message) {
	return {
		type: "TRANSFER.THOW_ERROR_SELECT_TOKEN",
		payload: message
	}
}

export function goToStep(step){
	return {
		type: "TRANSFER.GO_TO_STEP",
		payload: step
	}	
}

export function openPassphrase(){
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

export function specifyGasPrice(value) {
	return {
		type: "TRANSFER_SPECIFY_GAS_PRICE",
		payload: value
	}	
}

export function showAdvance(){
	return {
		type: "TRANSFER.SHOW_ADVANCE",		
	}		
}

export function hideAdvance(){
	return {
		type: "TRANSFER.HIDE_ADVANCE",		
	}		
}

export function specifyAddressReceive(value){
	return {
		type: "TRANSFER.TRANSFER_SPECIFY_ADDRESS_RECEIVE",
		payload: value
	}
}

export function specifyAmountTransfer(value){
	return {
		type: "TRANSFER.TRANSFER_SPECIFY_AMOUNT",
		payload: value
	}
}