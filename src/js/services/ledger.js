import { default as Wallet } from "./ledger/myetherwallet";
import { default as ledger } from "./ledger/index";
import { default as HDKey } from 'hdkey';

export function connectLedger(dpath){
  return new Promise((resolve, reject) => {
    ledger.comm_u2f.create_async().then((comm) => {
      var eth = new ledger.eth(comm);
      resolve(eth);
    })
    .fail((err) => {
      console.log(err);
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

export function letLedgerAddress(ledgerData, start, limit){
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