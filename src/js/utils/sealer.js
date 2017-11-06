import EthereumTx from "ethereumjs-tx"
import { unlock } from "./keys"
import TrezorConnect from "../services/device/trezor/trezor-connect";
import { numberToHex } from "./converter"

import ethUtil from "ethereumjs-util";
import { signLedgerTransaction, connectLedger } from "../services/device/device";

export function sealTxByKeystore(params, keystore, password) {
  const tx = new EthereumTx(params)
  const privKey = unlock(keystore, password, true)
  tx.sign(privKey)
  return tx
}

export function sealTxByTrezor(params) {
  var address_n = params.address_n
  var nonce = numberToHex(params.nonce).slice(2);
  if (nonce.length % 2) {
    nonce = '0' + nonce
  }
  var gasPrice = params.gasPrice.slice(2);
  if (gasPrice.length % 2) {
    gasPrice = '0' + gasPrice
  }
  var gasLimit = params.gasLimit.slice(2);
  if (gasLimit.length % 2) {
    gasLimit = '0' + gasLimit
  }
  var to = params.to.slice(2);
  var value = params.value.slice(2);
  if (value.length % 2) {
    value = '0' + value
  }
  var data = ""
  if (params.data) {
    data = params.data.slice(2)
    if (data.length % 2) {
      data = '0' + data
    }
  }

  var chain_id = params.chainId; // 1 for ETH, 61 for ETC
  return new Promise((resolve, reject)=>{
    TrezorConnect.signEthereumTx(
      address_n,
      nonce,
      gasPrice,
      gasLimit,
      to,
      value,
      data,
      chain_id,
      function (response) {
        if (response.success) {
          var v = new Buffer([response.v]);
          var r = new Buffer(response.r, 'hex');
          var s = new Buffer(response.s, 'hex');
          var tx = new EthereumTx({
            nonce: params.nonce,
            gasPrice: params.gasPrice,
            gasLimit: params.gasLimit,
            to: params.to,
            value: params.value,
            data: params.data,
            v: v,
            r: r,
            s: s
          })
          resolve(tx)
        } else {
          reject(response.error)
        }
      })
  })
  
}

export function sealTxByLedger(params) {
  const eTx = new EthereumTx(params)

  eTx.raw[6] = Buffer.from([params.chainId]);
  // eTx.raw[7] = eTx.raw[8] = 0;
  let txToSign = ethUtil.rlp.encode(eTx.raw);  
  return new Promise((resolve, reject)=>{
    connectLedger().then((eth) => {
      signLedgerTransaction(eth, params.address_n,  txToSign.toString('hex')).then((response) => {        
        if(response.status){
          params.v = "0x" + response['v'];
          params.r = "0x" + response['r'];
          params.s = "0x" + response['s'];
          var tx = new EthereumTx(params);  
          resolve(tx);
        }else{
          reject(response.error)    
        }          
      })
    }).catch((err) => {
      reject(err)      
    })
  })  
}