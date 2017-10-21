import ethUtil from "ethereumjs-util";
import HDKey from "hdkey";
import TrezorConnect from "./trezor-connect";

export default class Trezor {

    constructor() {
        this.defaultDPath = "m/44'/60'/0'/0";
        this.hdk = new HDKey();
        this.publicKeyReceived = false;
    }

    getPubData() {
        return new Promise((resolve, reject) => {
            TrezorConnect.getXPubKey(this.defaultDPath, (result) => {
                if (result.success) {

                    this.hdk.publicKey = new Buffer(result.publicKey, 'hex');
                    this.hdk.chainCode = new Buffer(result.chainCode, 'hex');
                    this.publicKeyReceived = true;

                    resolve('Success');

                } else {
                    reject('Error: ', result.error);
                }
            })
        });
    }

    getAddressString(index) {
        let path = this.defaultDPath + `/${index}`,
            derivedKey = this.hdk.derive(`m/${index}`);

        let address = ethUtil.publicToAddress(derivedKey.publicKey, true);
        let addressString = '0x' + address.toString('hex');
        return addressString;
    }

}
