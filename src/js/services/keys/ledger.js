import * as keyService from "./baseKey"
import EthereumTx from "ethereumjs-tx"
import { signLedgerTransaction, connectLedger } from "../../services/device/device"
import * as ethUtil from 'ethereumjs-util'

import { store } from "../../store"
import { CONFIG_ENV_LEDGER_LINK, LEDGER_SUPPORT_LINK } from "../constants"
import { getTranslate } from 'react-localize-redux'

const defaultDPath = "m/44'/60'/0'";

export default class Ledger {
  
  getPublicKey = (path = defaultDPath, isOpenModal) => {
    var translate = getTranslate(store.getState().locale)
    return new Promise((resolve, reject) => {
      connectLedger().then((eth) => {
        eth.getAddress_async(path, false, true)
          .then((result) => {
            result.dPath = path;
            resolve(result);
          })
          .fail((err) => {
            let errorMsg
            switch (err) {
              case 'Invalid status 6801':
                if (isOpenModal) {
                  errorMsg = translate("error.invalid_path_or_session_expired") || 'Cannot get address from this path. Please check your path is valid or Ledger is connected.'
                } else {
                  errorMsg = translate("error.ledger_time_out") || 'Your session on Ledger is expired. Please log in  again to continue.'
                }
                break
              case 'Invalid status 6a80':
              case 'Invalid status 6804':
                errorMsg = translate("error.path_is_invalid") || 'Invalid path. Please choose another one.'
                break
              default:
                if(err.errorCode == 1){
                  let link = CONFIG_ENV_LEDGER_LINK
                  errorMsg = translate("error.need_to_config_env_ledger", {link: link})
                }else{
                  let link = LEDGER_SUPPORT_LINK
                  errorMsg = translate("error.ledger_global_err", {link: link})
                }
            }
            reject(errorMsg)
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
