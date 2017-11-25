

export function selectToken(symbol, type) {
	 return {
	    type: "TOKEN.SELECT_TOKEN",
	    payload: {symbol, type}
	  }
}

