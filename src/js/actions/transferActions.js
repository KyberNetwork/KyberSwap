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