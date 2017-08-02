import * as service from "../services/accounts"
import store from "../store"
import { addressFromKey } from "../utils/keys"

export function loadAccounts(node) {
    return {
        type: "LOAD_ACCOUNTS",
        payload: service.loadAccounts(node)
    }
}

export function createAccount(passphrase, name, desc, ethereum) {
    return {
        type: "CREATE_NEW_ACCOUNT",
        payload: new Promise((resolve, reject) => {
            service.createKeyStore(passphrase, name, desc, ethereum, resolve)

            // service.createKeyStore(ethereum, passphrase, function(keyString){
            //   console.log(keyString)
            //   var address = addressFromKey(keyString)    
            //   service.newAccountInstance(
            //       address, keyString, name, desc, resolve)
            //   })  
            // })
            //var keystring =JSON.stringify(ethereum.createNewAddress(passphrase))    
            //console.log(keystring)  

        })
    }
}

export function addAccount(address, keystring, name, desc) {
    return {
        type: "NEW_ACCOUNT_ADDED",
        payload: new Promise((resolve, reject) => {
            service.newAccountInstance(
                address, keystring, name, desc, resolve)
        })
    }
}


export function updateAccount(ethereum, account) {
    return {
        type: "UPDATE_ACCOUNT",
        payload: new Promise((resolve, reject) => {
            account.sync(ethereum, resolve)
        })
    }
}

export function deleteAccount(address) {
    return {
        type: "DELETE_ACCOUNT",
        payload: address
    }
}


export function incManualNonceAccount(address) {
    return {
        type: "INC_MANUAL_NONCE_ACCOUNT",
        payload: address
    }
}

export function joiningKyberWallet(account, hash) {
    return {
        type: "JOINING_KYBER_WALLET",
        payload: { account, hash }
    }
}

export function joinedKyberWallet(address, contractAddress) {
    return {
        type: "JOINED_KYBER_WALLET",
        payload: { address, contractAddress }
    }
}