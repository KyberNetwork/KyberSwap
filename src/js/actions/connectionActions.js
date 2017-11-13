export function setConnection(ethereum) {
    return {
        type: "CONN.SET_CONNECTION",
        payload: ethereum
    }
}

export function setIntervalConnection(intervalConnection){
    return {
        type: "CONN.SET_INTERVAL_CONNECTION",
        payload: intervalConnection
    }
}


export function clearIntervalConnection(intervalConnection){
    return {
        type: "CONN.CLEAR_INTERVAL_CONNECTION",
        payload: intervalConnection
    }
}