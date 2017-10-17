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