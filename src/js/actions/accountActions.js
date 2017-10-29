import store from "../store"
import ACC_ACTION from "../constants/accActions"




export function updateAccount(ethereum, account) {
    return {
        type: ACC_ACTION.UPDATE_ACCOUNT_PENDING,
        payload: {ethereum, account}
    }
}

export function updateAccountComplete(account) {
    return {
        type: ACC_ACTION.UPDATE_ACCOUNT_FULFILLED,
        payload: account
    }
}


import IMPORT from "../constants/importAccountActions"

export function importLoading(){
    return {
        type: "IMPORT.LOADING"
    }
}

export function importNewAccount(address, type, keystring, ethereum) {
    return {
        type: "IMPORT.IMPORT_NEW_ACCOUNT_PENDING",
        payload: {address, type, keystring, ethereum}
    }
}

export function importNewAccountComplete(account){
    return {
        type: "IMPORT.IMPORT_NEW_ACCOUNT_FULFILLED",
        payload: account
    }
}

export function closeImportLoading(){
    return{
        type: "IMPORT.CLOSE_LOADING_IMPORT"
    }
}

export function throwError(error) {
	return {
        type: "IMPORT.THROW_ERROR",
        payload: error
    }
}

export function scanLedger(path){
    return {
        type: 'IMPORT.SCAN_LEDGER',
        payload: path
    }
}

export function scanLedgerComplete(wallets){
    return {
        type: 'IMPORT.SCAN_LEDGER_COMPLETE',
        payload: wallets
    }
}

export function scanLedgerFailed(err){
    return {
        type: 'IMPORT.SCAN_LEDGER_FAILED',
        payload: err 
    }
}


export function incManualNonceAccount(address) {
    return {
        type: ACC_ACTION.INC_MANUAL_NONCE_ACCOUNT,
        payload: address
    }
}
