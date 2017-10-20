import IMPORT from "../constants/importAccountActions"

export function saveKeyStore(address, keystore) {
    return {
        type: IMPORT.SAVE_KEYSTORE,
        payload: {address, keystore}
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
