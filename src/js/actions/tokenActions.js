

export function selectToken(type, symbol) {
	 return {
	    type: "SELECT_TOKEN",
	    payload: {type, symbol}
	  }
}

