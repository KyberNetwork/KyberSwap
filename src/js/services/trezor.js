import ethUtil from "ethereumjs-util";
import HDKey from "hdkey";
import TrezorConnect from "./trezor-connect";

export default class Trezor {

    constructor() {
        this.defaultDPath = "m/44'/60'/0'/0";
        this.hdk = new HDKey();
        this.publicKeyReceived = false;
        // this.getPubData();
    }

    getPubData(){
        TrezorConnect.getXPubKey(this.defaultDPath, (result) => {
            if (result.success) {

                this.hdk.publicKey = new Buffer(result.publicKey, 'hex');
                this.hdk.chainCode = new Buffer(result.chainCode, 'hex');
                this.publicKeyReceived = true;

            } else {
                reject('Error: ', result.error);
            }
        });
    }

    generateAddress(index) {
        if (!this.publicKeyReceived) {
            return new Promise((resolve, reject) => {
                TrezorConnect.getXPubKey(this.defaultDPath, (result) => {
                    if (result.success) {
    
                        this.hdk.publicKey = new Buffer(result.publicKey, 'hex');
                        this.hdk.chainCode = new Buffer(result.chainCode, 'hex');
                        this.publicKeyReceived = true;
    
                        resolve(this.getAddressString(index));
    
                    } else {
                        reject('Error: ', result.error);
                    }
                });
            });
        }else{
            return this.getAddressString(index);
        }
    }

    getAddressString(index) {
        let path = this.defaultDPath + `/${index}`,
        derivedKey = this.hdk.derive(`m/${index}`);

        let address = ethUtil.publicToAddress(derivedKey.publicKey, true);
        let addressString = '0x' + address.toString('hex');
        return addressString;
    }

}
