import TrezorConnect from "./trezor/trezor-connect";
import ledgerU2f from './ledger/ledger-comm-u2f';
import ledgerEth from './ledger/ledger-eth';

const defaultDPath = "m/44'/60'/0'/0";
const ledgerPath = "m/44'/60'/0'";

export function getTrezorPublicKey() {
    return new Promise((resolve, reject) => {
        TrezorConnect.getXPubKey(defaultDPath, (result) => {
            if (result.success) {
                result.dPath = defaultDPath;
                resolve(result);
            } else {
                reject(result.error);
            }
        })
    });
}


export function connectLedger() {
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

export function getLedgerPublicKey(eth) {
    return new Promise((resolve, reject) => {
        eth.getAddress_async(ledgerPath, false, true)
            .then((result) => {
                result.dPath = ledgerPath;
                resolve(result);
            })
            .fail((err) => {
                reject(err);
            });
    });
}
