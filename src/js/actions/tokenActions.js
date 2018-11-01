

export function selectToken(symbol, type) {
	 return {
	    type: "TOKEN.SELECT_TOKEN",
	    payload: {symbol, type}
	  }
}

export function initTokens(tokens){
	return {
		type : "TOKEN.INIT_TOKEN",
		payload: {tokens}
	}
}