import TrezorConnect from "./trezor/trezor-connect";
import ledgerU2f from './ledger/ledger-comm-u2f';
import ledgerEth from './ledger/ledger-eth';

const defaultDPath = "m/44'/60'/0'/0";
const ledgerPath = "m/44'/60'/0'/0";

export function getPubData() {
    return new Promise((resolve, reject) => {
        TrezorConnect.getXPubKey(defaultDPath, (result) => {
            if (result.success) {
                resolve(result);
            } else {
                reject(result.error);
            }
        })
    });
}


export function connectLedger(ledgerPath) {
    return new Promise((resolve, reject) => {
        ledgerU2f.create_async()
            .then((comm) => {
                var eth = new ledgerEth(comm);
                resolve(eth);
            })
            .fail((err) => {
                reject(err);
            });
    });
}

export function getLedgerPublicKey(eth, ledgerPath) {
    return new Promise((resolve, reject) => {
        eth.getAddress_async(ledgerPath, false, true)
            .then((result) => {
                resolve(result);
            })
            .fail((err) => {
                reject(err);
            });
    });
}
