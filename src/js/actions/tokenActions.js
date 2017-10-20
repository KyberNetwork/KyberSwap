

export function selectToken(symbol, type) {
	 return {
	    type: "SELECT_TOKEN",
	    payload: {symbol, type}
	  }
}

