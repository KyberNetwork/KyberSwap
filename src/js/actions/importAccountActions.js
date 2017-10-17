import IMPORT from "../constants/importAccountActions"

export function saveKeyStore(address, keystore, callBack) {
    return {
        type: IMPORT.SAVE_KEYSTORE,
        payload: {address, keystore, callBack}
    }
}
export function throwError(error) {
	return {
        type: IMPORT.THROW_ERROR,
        payload: error
    }
}
