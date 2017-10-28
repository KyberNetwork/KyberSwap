import store from "../store"

export function updateAccount(ethereum, account) {
    return {
        type: "ACCOUNT.UPDATE_ACCOUNT_PENDING",
        payload: {ethereum, account}
    }
}

export function updateAccountComplete(account) {
    return {
        type: "ACCOUNT.UPDATE_ACCOUNT_FULFILLED",
        payload: account
    }
}

export function importLoading(){
    return {
        type: "ACCOUNT.LOADING"
    }
}

export function importNewAccount(address, type, keystring) {
    return {
        type: "ACCOUNT.IMPORT_NEW_ACCOUNT_PENDING",
        payload: {address, type, keystring}
    }
}

export function importNewAccountComplete(account){
    return {
        type: "ACCOUNT.IMPORT_NEW_ACCOUNT_FULFILLED",
        payload: account
    }
}

export function throwError(error) {
	return {
        type: "ACCOUNT.THROW_ERROR",
        payload: error
    }
}

export function incManualNonceAccount(address) {
    return {
        type: "ACCOUNT.INC_MANUAL_NONCE_ACCOUNT",
        payload: address
    }
}
