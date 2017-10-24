import EthereumTx from "ethereumjs-tx"
import { unlock } from "./keys"
import TrezorConnect from "../services/device/trezor/trezor-connect";
import { numberToHex} from "./converter"

export function sealTxByKeystore(params, keystore, password) {
  const tx = new EthereumTx(params)
  const privKey = unlock(keystore, password, true)
  tx.sign(privKey)
  return tx
}




export function sealTxByTrezor(params, callback, callbackFail){
  var address_n = params.address_n
  var nonce = numberToHex(params.nonce).slice(2); 
  if (nonce.length % 2){
    nonce = '0' + nonce
  }
  var gasPrice = params.gasPrice.slice(2);
  if (gasPrice.length % 2){
    gasPrice = '0' + gasPrice
  }
  var gasLimit = params.gasLimit.slice(2);
  if (gasLimit.length % 2){
    gasLimit = '0' + gasLimit
  }
  var to = params.to.slice(2);
  var value = params.value.slice(2); 
  if (value.length % 2){
    value = '0' + value
  }
  var data = params.data.slice(2)
  if (data.length % 2){
    data = '0' + data
  }
  var chain_id = params.chainId; // 1 for ETH, 61 for ETC
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
          console.log(v)        
          var r = new Buffer(response.r, 'hex');          
          var s = new Buffer(response.s, 'hex');
          var tx = new EthereumTx({ 
            nonce : params.nonce, 
            gasPrice: params.gasPrice, 
            gasLimit: params.gasLimit, 
            to: params.to, 
            value: params.value, 
            data:params.data, 
            v:v,
            r:r, 
            s:s})            
          callback(tx)
     } else {
        callbackFail(response.error)         
     }
 });
}
