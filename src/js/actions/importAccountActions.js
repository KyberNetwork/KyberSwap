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
