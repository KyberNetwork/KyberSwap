import { default as Wallet } from "./myetherwallet";
import { default as ledgerU2f } from './ledger-comm-u2f';
import { default as ledgerEth } from './ledger-eth'
import { default as HDKey } from 'hdkey';

export function connectLedger(dpath){
  return new Promise((resolve, reject) => {
    ledgerU2f.create_async().then((comm) => {
      var eth = new ledgerEth(comm);
      resolve(eth);
    })
    .fail((err) => {
      reject(err);
    });
  });
}

export function getLedgerPublicKey(eth, dpath){
  return new Promise((resolve, reject) => {
    eth.getAddress_async(dpath, false, true)
    .then((result) => { 
      resolve(result);
    })
    .fail((err) => {
      reject(err);
    });
  }); 
}

export function getLedgerAddress(ledgerData, dpath, start, limit){
    var wallets = [];
    var hdk = new HDKey();
    hdk.publicKey = new Buffer(ledgerData['publicKey'], 'hex');
    hdk.chainCode = new Buffer(ledgerData['chainCode'], 'hex');
    for(var i = start; i < start + limit; i++) {
      var derivedKey = hdk.derive("m/" + i);
      wallets.push(new Wallet(undefined, derivedKey.publicKey, dpath + "/" + i, 'ledger'));
      // wallets[wallets.length - 1].type = "addressOnly";
      // wallets[wallets.length - 1].setBalance(false);
    }
    console.log(wallets);
    return wallets;
}