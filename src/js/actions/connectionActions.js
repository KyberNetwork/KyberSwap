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

export function createNewConnectionInstance(){
    return {
        type: "CONNECTION.CREATE_NEW_CONNECTION",
        // payload: {ethereum}
    }
}

// export function setSubprovider(provider) {
//   return {
//       type: "CONN.SET_SUB_PROVIDER",
//       payload: provider
//   }
// }