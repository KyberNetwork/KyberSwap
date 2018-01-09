const initState = {
}

const connection = (state=initState, action) => {

  switch (action.type) {
    case "CONN.SET_CONNECTION":
      return {...state, ethereum: action.payload}
    case "CONN.SET_INTERVAL_CONNECTION":
      return {...state, intervalConn: action.payload}
    case "CONN.CLEAR_INTERVAL_CONNECTION":
      var oldState = {...state}
      clearInterval(oldState.intervalConn)
      return {...state, interval: null}
  }
  return state
}

export default connection
