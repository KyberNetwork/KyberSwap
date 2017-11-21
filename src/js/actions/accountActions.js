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

export function pKeyChange(value){
    return {
        type: "ACCOUNT.PKEY_CHANGE",
        payload: value
    }
}

export function throwPKeyError(error){
    return {
        type: "ACCOUNT.PKEY_ERROR",
        payload: error
    }
}

export function importNewAccount(address, type, keystring, ethereum, avatar, tokens) {
    return {
        type: "ACCOUNT.IMPORT_NEW_ACCOUNT_PENDING",
        payload: {address, type, keystring, ethereum, avatar, tokens}
    }
}

export function importNewAccountComplete(account){
    return {
        type: "ACCOUNT.IMPORT_NEW_ACCOUNT_FULFILLED",
        payload: account
    }
}

export function closeImportLoading(){
    return{
        type: "ACCOUNT.CLOSE_LOADING_IMPORT"
    }
}

export function throwError(error) {
	return {
        type: "ACCOUNT.THROW_ERROR",
        payload: error
    }
}


export function closeErrorModal(){
    return {
        type: "ACCOUNT.CLOSE_ERROR_MODAL"
    }    
}

export function incManualNonceAccount(address) {
    return {
        type: "ACCOUNT.INC_MANUAL_NONCE_ACCOUNT",
        payload: address
    }
}

