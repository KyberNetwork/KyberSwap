
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

export function showAdvance(){
	return {
		type: "EXCHANGE.SHOW_ADVANCE",		
	}		
}

export function hideAdvance(){
	return {
		type: "EXCHANGE.HIDE_ADVANCE",		
	}		
}

export function changeSourceAmout(amount){
	return {
		type: "EXCHANGE.CHANGE_SOURCE_AMOUNT",
		payload: amount		
	}			
}

export function updateRateExchange(rate){
	return {
		type: "EXCHANGE.UPDATE_RATE",
		payload: rate
	}				
}