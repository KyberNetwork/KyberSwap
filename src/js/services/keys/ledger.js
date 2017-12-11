import * as keyService from "./baseKey"
import EthereumTx from "ethereumjs-tx"
import { signLedgerTransaction, connectLedger } from "../../services/device/device"
import * as ethUtil from 'ethereumjs-util'

import { store } from "../../store"
import { getTranslate } from 'react-localize-redux'

const defaultDPath = "m/44'/60'/0'";

export default class Ledger {
  constructor(){
    this.translate = getTranslate(store.getState().locale)
  }

  getPublicKey = (path = defaultDPath) => {
    return new Promise((resolve, reject) => {
      connectLedger().then((eth) => {
        eth.getAddress_async(path, false, true)
          .then((result) => {
            result.dPath = path;
            resolve(result);
          })
          .fail((err) => {
            switch (err) {
							case 'Invalid status 6801':
							case 'Invalid status 6a80':
							case 'Invalid status 6804':
              reject(this.translate("error.check_right_application_selected") || 'Check to make sure the right application is selected')
								break;
							default:
              reject(this.translate("error.cannot_connect_ledger") || 'Cannot connect to ledger')
            }
          });
      });
    });
  }


  callSignTransaction = (funcName, ...args) => {
    const { txParams, keystring, } = keyService[funcName](...args)
    txParams.address_n = keystring
    return this.sealTx(txParams)
  }

  sealTx = (params) => {
    const eTx = new EthereumTx(params)
    eTx.raw[6] = Buffer.from([params.chainId])
    let txToSign = ethUtil.rlp.encode(eTx.raw)
    return new Promise((resolve, reject) => {
      connectLedger().then((eth) => {
        signLedgerTransaction(eth, params.address_n, txToSign.toString('hex')).then((response) => {
          if (response.status) {
            params.v = "0x" + response['v']
            params.r = "0x" + response['r']
            params.s = "0x" + response['s']
            var tx = new EthereumTx(params)
            resolve(tx);
          } else {
            reject(response.error)
          }
        })
      }).catch((err) => {
        reject(err)
      })
    })
  }
}
