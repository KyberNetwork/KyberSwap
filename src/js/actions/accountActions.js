import store from "../store"
import ACC_ACTION from "../constants/accActions"

export function loadAccounts(node) {
    return {
        type: ACC_ACTION.LOAD_ACCOUNTS,
        payload: service.loadAccounts(node)
    }
}

export function createAccount(address, keystring, name, desc) {
    return {
        type: ACC_ACTION.NEW_ACCOUNT_CREATED_PENDING,
        payload: {address, keystring, name, desc}
    }
}
export function createAccountComplete(account) {
    return {
        type: ACC_ACTION.NEW_ACCOUNT_CREATED_FULFILLED,
        payload: account
    }
}

export function addAccount(address, keystring, name, desc) {
    return {
        type: ACC_ACTION.NEW_ACCOUNT_ADDED_PENDING,
        payload: {address, keystring, name, desc}
    }
}

export function addAccountComplete(account) {
    return {
        type: ACC_ACTION.NEW_ACCOUNT_ADDED_FULFILLED,
        payload: account
    }
}

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

export function modifyAccount(address, name){
    return {
        type: ACC_ACTION.MODIFY_ACCOUNT,
        payload: {address:address, name:name}
    }
}

export function addDeleteAccount(address) {
    return {
        type: ACC_ACTION.ADD_DELETE_ACCOUNT,
        payload: address
    }
}


export function deleteAccount(address) {
    return {
        type: ACC_ACTION.DELETE_ACCOUNT,
        payload: address
    }
}


export function incManualNonceAccount(address) {
    return {
        type: ACC_ACTION.INC_MANUAL_NONCE_ACCOUNT,
        payload: address
    }
}

export function joiningKyberWallet(account, hash) {
    return {
        type: ACC_ACTION.JOINING_KYBER_WALLET,
        payload: { account, hash }
    }
}

export function joinedKyberWallet(address, contractAddress) {
    return {
        type: ACC_ACTION.JOINED_KYBER_WALLET,
        payload: { address, contractAddress }
    }
}


export function sortAccount(order, field) {
    return {
        type: ACC_ACTION.SORT_ACCOUNT_BY_FIELD,
        payload: { order, field }
    }   
}