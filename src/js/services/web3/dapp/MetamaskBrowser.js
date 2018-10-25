
import DappBrowser from "./DappBrowser"
// import * as common from "../../utils/common"
// import { verifyAccount } from "../utils/validators"
// import * as converters from "../utils/converter"

export default class MetamaskBrowser extends DappBrowser {

    getCoinbase() {
        return new Promise((resolve, reject) => {
          this.web3.eth.getCoinbase((error, result) => {
            console.log(error)
            if (error || !result) {
              var error = new Error("Cannot get coinbase")
              reject(error)
            } else {
              resolve(result)
            }
          })
        })
      } 

    getWalletType = () => {
        return "metamask"
    }

}