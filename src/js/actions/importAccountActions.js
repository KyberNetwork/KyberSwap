import IMPORT from "../constants/importAccountActions"

export function importNewAccount(address, type, keystore) {
    return {
        type: "IMPORT.IMPORT_NEW_ACCOUNT_PENDING",
        payload: {address, type, keystore}
    }
}

export function importNewAccountComplete(account){
    return {
        type: "IMPORT.IMPORT_NEW_ACCOUNT_FULFILLED",
        payload: account
    }
}

export function throwError(error) {
	return {
        type: IMPORT.THROW_ERROR,
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
