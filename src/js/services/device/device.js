import TrezorConnect from "./trezor/trezor-connect";
import ledgerU2f from './ledger/ledger-comm-u2f';
import ledgerEth from './ledger/ledger-eth';

const defaultDPath = "m/44'/60'/0'/0";
const ledgerPath = "m/44'/60'/0'";

export function getTrezorPublicKey(path = defaultDPath) {
    return new Promise((resolve, reject) => {
        TrezorConnect.getXPubKey(path, (result) => {
            if (result.success) {
                result.dPath = path;
                resolve(result);
            } else {
                reject(result);
            }
        })
    });
}


export function connectLedger(time) {
    return new Promise((resolve, reject) => {
        ledgerU2f.create_async(time)
            .then((comm) => {
                var eth = new ledgerEth(comm);
                resolve(eth);
            })
            .fail((err) => {
                reject(err);
            });
    });
}

export function getLedgerPublicKey(eth,path = ledgerPath) {
    return new Promise((resolve, reject) => {
        eth.getAddress_async(path, false, true)
            .then((result) => {
                result.dPath = path;
                resolve(result);
            })
            .fail((err) => {
                reject(err);
            });
    });
}

export function signLedgerTransaction(eth, path, raxTxHex) {
    return new Promise((resolve, reject) => {
        eth.signTransaction_async(path, raxTxHex)
            .then((result) => {
                resolve(result);
            })
            .fail((err) => {
                reject(err);
            });

    });
}
