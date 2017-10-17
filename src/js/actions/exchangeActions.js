
export function  errorSelectToken(message) {
	return {
		type: "THOW_ERROR_SELECT_TOKEN",
		payload: message
	}
}


export function goToStep(step){
	return {
		type: "GO_TO_STEP",
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