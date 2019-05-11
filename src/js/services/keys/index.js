export { default as KeyStore } from './keystore.js'
export { default as PrivateKey } from './privateKey.js'

export { default as Trezor } from './trezor.js'
export { default as Ledger } from './ledger.js'

export { default as Metamask } from './metamask.js'


export function getWallet(type) {
    switch (type) {
        case "keystore":
            keyService = new KeyStore()
            break
        case "privateKey":
        case "promo":
            keyService = new PrivateKey()
            break
        case "trezor":
            keyService = new Trezor()
            break
        case "ledger":
            keyService = new Ledger()
            break
        case "metamask":
            keyService = new Metamask()
            break
        default:
            keyService = new KeyStore()
            break
    }
    return keyService
}
